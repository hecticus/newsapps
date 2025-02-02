package controllers.content.posts;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import controllers.HecticusController;
import controllers.content.themes.Themes;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.clients.Client;
import models.content.posts.*;
import models.content.themes.Category;
import models.content.themes.SocialNetwork;
import models.content.themes.Theme;
import models.content.themes.ThemeHasCategory;
import play.data.Form;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;
import utils.Utils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

import static play.data.Form.form;

/**
 * Created by plesse on 10/1/14.
 */
public class Posts extends HecticusController {

    public final static Form<Post> POST_FORM = form(Post.class);






//    @Security.Authenticated(Secured.class)
//    public static Result index() {
//        return GO_HOME;
//    }
//
////    @Security.Authenticated(Secured.class)
//    public static Result blank() {
//        return ok(form.render(POST_FORM));
//    }

//    public static Result submit() throws IOException {
//        System.out.println("submit()");
//        Form<Post> filledForm = POST_FORM.bindFromRequest();
//
//        if(filledForm.hasErrors()) {
//            return badRequest(summary.render(filledForm));
//        }
//
//        Post gfilledForm = filledForm.get();
//        gfilledForm.setSort(Post.finder.findRowCount());
//        gfilledForm.save();
//
//        flash("success", "El Banner " + gfilledForm.getTheme().getName() + " ha sido creado");
//        return GO_HOME;
//
//    }





