package controllers;

import play.mvc.*;
import views.html.*;
import java.io.File;

public class Application extends Controller {
		
    public static Result index() {
        return ok(index.render());
		//return redirect(routes.Tvn.list(0, "sort", "asc", ""));				
    }

    public static Result checkFile(String name){
        File file = new File(name);
//        Utils.printToLog(Application.class, "", "name : " + name +" - file :" + file.getAbsolutePath(), false, null, "", Config.LOGGER_ERROR);
        if(file.exists()){
            return ok("OK");
        }else{
            return badRequest("file not found");
        }
    }
  
}
