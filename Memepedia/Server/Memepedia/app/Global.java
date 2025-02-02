import akka.actor.ActorSystem;
import akka.actor.Cancellable;
import backend.job.HecticusThread;
import backend.job.ThreadSupervisor;
import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.PlayAuthenticate.Resolver;
import com.feth.play.module.pa.exceptions.AccessDeniedException;
import com.feth.play.module.pa.exceptions.AuthException;
import models.SecurityRole;
import models.basic.Config;
import models.basic.Instance;
import play.Application;
import play.GlobalSettings;
import play.Logger;
import play.libs.F;
import play.mvc.Action;
import play.mvc.Call;
import play.mvc.Http;
import play.mvc.Result;
import scala.concurrent.duration.Duration;
import utils.Utils;
import controllers.*;

import java.io.BufferedReader;
import java.io.FileReader;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.concurrent.atomic.AtomicBoolean;

import static java.util.concurrent.TimeUnit.MINUTES;
import static java.util.concurrent.TimeUnit.SECONDS;

/**
 * Created by plesse on 10/6/14.
 */
public class Global  extends GlobalSettings {

    public static AtomicBoolean run = null;
    HecticusThread supervisor = null;

    private void initialData() {
        if (SecurityRole.find.findRowCount() == 0) {
            for (final String roleName : Arrays
                    .asList(controllers.Application.USER_ROLE)) {
                final SecurityRole role = new SecurityRole();
                role.roleName = roleName;
                role.save();
            }
        }
    }

