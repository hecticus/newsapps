
import akka.actor.ActorSystem;
import akka.actor.Cancellable;
import job.HecticusThread;
import job.ThreadSupervisor;
import models.Config;
import models.basic.Instance;
import play.*;
import scala.concurrent.duration.Duration;
import utils.Utils;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.concurrent.atomic.AtomicBoolean;

import static java.util.concurrent.TimeUnit.MINUTES;
import static java.util.concurrent.TimeUnit.SECONDS;


public class Global extends GlobalSettings {

    public static AtomicBoolean run = null;
    HecticusThread supervisor = null;
    private static boolean isMaster = false;

	@Override
	public void onStart(Application app) {
        super.onStart(app);
        Logger.info("Application has started HECTICUS");
        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(Config.getString("server-ip-file")));
            Utils.serverIp = br.readLine();
            Instance actual = Instance.finder.where().eq("ip",Utils.serverIp).findUnique();
            if(actual != null) {
                actual.setRunning(1);
                Instance.update(actual);
                Utils.actual = actual;
                isMaster = actual.isMaster();
            } else {
                actual = new Instance(Utils.serverIp, Config.getString("app-name")+"-"+Utils.serverIp, 1);
                Instance.save(actual);
                Utils.actual = actual;
            }
        } catch (Exception ex) {
            Utils.serverIp = null;
            Utils.actual = null;
            Utils.printToLog(Global.class, "Error cargando el IP del servidor", "Ocurrio un error cargando el IP del servidor desde el archivo. Football Brazil continuara", true, ex, "support-level-1", Config.LOGGER_ERROR);
        } finally {
            try {if (br != null)br.close();} catch (Exception ex) {}
        }
        if(Utils.actual == null) {
            Utils.printToLog(Global.class, null, "Arrancando " + Config.getString("app-name") + (Utils.serverIp == null ? "" : "-" + Utils.serverIp), false, null, "support-level-1", Config.LOGGER_INFO);
        } else {
            Utils.printToLog(Global.class, null, "Arrancando " + Utils.actual.getName(), false, null, "support-level-1", Config.LOGGER_INFO);
        }
        ActorSystem system = ActorSystem.create("application");
        run = new AtomicBoolean(true);
        Utils.run = run;
        if (isMaster) {
            Utils.printToLog(Global.class, null, "Arrancando ThreadSupervisor", false, null, "support-level-1", Config.LOGGER_INFO);
            supervisor = new ThreadSupervisor(run, system);
            Cancellable cancellable = system.scheduler().schedule(Duration.create(1, SECONDS), Duration.create(2, MINUTES), supervisor, system.dispatcher());
            supervisor.setCancellable(cancellable);
            Utils.supervisor = (ThreadSupervisor)supervisor;
        }
	}  
	  
	@Override
	public void onStop(Application application) {
		Logger.info("Application shutdown...");
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
        if(supervisor != null) {
            supervisor.cancel();
        }
	} 
	
}