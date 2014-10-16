package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.providers.password.UsernamePasswordAuthProvider;
import com.feth.play.module.pa.user.AuthUser;
import models.User;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.content.posts.Post;
import models.content.posts.PostHasMedia;
import models.content.women.Woman;
import play.*;
import play.Routes;
import play.api.*;
import play.data.Form;
import play.libs.Json;
import play.mvc.*;

import providers.MyUsernamePasswordAuthProvider;
import utils.Utils;
import views.html.*;

import javax.persistence.OrderBy;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

public class Application extends Controller {

    public static final String FLASH_MESSAGE_KEY = "message";
    public static final String FLASH_ERROR_KEY = "error";
    public static final String USER_ROLE = "user";

//    public static Result index() {
//        return ok(index.render("Your new application is ready."));
//    }

    public static Result index(int page, String sortBy, String order, String filter) {
        return ok(
                index.render(Post.page(page, 6, sortBy, order, filter),sortBy, order, filter)
        );
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
            Iterator<Post> postIterator = Post.finder.where().setMaxRows(Config.getInt("post-to-main")).orderBy("rand()").findList().iterator();
            Language language = Language.finder.byId(Config.getInt("default-language"));
            ArrayList<ObjectNode> posts = new ArrayList<>();
            while(postIterator.hasNext()){
                posts.add(postIterator.next().toJson(language));
            }
            ObjectNode data = Json.newObject();
            data.put("app_version",Config.getString("app-version"));
            data.put("posts",Json.toJson(posts));
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


    public static Result getPost(Integer id) {
        Post objNews = Post.finder.byId(id);
        List<Country> countries = Country.finder.all();
        List<Language> languages = Language.finder.all();
        List<Woman> women = Woman.finder.all();
        File ftp = new File(Config.getString("ftp-route"));
        List<File> files = Arrays.asList(ftp.listFiles());
        ArrayList<String> filesToServe = new ArrayList<>();
        for(File f : files){
            filesToServe.add("/getImg/"+f.getName());
        }
        return ok(summary.render(objNews, filesToServe, countries, languages, women));
    }

    public static Result getImg(String name){
        try{
//            File file = play.api.Play.application(play.api.Play.current()).getFile(Config.getString("ftp-route") + name);
            File file = new File(Config.getString("ftp-route") + name);
            return ok(file);
        }catch (Exception ex){
            Utils.printToLog(Application.class, "", "Error en la imagen", false, ex, "", Config.LOGGER_ERROR);
            return badRequest("Error en la imagen " + name);
        }
    }


    /*Plugin Authenticate*/

    public static User getLocalUser(final Http.Session session) {
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
        final Form<MyUsernamePasswordAuthProvider.MyLogin> filledForm = MyUsernamePasswordAuthProvider.LOGIN_FORM
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
        final Form<MyUsernamePasswordAuthProvider.MySignup> filledForm = MyUsernamePasswordAuthProvider.SIGNUP_FORM
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