    @Override
    public void onStart(Application application) {
        super.onStart(application);
        PlayAuthenticate.setResolver(new Resolver() {

            @Override
            public Call login() {
                // Your login page
                return routes.Application.login();
            }

            @Override
            public Call afterAuth() {
                // The user will be redirected to this page after authentication
                // if no original URL was saved
                return routes.Application.index();
            }

            @Override
            public Call afterLogout() {
                return routes.Application.index();
            }

            @Override
            public Call auth(final String provider) {
                // You can provide your own authentication implementation,
                // however the default should be sufficient for most cases
                return com.feth.play.module.pa.controllers.routes.Authenticate
                        .authenticate(provider);
            }

            @Override
            public Call askMerge() {
                return routes.Account.askMerge();
            }

            @Override
            public Call askLink() {
                return routes.Account.askLink();
            }

            @Override
            public Call onException(final AuthException e) {
                if (e instanceof AccessDeniedException) {
                    return routes.Signup
                            .oAuthDenied(((AccessDeniedException) e)
                                    .getProviderKey());
                }

                // more custom problem handling here...
                return super.onException(e);
            }
        });

        initialData();
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(Config.getString("server-ip-file")));
            Utils.serverIp = br.readLine();
            Instance actual = Instance.finder.where().eq("ip",Utils.serverIp).findUnique();
            if(actual != null) {
                Utils.test = actual.getTest() == 1;
                actual.setRunning(1);
                Instance.update(actual);
                Utils.actual = actual;
            } else {
                Utils.test = false;
                actual = new Instance(Utils.serverIp, Config.getString("app-name")+"-"+Utils.serverIp, 1);
                Instance.save(actual);
                Utils.actual = actual;
            }
        } catch (Exception ex) {
            Utils.test = false;
            Utils.serverIp = null;
            Utils.actual = null;
            Utils.printToLog(Global.class, "Error cargando el IP del servidor", "Ocurrio un error cargando el IP del servidor desde el archivo.", true, ex, "support-level-1", Config.LOGGER_ERROR);
        } finally {
            try {if (br != null)br.close();} catch (Exception ex) {}
        }
        if(Utils.actual == null) {
            Utils.printToLog(Global.class, null, "Arrancando " + Config.getString("app-name") + (Utils.serverIp == null ? "" : "-" + Utils.serverIp) + " test = " + Utils.test, false, null, "support-level-1", Config.LOGGER_INFO);
        } else {
            Utils.printToLog(Global.class, null, "Arrancando " + Utils.actual.getName() + " test = " + Utils.test, false, null, "support-level-1", Config.LOGGER_INFO);
        }
        ActorSystem system = ActorSystem.create("application");
        run = new AtomicBoolean(true);
        Utils.printToLog(Global.class, null, "Arrancando ThreadSupervisor", false, null, "support-level-1", Config.LOGGER_INFO);
        supervisor = new ThreadSupervisor(run, system);
        Cancellable cancellable = system.scheduler().schedule(Duration.create(1, SECONDS), Duration.create(5, MINUTES), supervisor, system.dispatcher());
        supervisor.setCancellable(cancellable);
    }

    @Override
    public void onStop(Application application) {
        try {
            if(Utils.serverIp != null) {
                Instance actual = Instance.finder.where().eq("ip", Utils.serverIp).findUnique();
                if (actual != null) {
                    actual.setRunning(0);
                    Instance.update(actual);
                } else {
                    actual = new Instance(Utils.serverIp, Config.getString("app-name") + Utils.serverIp, 0);
                    Instance.save(actual);
                }
            }
        } catch (Exception ex) {
            Utils.serverIp = null;
            Utils.printToLog(Global.class, "Error Actualizando instancia", "Ocurrio un error marcando la instancia como apagada, se continuara con el shutdown", true, ex, "support-level-1", Config.LOGGER_ERROR);
        }
        super.onStop(application);
        run.set(false);
        if(Utils.actual == null) {
            Utils.printToLog(Global.class, "Apagando " + Config.getString("app-name"), "Apagando " + Config.getString("app-name")+(Utils.serverIp==null?"":"-"+Utils.serverIp)+", se recibio la señal de shutdown", true, null, "support-level-1", Config.LOGGER_INFO);
        } else {
            Utils.printToLog(Global.class, "Apagando " + Config.getString("app-name"), "Apagando " + Utils.actual.getName() + ", se recibio la señal de shutdown", true, null, "support-level-1", Config.LOGGER_INFO);
        }
        supervisor.cancel();
    }

    @SuppressWarnings("rawtypes")
    Action newAction = new Action.Simple() {
        @Override
        public F.Promise<Result> call(Http.Context ctx) throws Throwable {
            F.Promise<String> promiseOfString = F.Promise.promise(
                    new F.Function0<String>() {
                        public String apply() {
                            return "You dont have access to this service, contact the Administrator for more information";
                        }
                    }
            );

            return promiseOfString.map(
                    new F.Function<String, Result>() {
                        public Result apply(String i) {
                            return forbidden(i);
                        }
                    }
            );
        }
    };

    @SuppressWarnings("rawtypes")
    @Override
    public Action onRequest(Http.Request request, Method actionMethod) {
        String ipString = request.remoteAddress();
        String invoker = actionMethod.getDeclaringClass().getName();
        String[] octetos = ipString.split("\\.");
        Logger.info("Pass request from " + ipString + " to " + invoker);
        return super.onRequest(request, actionMethod);
//        if(invoker.startsWith("controllers.apps") || invoker.startsWith("controllers.Application") || invoker.startsWith("controllers.events")){
//            if(ipString.equals("127.0.0.1") || ipString.startsWith("10.0.3")
//                    || (ipString.startsWith("10.182.") && Integer.parseInt(octetos[2]) <= 127 )
//                    || ipString.startsWith("10.181.")
//                    || ipString.startsWith("10.208.")
//                    || request.path().equals("190.14.219.174")
//                    || request.path().equals("201.249.204.73")
//                    || request.path().equals("186.74.13.178")){
//                if(!invoker.startsWith("controllers.Application")){
//                    Logger.info("Pass request from " + ipString + " to " + invoker);
//                }
//                return super.onRequest(request, actionMethod);
//            }else{
//                Logger.info("Deny request from "+ipString+" to "+invoker);
//                return newAction;
//            }
//        }else{
//            Logger.info("Deny request from "+ipString+" to "+invoker);
//            return newAction;
//        }
    }
}
