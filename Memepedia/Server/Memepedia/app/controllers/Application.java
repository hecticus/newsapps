package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.providers.password.UsernamePasswordAuthProvider;
import com.feth.play.module.pa.user.AuthUser;
import models.User;
import models.basic.Config;
import models.content.feature.FeaturedImageHasResolution;
import models.content.feature.Resolution;
import models.content.posts.Post;
import play.Routes;
import play.data.Form;
import play.libs.Json;
import play.mvc.*;
import play.mvc.Http.Session;

import providers.MyUsernamePasswordAuthProvider;
import providers.MyUsernamePasswordAuthProvider.MyLogin;
import providers.MyUsernamePasswordAuthProvider.MySignup;
import utils.Utils;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

import views.html.*;

public class Application extends Controller {

    public static final String FLASH_MESSAGE_KEY = "message";
    public static final String FLASH_ERROR_KEY = "error";
    public static final String USER_ROLE = "user";
    public static final String ADMIN_ROLE = "admin";

    @Restrict(@Group(Application.USER_ROLE))
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

    public static Result getAppSettings(Integer width, Integer height){
        try {
            ObjectNode data = Json.newObject();
            data.put("company_name", Config.getString("company-name"));
            data.put("app_version",Config.getString("app-version"));
            ObjectNode response = Json.newObject();

            //feature images
            List<Resolution> resolutions = Resolution.finder.where().ge("width", width).ge("height", height).orderBy("width asc").findList();
            Resolution resolution = null;
            if(resolutions == null || resolutions.isEmpty()){
                resolutions = Resolution.finder.orderBy("width desc").findList();
            }
            if(resolutions != null && !resolutions.isEmpty()) {
                resolution = resolutions.get(0);
                List<FeaturedImageHasResolution> featuredImageHasResolutions = FeaturedImageHasResolution.finder.where().eq("resolution.idResolution", resolution.getIdResolution()).orderBy("rand()").findList();
                if(featuredImageHasResolutions != null && !featuredImageHasResolutions.isEmpty()){
                    data.put("feature_image", featuredImageHasResolutions.get(0).toJson());
                } else {
                }
            } else {
            }
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
        System.out.println("Application ESTO SE VE!!!!");
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

}