    public static Result create() {
        ObjectNode postData = getJson();
        try{
            ObjectNode response = null;
            if(postData.has("theme") && postData.has("localizations") && postData.has("media") && postData.has("countries") && postData.has("source") && postData.has("social_network")){
                Theme theme = null;
                if(postData.get("theme").isInt()){
                    theme = Theme.finder.byId(postData.get("theme").asInt());
                } else {
                    ObjectNode themeData = (ObjectNode) postData.get("theme");
                    if(themeData.has("name")){
                        theme = Themes.createTheme(themeData);
                    } else {
                        response = buildBasicResponse(1, "Faltan campos para crear el registro");
                        return ok(response);
                    }
                }
                if(theme == null){
                    response = buildBasicResponse(1, "Faltan campos para crear el registro");
                    return ok(response);
                }

                SocialNetwork socialNetwork = SocialNetwork.finder.byId(postData.get("social_network").asInt());
                if(socialNetwork == null){
                    response = buildBasicResponse(1, "Faltan campos para crear el registro");
                    return ok(response);
                }

                TimeZone tz = TimeZone.getDefault();
                Calendar actualDate = new GregorianCalendar(tz);
                SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmm");
                String date = sf.format(actualDate.getTime());
                Post post = new Post(theme, date, postData.get("source").asText(), socialNetwork);

                Iterator<JsonNode> localizationsIterator = postData.get("localizations").elements();
                ArrayList<PostHasLocalization> localizations = new ArrayList<>();
                while (localizationsIterator.hasNext()){
                    ObjectNode next = (ObjectNode)localizationsIterator.next();
                    if(next.has("language") && next.has("title") && next.has("content")){
                        Language language = Language.finder.byId(next.get("language").asInt());
                        PostHasLocalization phl = new PostHasLocalization(post, language, next.get("title").asText(), next.get("content").asText());
                        localizations.add(phl);
                    }
                }
                if(localizations.isEmpty()){
                    response = buildBasicResponse(1, "Faltan campos para crear el registro");
                    return ok(response);
                }
                post.setLocalizations(localizations);

                Iterator<JsonNode> countriesIterator = postData.get("countries").elements();
                ArrayList<PostHasCountry> countries = new ArrayList<>();
                while (countriesIterator.hasNext()){
                    JsonNode next = countriesIterator.next();
                    Country country = Country.finder.byId(next.asInt());
                    PostHasCountry phc = new PostHasCountry(post, country);
                    countries.add(phc);
                }
                if(countries.isEmpty()){
                    response = buildBasicResponse(1, "Faltan campos para crear el registro");
                    return ok(response);
                }
                post.setCountries(countries);

                Iterator<JsonNode> mediaIterator = postData.get("media").elements();
                ArrayList<PostHasMedia> media = new ArrayList<>();
                while (mediaIterator.hasNext()){
                    ObjectNode next = (ObjectNode)mediaIterator.next();
                    if(next.has("file") && next.has("file_type")){
                        FileType fileType = FileType.finder.byId(next.get("file_type").asInt());
                        int mainScreen = next.has("main_screen")?next.get("main_screen").asInt():0;
                        String file = next.get("file").asText();
                        String md5 = Utils.getMD5(Config.getString("ftp-route") + file);
                        String path = Utils.uploadAttachment(file, theme.getIdTheme());
                        BufferedImage bimg = ImageIO.read(new File(file));
                        int width = bimg.getWidth();
                        int height  = bimg.getHeight();
                        PostHasMedia phm = new PostHasMedia(post, fileType, md5, path, mainScreen, width, height);
                        media.add(phm);
                    }
                }
                if(media.isEmpty()){
                    response = buildBasicResponse(1, "Faltan campos para crear el registro");
                    return ok(response);
                }
                post.setMedia(media);

                if(postData.has("push")) {
                    post.setPush(postData.get("push").asInt());
                } else {
                    post.setPush(1);
                }
                if(postData.has("push_date")){
                    String pushDate = postData.get("push_date").asText();
                    Calendar pushDateCalendar = new GregorianCalendar(Integer.parseInt(pushDate.substring(0, 4)), Integer.parseInt(pushDate.substring(4, 6)) - 1, Integer.parseInt(pushDate.substring(6, 8)), Integer.parseInt(pushDate.substring(8, 10)), Integer.parseInt(pushDate.substring(10)));
                    post.setPushDate(pushDateCalendar.getTimeInMillis());
                } else {
                    post.setPushDate(actualDate.getTimeInMillis());
                }


                post.save();
                response = buildBasicResponse(0, "OK", post.toJson());
            } else {
                response = buildBasicResponse(1, "Faltan campos para crear el registro");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error creando post con params" + postData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        ObjectNode postData = getJson();
        try{
            ObjectNode response = null;
            Post post = Post.finder.byId(id);
            if(post != null) {
                boolean update = false;
                if(postData.has("theme")){
                    Theme theme = null;
                    if(postData.get("theme").isInt()){
                        theme = Theme.finder.byId(postData.get("theme").asInt());
                    } else {
                        ObjectNode themeData = (ObjectNode) postData.get("theme");
                        if(themeData.has("name")){
                            theme = Themes.createTheme(themeData);
                        } else {
                            response = buildBasicResponse(1, "Faltan campos para crear el registro");
                            return ok(response);
                        }
                    }
                    if(theme == null){
                        response = buildBasicResponse(1, "La modelo especificada no existe");
                        return ok(response);
                    }
                    if(theme != post.getTheme()){
                        post.setTheme(theme);
                        update = true;
                    }
                }

                if(postData.has("source")){
                    post.setSource(postData.get("source").asText());
                    update = true;
                }

                if(postData.has("remove_localizations")){
                    Iterator<JsonNode> removeLocalizations = postData.get("remove_localizations").elements();
                    while (removeLocalizations.hasNext()){
                        JsonNode next = removeLocalizations.next();
                        Language language = Language.finder.byId(next.asInt());
                        if(language != null){
                            int index = post.getLocalizationIndex(language);
                            if(index > -1){
                                post.getLocalizations().remove(index);
                                update = true;
                            }
                        }
                    }
                }

                if(postData.has("add_localizations")){
                    Iterator<JsonNode> addLocalizations = postData.get("add_localizations").elements();
                    while (addLocalizations.hasNext()){
                        ObjectNode next = (ObjectNode)addLocalizations.next();
                        if(next.has("language") && next.has("title") && next.has("content")){
                            Language language = Language.finder.byId(next.get("language").asInt());
                            int index = post.getLocalizationIndex(language);
                            if(index == -1){
                                PostHasLocalization phl = new PostHasLocalization(post, language, next.get("title").asText(), next.get("content").asText());
                                post.getLocalizations().add(phl);
                                update = true;
                            }
                        }
                    }
                }

                if(postData.has("remove_countries")){
                    Iterator<JsonNode> removeCountries = postData.get("remove_countries").elements();
                    while (removeCountries.hasNext()){
                        JsonNode next = removeCountries.next();
                        Language language = Language.finder.byId(next.asInt());
                        if(language != null){
                            int index = post.getLocalizationIndex(language);
                            if(index > -1){
                                post.getLocalizations().remove(index);
                                update = true;
                            }
                        }
                    }
                }

                if(postData.has("add_countries")){
                    Iterator<JsonNode> addCountries = postData.get("add_countries").elements();
                    while (addCountries.hasNext()){
                        JsonNode next = addCountries.next();
                        Country country = Country.finder.byId(next.asInt());
                        int index = post.getCountryIndex(country);
                        if(index == -1){
                            PostHasCountry phc = new PostHasCountry(post, country);
                            post.getCountries().add(phc);
                            update = true;
                        }
                    }
                }

                if(postData.has("remove_media")){
                    Iterator<JsonNode> removeMedia = postData.get("remove_media").elements();
                    ArrayList<String> files = new ArrayList<>();
                    while (removeMedia.hasNext()){
                        JsonNode next = removeMedia.next();
                        String md5 = next.asText();
                        if(md5 != null){
                            int index = post.getMediaIndex(md5);
                            if(index > -1){
                                String link = post.getMedia().get(index).getLink();
                                link = link.substring(link.lastIndexOf("/")-1);
                                files.add(link);
                                post.getMedia().remove(index);
                                update = true;
                            }
                        }
                    }
                    if(!files.isEmpty()){
                        String containerName = Config.getString("cdn-container");
                        String username = Config.getString("rackspace-username");
                        String apiKey = Config.getString("rackspace-apiKey");
                        String provider = Config.getString("rackspace-provider");
                        RackspaceDelete rackspaceDelete = new RackspaceDelete(username, apiKey, provider);
                        rackspaceDelete.deleteObjectsFromContainer(containerName, files);
                    }
                }

                if(postData.has("add_media")){
                    Iterator<JsonNode> addMedia = postData.get("add_media").elements();
                    ArrayList<PostHasMedia> media = new ArrayList<>();
                    while (addMedia.hasNext()){
                        ObjectNode next = (ObjectNode)addMedia.next();
                        if(next.has("file") && next.has("file_type")){
                            FileType fileType = FileType.finder.byId(next.get("file_type").asInt());
                            int mainScreen = next.has("main_screen")?next.get("main_screen").asInt():0;
                            String file = next.get("file").asText();
                            String md5 = Utils.getMD5(Config.getString("ftp-route") + file);
                            int index = post.getMediaIndex(md5);
                            if(index == -1){
                                String path = Utils.uploadAttachment(file, post.getTheme().getIdTheme());
                                BufferedImage bimg = ImageIO.read(new File(file));
                                int width = bimg.getWidth();
                                int height  = bimg.getHeight();
                                PostHasMedia phm = new PostHasMedia(post, fileType, md5, path, mainScreen, width, height);
                                post.getMedia().add(phm);
                                update = true;
                            }
                        }
                    }
                }

                if(update){
                    post.update();
                }

                response = buildBasicResponse(0, "OK", post.toJson());
            } else {
                response = buildBasicResponse(1, "No existe el registro a modificar");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error creando post con params" + postData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            ObjectNode response = null;
            Post post = Post.finder.byId(id);
            if(post != null) {
                List<PostHasMedia> media = post.getMedia();
                if(!media.isEmpty()){
                    String containerName = Config.getString("cdn-container");
                    String username = Config.getString("rackspace-username");
                    String apiKey = Config.getString("rackspace-apiKey");
                    String provider = Config.getString("rackspace-provider");
                    RackspaceDelete rackspaceDelete = new RackspaceDelete(username, apiKey, provider);
                    ArrayList<String> files = new ArrayList<>(media.size());
                    for(PostHasMedia phm : media){
                        String link = phm.getLink();
                        link = link.substring(link.lastIndexOf("/")-1);
                        files.add(link);
                    }
                    rackspaceDelete.deleteObjectsFromContainer(containerName, files);
                }
                post.delete();
                response = buildBasicResponse(0, "OK", post.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a eliminar");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error eliminando el post " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id){
        try {
            ObjectNode response = null;
            Post post = Post.finder.byId(id);
            if(post != null) {
                response = buildBasicResponse(0, "OK", post.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error obteniendo el post " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page){
        try {

            Iterator<Post> postIterator = null;
            if(pageSize == 0){
                postIterator = Post.finder.all().iterator();
            }else{
                postIterator = Post.finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
            }

            ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();
            while(postIterator.hasNext()){
                posts.add(postIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(posts));
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando garotas", "error listando las garotas con pageSize " + pageSize + " y " + page, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result getPublicImages(){
        try {
            Iterator<PostHasMedia> postIterator = PostHasMedia.finder.where().eq("mainScreen", 1).setFirstRow(0).setMaxRows(10).findList().iterator();
            ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();
            while(postIterator.hasNext()){
                posts.add(postIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(posts));
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando garotas", "error listando las imagenes ", true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result getRecentPosts(Integer id, Integer postId, Boolean newest, Integer idTheme, Integer idCategory, Boolean onlyMedia){
        try {
            Client client = Client.finder.byId(id);
            Theme theme = null;
            Category category = null;
            ObjectNode response = null;
            if(idTheme > 0){
                theme = Theme.finder.byId(idTheme);
                if(theme == null) {
                    response = buildBasicResponse(2, "la mujer no existe");
                    return ok(response);
                }
            } else if(idCategory > 0){
                category = Category.finder.byId(idCategory);
                if(category == null) {
                    response = buildBasicResponse(2, "la categoria no existe");
                    return ok(response);
                }

            }
            if(client != null) {
                Country country = client.getCountry();
                Language language = country.getLanguage();
                Iterator<Post> postIterator = null;
                int maxRows = Config.getInt("post-to-deliver");
                if(onlyMedia){
                    maxRows = 1;
                }
                ArrayList<Integer> genders = new ArrayList<>();
                if(client.getGender().getIdGender() == 3){
                    genders.add(1);
                    genders.add(2);
                    genders.add(3);
                }else{
                    genders.add(client.getGender().getIdGender());
                    genders.add(3);
                }
                if(postId > 0) {
                    if(theme != null) {
                        if (newest) {
//                            System.out.println("ThemePostNewest");
                            postIterator = Post.finder.fetch("countries").fetch("localizations").where().gt("idPost", postId).eq("theme.idTheme", theme.getIdTheme()).eq("countries.country.idCountry", country.getIdCountry()).eq("localizations.language.idLanguage", language.getIdLanguage()).in("gender.idGender", genders).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                        } else {
//                            System.out.println("ThemePostOldest");
                            postIterator = Post.finder.fetch("countries").fetch("localizations").where().lt("idPost", postId).eq("theme.idTheme", theme.getIdTheme()).eq("countries.country.idCountry", country.getIdCountry()).eq("localizations.language.idLanguage", language.getIdLanguage()).in("gender.idGender", genders).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                        }
                    } else if (category != null){
                        if (newest) {
//                            System.out.println("CategoryPostNewest");
                            postIterator = Post.finder.fetch("countries").fetch("localizations").where().gt("idPost", postId).eq("theme.categories.category.idCategory", category.getIdCategory()).eq("countries.country.idCountry", country.getIdCountry()).eq("localizations.language.idLanguage", language.getIdLanguage()).in("gender.idGender", genders).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                        } else {
//                            System.out.println("CategoryPostOldest");
                            postIterator = Post.finder.fetch("countries").fetch("localizations").where().lt("idPost", postId).eq("theme.categories.category.idCategory", category.getIdCategory()).eq("countries.country.idCountry", country.getIdCountry()).eq("localizations.language.idLanguage", language.getIdLanguage()).in("gender.idGender", genders).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                        }
                    } else {
                        if (newest) {
//                            System.out.println("PostNewest");
                            postIterator = Post.finder.fetch("countries").fetch("localizations").where().gt("idPost", postId).eq("countries.country.idCountry", country.getIdCountry()).eq("localizations.language.idLanguage", language.getIdLanguage()).in("gender.idGender", genders).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                        } else {
//                            System.out.println("PostOldest");
                            postIterator = Post.finder.fetch("countries").fetch("localizations").where().lt("idPost", postId).eq("countries.country.idCountry", country.getIdCountry()).eq("localizations.language.idLanguage", language.getIdLanguage()).in("gender.idGender", genders).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                        }
                    }
                } else {
                    if(theme != null) {
//                        System.out.println("ThemePost");
                        postIterator = Post.finder.fetch("countries").fetch("localizations").where().eq("theme.idTheme", theme.getIdTheme()).eq("countries.country.idCountry", country.getIdCountry()).eq("localizations.language.idLanguage", language.getIdLanguage()).in("gender.idGender", genders).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                    } else if (category != null){
//                        System.out.println("CategoryPost");
                        postIterator = Post.finder.fetch("countries").fetch("localizations").where().eq("theme.categories.category.idCategory", category.getIdCategory()).eq("countries.country.idCountry", country.getIdCountry()).eq("localizations.language.idLanguage", language.getIdLanguage()).in("gender.idGender", genders).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                    } else {
//                        System.out.println("Post");
                        postIterator = Post.finder.fetch("countries").fetch("localizations").where().eq("countries.country.idCountry", country.getIdCountry()).eq("localizations.language.idLanguage", language.getIdLanguage()).in("gender.idGender", genders).setFirstRow(0).setMaxRows(maxRows).orderBy("date desc").findList().iterator();
                    }
                }
                ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();
                //buscamos sus favoritos tambien y agregamos esa info
                while(postIterator.hasNext()){
                    Post post = postIterator.next();
                    int index = client.getThemeIndex(post.getTheme().getIdTheme());
                    ObjectNode postJson;
                    if(onlyMedia){
                        postJson = post.toJsonOnlyMedia(language);
                    }else{
                        postJson = post.toJson(language);
                    }
                    if(index != -1){
                        //si la tiene como favorita
                        postJson.put("starred", true);
                    }else{
                        postJson.put("starred", false);
                    }
                    posts.add(postJson);
                }
                response = buildBasicResponse(0, "OK", Json.toJson(posts));
            } else {
                response = buildBasicResponse(2, "el cliente no existe");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando garotas", "error listando los post recientes", true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result getListForTheme(Integer id){
        try {
            ObjectNode response = null;
            Theme theme = Theme.finder.byId(id);
            if(theme != null) {
                Iterator<Post> postIterator = theme.getPosts().iterator();
                ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();
                while(postIterator.hasNext()){
                    posts.add(postIterator.next().toJson());
                }
                response = buildBasicResponse(0, "OK", Json.toJson(posts));
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error obteniendo el post " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result getPostForClient(Integer idClient, Integer idPost){
        try {
            ObjectNode response = null;
            Post post = Post.finder.byId(idPost);
            Client client = Client.finder.byId(idClient);
            if(post != null && client != null) {
                response = buildBasicResponse(0, "OK", post.toJson(client.getCountry().getLanguage()));
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error obteniendo el post " + idPost + " para el client " + idClient, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    //obtenemos todos los post por categoria
    public static Result getPostForCategory(Integer idClient, Integer idCategory, Integer page, Integer pageSize){
        try {
            Client client = Client.finder.byId(idClient);
            ObjectNode response = null;
            if(client != null) {
                Country country = client.getCountry();
                Language language = country.getLanguage();
                //obtenemos todos los id de las mujeres de una categoria
                List<ThemeHasCategory> themesCat = ThemeHasCategory.finder.where().eq("id_category",idCategory).findList();
                ArrayList themes = new ArrayList();
                for(int i=0; i<themesCat.size(); i++){
                    themes.add(themesCat.get(i).getTheme().getIdTheme());
                }
                Iterator<Post> postIterator = Post.finder.fetch("countries").fetch("localizations").fetch("theme").where().
                        eq("countries.country.idCountry", country.getIdCountry()).
                        eq("localizations.language.idLanguage",language.getIdLanguage()).
                        in("theme.idTheme",themes).
                        setFirstRow(pageSize*page).setMaxRows(pageSize).orderBy("date desc").findList().iterator();
                ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();

                //buscamos sus favoritos tambien y agregamos esa info
                while(postIterator.hasNext()){
                    Post post = postIterator.next();
                    int index = client.getThemeIndex(post.getTheme().getIdTheme());
                    ObjectNode postJson = post.toJson(language);
                    if(index != -1){
                        //si la tiene como favorita
                        postJson.put("starred", true);
                    }else{
                        postJson.put("starred", false);
                    }
                    posts.add(postJson);
                }
                response = buildBasicResponse(0, "OK", Json.toJson(posts));
            } else {
                response = buildBasicResponse(2, "el cliente no existe");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando garotas", "error listando los post recientes", true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

}
