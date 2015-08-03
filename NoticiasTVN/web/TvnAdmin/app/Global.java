
import backend.ServerInstance;
import exceptions.CouldNotCreateInstanceException;
import models.Config;
import play.Application;
import play.GlobalSettings;
import play.Logger;
import utils.Utils;


public class Global extends GlobalSettings {


	@Override
	public void onStart(Application app) {
        super.onStart(app);
        Logger.info("Application has started HECTICUS");
        try{
            ServerInstance.getInstance();
        } catch (CouldNotCreateInstanceException ex){
            Utils.printToLog(Global.class, "ERROR CRITICO Apagando " + Config.getString("app-name"), "No se pudo crear la instancia", true, ex, "support-level-1", Config.LOGGER_ERROR);
            super.onStop(app);
        }
	}  
	  
	@Override
	public void onStop(Application application) {
		Logger.info("Application shutdown...");
        try {
            ServerInstance.getInstance().shutdown();
        } catch (Exception ex) {

        }
        super.onStop(application);
	} 
	
}