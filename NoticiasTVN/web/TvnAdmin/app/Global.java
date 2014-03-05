
import play.*;


public class Global extends GlobalSettings {

	@Override
	public void onStart(Application app) {
		Logger.info("Application has started HECTICUS");
	}  
	  
	@Override
	public void onStop(Application app) {
		Logger.info("Application shutdown...");
	} 
	
}