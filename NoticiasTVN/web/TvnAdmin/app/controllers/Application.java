package controllers;


import views.html.*;
import play.*;
import play.mvc.*;
import play.mvc.Http.*;

import java.io.File;

public class Application extends Controller {
	
	@Security.Authenticated(Secured.class)
    public static Result index() {
    	return redirect(routes.Tvn.list(0, "sort", "asc", ""));			
    	
    }
	
    public static Result checkFile(String name){
        File file = new File(name);
        //Utils.printToLog(Application.class, "", "name : " + name +" - file :" + file.getAbsolutePath(), false, null, "", Config.LOGGER_ERROR);
        if(file.exists()){
            return ok("OK");
        }else{
            return badRequest("file not found");
        }
    }

    public static Result options(String url){
        response().setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        return ok("OK");
    }
  
}
