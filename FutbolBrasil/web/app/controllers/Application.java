package controllers;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

import models.*;
import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.providers.password.UsernamePasswordAuthProvider;
import com.feth.play.module.pa.user.AuthUser;

import models.basic.Config;
import models.news.News;
import models.news.Resource;
import play.*;
import play.data.Form;
import play.libs.Json;
import play.mvc.*;
import play.mvc.Http.Session;
import providers.MyUsernamePasswordAuthProvider;
import providers.MyUsernamePasswordAuthProvider.MyLogin;
import providers.MyUsernamePasswordAuthProvider.MySignup;
import utils.Utils;
import views.html.*;

public class Application extends Controller {

	public static final String FLASH_MESSAGE_KEY = "message";
	public static final String FLASH_ERROR_KEY = "error";
	public static final String USER_ROLE = "user";
	
	public static ObjectNode getJson(){
        ObjectNode jsonInfo = (ObjectNode) request().body().asJson();
        if(jsonInfo == null){
            Map<String,String[]> b = request().body().asFormUrlEncoded();
            if(b == null){
                return null;
            }
            jsonInfo = Json.newObject();
            Set<String> keys = b.keySet();
            Iterator<String> it = keys.iterator();
            while(it.hasNext()){
                String key = (String)it.next();
                jsonInfo.put(key, Json.toJson(b.get(key)[0]));
            }
        }
        return jsonInfo;
    }
	
    public static Result index(int page, String sortBy, String order, String filter) {
    	return ok(
    		index.render(News.page(page, 6, sortBy, order, filter),
    				sortBy, order, filter)
    	);    	
    }
  
    /*Plugin Authenticate*/    
    
    public static User getLocalUser(final Session session) {
		final AuthUser currentAuthUser = PlayAuthenticate.getUser(session);
		final User localUser = User.findByAuthUserIdentity(currentAuthUser);
		return localUser;
	}

	@Restrict(@Group(Application.USER_ROLE))
	public static Result restricted() {
		final User localUser = getLocalUser(session());
		return ok(restricted.render(localUser));
	}

	@Restrict(@Group(Application.USER_ROLE))
	public static Result profile() {
		final User localUser = getLocalUser(session());
		return ok(profile.render(localUser));
	}

	public static Result login() {
		return ok(login.render(MyUsernamePasswordAuthProvider.LOGIN_FORM));
	}

	public static Result doLogin() {
		com.feth.play.module.pa.controllers.Authenticate.noCache(response());				
		final Form<MyLogin> filledForm = MyUsernamePasswordAuthProvider.LOGIN_FORM
				.bindFromRequest();
		if (filledForm.hasErrors()) {
			// User did not fill everything properly
			System.out.println("AQUI ESTAMOS!!! CON ERROR!");
			return badRequest(login.render(filledForm));
		} else {
			// Everything was filled
			return UsernamePasswordAuthProvider.handleLogin(ctx());
		}
	}

	public static Result signup() {
		return ok(signup.render(MyUsernamePasswordAuthProvider.SIGNUP_FORM));
	}

	public static Result jsRoutes() {
		return ok(
				Routes.javascriptRouter("jsRoutes", controllers.routes.javascript.Signup.forgotPassword()))
				.as("text/javascript");
	}

	public static Result doSignup() {
		com.feth.play.module.pa.controllers.Authenticate.noCache(response());
		final Form<MySignup> filledForm = MyUsernamePasswordAuthProvider.SIGNUP_FORM
				.bindFromRequest();
		if (filledForm.hasErrors()) {
			// User did not fill everything properly
			return badRequest(signup.render(filledForm));
		} else {
			// Everything was filled
			// do something with your part of the form before handling the user
			// signup
			return UsernamePasswordAuthProvider.handleSignup(ctx());
		}
	}

	public static String formatTimestamp(final long t) {
		return new SimpleDateFormat("yyyy-dd-MM HH:mm:ss").format(new Date(t));
	}    
    
    //NEWS VIEW
    public static Result getNewsById(Long id) {
        News objNews = News.getNewsById(id);
        List<Resource> lstResource = Resource.getAllResourcesAvailable();
        //List<Resource> lstResource = Resource.getAllResource();
        return ok(summary.render(objNews, lstResource));
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

    //Initial load settings WS for the Mobile App
    public static Result getAppSettings(Integer width, Integer height){
        try {
            ObjectNode data = Json.newObject();
            data.put("company_name", Config.getString("company-name"));
            data.put("app_version",Config.getString("app-version"));
            ObjectNode response = Json.newObject();

            data.put("build_version", Config.getString("build-version"));
            //colocamos la configuracion de upstream para que la tengamos en la app
            data.put("upstreamAppKey", Config.getString("upstreamAppKey"));
            data.put("upstreamAppVersion", Config.getString("upstreamAppVersion"));
            data.put("upstreamServiceID", Config.getString("upstreamServiceID"));
            data.put("upstreamURL", Config.getString("upstreamURL"));

            data.put("server_version", Config.getString("server-version"));

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
