
import backend.ServerInstance;
import exceptions.CouldNotCreateInstanceException;
import models.Config;
import play.Application;
import play.GlobalSettings;
import play.Logger;
import play.libs.F;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import utils.Utils;

import java.lang.reflect.Method;


public class Global extends GlobalSettings {

	@Override
	public void onStart(Application app) {
        super.onStart(app);
        try{
            ServerInstance.getInstance();
        } catch (CouldNotCreateInstanceException ex){
            Utils.printToLog(Global.class, "ERROR CRITICO Apagando " + Config.getString("app-name"), "No se pudo crear la instancia", true, ex, "support-level-1", Config.LOGGER_ERROR);
            super.onStop(app);
        }
	}  
	  
	@Override
	public void onStop(Application application) {
        try {
            ServerInstance.getInstance().shutdown();
        } catch (Exception ex) {

        }
        super.onStop(application);
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

    private class ActionWrapper extends Action.Simple {
        public ActionWrapper(Action<?> action) {
            this.delegate = action;
        }

        @Override
        public F.Promise<Result> call(Http.Context ctx) throws java.lang.Throwable {
            F.Promise<Result> result = this.delegate.call(ctx);
            Http.Response response = ctx.response();
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, HECTICUS-X-AUTH-TOKEN");
            return result;
        }
    }

    @SuppressWarnings("rawtypes")
    @Override
    public Action onRequest(Http.Request request, Method actionMethod) {
        String ipString = request.remoteAddress();
        String invoker = actionMethod.getDeclaringClass().getName();
        String[] octetos = ipString.split("\\.");
        if(invoker.startsWith("controllers.news") ||
                invoker.startsWith("controllers.footballapi") ||
                invoker.startsWith("controllers.Application") ||
                invoker.startsWith("controllers.events") ||
                invoker.startsWith("controllers.UsersView") ||
                invoker.startsWith("controllers.NewsView") ||
                invoker.startsWith("controllers.Instances") ||
                invoker.startsWith("controllers.ConfigsView")){
            if(ipString.equals("127.0.0.1") || ipString.startsWith("10.0.3")
                    || (ipString.startsWith("10.182.") && Integer.parseInt(octetos[2]) <= 127 )
                    || ipString.startsWith("10.181.")
                    || ipString.startsWith("10.208.")
                    || request.path().equals("190.14.219.174")
                    || request.path().equals("201.249.204.73")
                    || request.path().equals("186.74.13.178")){
                if(!invoker.startsWith("controllers.Application")){
                    Logger.info("Pass request from " + ipString + " to " + invoker);
                }
//                return super.onRequest(request, actionMethod);
                return new ActionWrapper(super.onRequest(request, actionMethod));
            }else{
                Logger.info("Deny request from " + ipString + " to " + invoker);
                return new ActionWrapper(newAction);
            }
        }else{
            Logger.info("Deny request from " + ipString + " to " + invoker);
            return new ActionWrapper(newAction);
        }
    }
	
}