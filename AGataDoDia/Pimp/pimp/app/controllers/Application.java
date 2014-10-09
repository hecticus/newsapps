package controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.basic.Config;
import models.content.posts.PostHasMedia;
import play.*;
import play.libs.Json;
import play.mvc.*;

import utils.Utils;
import views.html.*;

import javax.persistence.OrderBy;
import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;

public class Application extends Controller {

    public static Result index() {
        return ok(index.render("Your new application is ready."));
    }

    public static Result checkFile(String name){
        File file = new File(name);
        //Logger.info("nameFile "+name+", path "+file.getAbsolutePath());
        if(file.exists()){
            return ok("OK");
        }else{
            return badRequest("file not found");
        }
    }

    public static Result getAppSettings(){
        try {
            Iterator<PostHasMedia> postIterator = PostHasMedia.finder.where().eq("mainScreen", 1).setMaxRows(4).orderBy("rand()").findList().iterator();
            ArrayList<String> posts = new ArrayList<String>();
            while(postIterator.hasNext()){
                posts.add(postIterator.next().getLink());
            }
            ObjectNode data = Json.newObject();
            data.put("app_version",Config.getString("app-version"));
            data.put("img",Json.toJson(posts));
            ObjectNode response = Json.newObject();
            response.put(Config.ERROR_KEY, 0);
            response.put(Config.DESCRIPTION_KEY, "OK");
            response.put(Config.RESPONSE_KEY,data);
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Application.class, "Error manejando settings", "obteniendo los settings del app ", true, e, "support-level-1", Config.LOGGER_ERROR);
            ObjectNode response = Json.newObject();
            response.put(Config.ERROR_KEY, 1);
            response.put(Config.DESCRIPTION_KEY, "Error buscando el registro");
            response.put(Config.EXCEPTION_KEY, e.getMessage());
            return badRequest(response);
        }
    }

}
