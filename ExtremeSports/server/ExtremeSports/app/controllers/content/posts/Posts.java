package controllers.content.posts;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import controllers.HecticusController;
import controllers.Wistia;
import controllers.content.athletes.Athletes;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.clients.Client;
import models.clients.ClientHasAthlete;
import models.clients.ClientHasCategory;
import models.content.posts.Category;
import models.content.posts.*;
import models.content.athletes.SocialNetwork;
import models.content.athletes.Athlete;
import play.data.Form;
import play.libs.Json;
import play.mvc.Http;
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

    final static Form<Post> PostAPIForm = form(Post.class);

    public static Result create() {
        try{
            Form<Post> postForm = PostAPIForm.bindFromRequest();
            Http.MultipartFormData body = getMultiformData();
            if(postForm.hasErrors()) {
                return badRequest(buildBasicResponse(1, "El formulario tiene errores"));
            }
            Post post = postForm.get();
            post.save();
            List<Http.MultipartFormData.FilePart> files = body.getFiles();
            if(files != null && !files.isEmpty()){
                try {
                    for (Http.MultipartFormData.FilePart filePart : files) {
                        String fileName = filePart.getFilename();
                        String contentType = filePart.getContentType();
                        File file = filePart.getFile();
                        String fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length());
                        FileType fileType = FileType.getByMimeType(contentType);
                        PostHasMedia postHasMedia = new PostHasMedia(post, fileType);
                        if (fileType != null) {
                            if (fileType.getName().equalsIgnoreCase("video")) {
                                ObjectNode wistiaResponse = Wistia.uploadVideo(file, fileName);
                                if (wistiaResponse != null) {
                                    String hashedId = wistiaResponse.get("hashed_id").asText();
                                    postHasMedia.setWistiaId(hashedId);
                                    postHasMedia.setLink(wistiaResponse.get("thumbnail").get("url").asText());
                                    String status = wistiaResponse.get("status").asText();
                                    if (status.equalsIgnoreCase("ready")) {
                                        ObjectNode videoInfo = Wistia.getVideo(hashedId);
                                        postHasMedia.setWistiaPlayer(videoInfo.get("embedCode").asText());
                                    }
                                } else {
                                    //TODO: ver que hacer con el error
                                }
                            } else {
                                postHasMedia.setLink(Utils.uploadAttachment(file, post.getIdPost(), fileExtension, true));
                                BufferedImage bimg = ImageIO.read(file);
                                postHasMedia.setHeight(bimg.getHeight());
                                postHasMedia.setWidth(bimg.getWidth());
                            }
                            String md5 = Utils.getMD5(file);
                            postHasMedia.setMd5(md5);
                            post.getMedia().add(postHasMedia);
                        } else {
                            return badRequest(buildBasicResponse(3, "Tipo de archivo invalido para " + fileName));
                        }
                    }
                    post.update();
                } catch (Exception e) {
                    e.printStackTrace();
                    return badRequest(buildBasicResponse(2, "El formulario tiene errores", e));
                }
            }
            post.refresh();
            return created(buildBasicResponse(0, "OK", post.toJson()));
        } catch (Exception ex) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error creando post con params", false, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-1, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        ObjectNode postData = getJson();
        try{
            ObjectNode response = null;
            Post post = Post.getByID(id);
            if(post != null) {
                boolean update = false;

                if(postData.has("remove_athletes")){
                    Iterator<JsonNode> removeAthletes = postData.get("remove_athletes").elements();
                    while (removeAthletes.hasNext()){
                        JsonNode next = removeAthletes.next();
                        Athlete athlete = Athlete.getByID(next.asInt());
                        if(athlete != null){
                            int index = post.getAthleteIndex(athlete);
                            if(index > -1){
                                post.getAthletes().remove(index);
                                update = true;
                            }
                        }
                    }
                }


                if(postData.has("add_athletes")){
                    Iterator<JsonNode> athletesIterator = postData.get("athletes").elements();
                    Athlete athlete = null;
                    PostHasAthlete postHasAthlete = null;
                    while (athletesIterator.hasNext()){
                        JsonNode next = athletesIterator.next();
                        if(next.isInt()){
                            athlete = Athlete.getByID(next.asInt());

                        } else {
                            ObjectNode athleteData = (ObjectNode) next;
                            if(athleteData.has("name")){
                                athlete = Athletes.createAthlete(athleteData);
                            }
                        }
                        if(athlete != null) {
                            postHasAthlete = new PostHasAthlete(post, athlete);
                            post.getAthletes().add(postHasAthlete);
                            update = true;
                        }
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
                        Language language = Language.getByID(next.asInt());
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
                            Language language = Language.getByID(next.get("language").asInt());
                            int index = post.getLocalizationIndex(language);
                            if(index == -1){
                                PostHasLocalization phl = new PostHasLocalization(post, language, next.get("title").asText(), next.get("content").asText());
                                post.getLocalizations().add(phl);
                                update = true;
                            }
                        }
                    }
                }

                if(postData.has("remove_categories")){
                    Iterator<JsonNode> removeCategories = postData.get("remove_categories").elements();
                    while (removeCategories.hasNext()){
                        JsonNode next = removeCategories.next();
                        Category category = Category.getByID(next.asInt());
                        if(category != null){
                            int index = post.getCategoryIndex(category);
                            if(index > -1){
                                post.getCategories().remove(index);
                                update = true;
                            }
                        }
                    }
                }

                if(postData.has("add_categories")){
                    Iterator<JsonNode> addCategories = postData.get("add_categories").elements();
                    while (addCategories.hasNext()){
                        JsonNode next = addCategories.next();
                        Category category = Category.getByID(next.asInt());
                        int index = post.getCategoryIndex(category);
                        if(index == -1){
                            PostHasCategory phc = new PostHasCategory(post, category);
                            post.getCategories().add(phc);
                            update = true;
                        }
                    }
                }

                if(postData.has("remove_countries")){
                    Iterator<JsonNode> removeCountries = postData.get("remove_countries").elements();
                    while (removeCountries.hasNext()){
                        JsonNode next = removeCountries.next();
                        Language language = Language.getByID(next.asInt());
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
                        Country country = Country.getByID(next.asInt());
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
                            FileType fileType = FileType.getByID(next.get("file_type").asInt());
                            int mainScreen = next.has("main_screen")?next.get("main_screen").asInt():0;
                            String file = next.get("file").asText();
                            String md5 = Utils.getMD5(Config.getString("ftp-route") + file);
                            int index = post.getMediaIndex(md5);
                            if(index == -1){
                                String path = Utils.uploadAttachment(file, "Post-"+post.getIdPost());
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

                return ok(buildBasicResponse(0, "OK", post.toJson()));
            } else {
                return notFound(buildBasicResponse(1, "No existe el registro a modificar"));
            }
        } catch (Exception ex) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error creando post con params" + postData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            Post post = Post.getByID(id);
            if(post != null) {
                ArrayList<String> files = new ArrayList<>();
                for(PostHasMedia postHasMedia : post.getMedia()){
                    if(postHasMedia.getFileType().getName().equalsIgnoreCase("video")){
                        Wistia.deleteVideo(postHasMedia.getWistiaId());
                    } else {
                        String link = postHasMedia.getLink();
                        link = link.substring(link.lastIndexOf("/")-1);
                        files.add(link);
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
                post.delete();
                return ok(buildBasicResponse(0, "OK", post.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a eliminar"));
            }
        } catch (Exception ex) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error eliminando el post " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id){
        try {
            String[] idClients = getFromQueryString("idClient");
            Client client = null;
            if(idClients != null && idClients.length > 0){
                int idClient = Integer.parseInt(idClients[0]);
                client = Client.getByID(idClient);
                if(client == null){
                    return notFound(buildBasicResponse(2, "no existe el cliente " + idClient));
                }
            }
            Post post = Post.getByID(id);
            if(post != null) {
                if(client != null){
                    return ok(buildBasicResponse(0, "OK", post.toJson(client.getLanguage())));
                }
                return ok(buildBasicResponse(0, "OK", post.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el post " + id));
            }
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error obteniendo el post " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page){
        try {

            Iterator<Post> postIterator = Post.getPage(pageSize, page);
            ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();
            while(postIterator.hasNext()){
                posts.add(postIterator.next().toJson());
            }
            return ok(buildBasicResponse(0, "OK", Json.toJson(posts)));
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando garotas", "error listando las garotas con pageSize " + pageSize + " y " + page, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result getPublicImages(){
        try {
            Iterator<PostHasMedia> postIterator = PostHasMedia.finder.where().eq("mainScreen", 1).setFirstRow(0).setMaxRows(10).findList().iterator();
            ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();
            while(postIterator.hasNext()){
                posts.add(postIterator.next().toJson());
            }
            return ok(buildBasicResponse(0, "OK", Json.toJson(posts)));
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando garotas", "error listando las imagenes ", true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result getRecentPosts(Integer id, Integer postId, Boolean newest, Integer idAthlete, Integer idCategory, Boolean onlyMedia, Boolean athletes,  Boolean categories){
        try {
            Client client = Client.getByID(id);
            Athlete athlete = null;
            Category category = null;
            if(idAthlete > 0){
                athlete = Athlete.getByID(idAthlete);
                if(athlete == null) {
                    return notFound(buildBasicResponse(2, "El atleta " + idAthlete + " no existe"));
                }
            } else if(idCategory > 0){
                category = Category.getByID(idCategory);
                if(category == null) {
                    return notFound(buildBasicResponse(2, "la categoria " + idCategory + " no existe"));
                }

            }
            if(client != null) {
                Country country = client.getCountry();
                Language language = client.getLanguage();
                Iterator<Post> postIterator = null;
                if(athletes || categories){
                    if(athletes && categories) {
                        postIterator = Post.getPosts(client.getRealAthletes(), client.getRealCategories(), country, language, postId, onlyMedia, newest);
                    } else if(athletes){
                        postIterator = Post.getPosts(client.getRealAthletes(), null, country, language, postId, onlyMedia, newest);
                    } else {
                        postIterator = Post.getPosts(null, client.getRealCategories(), country, language, postId, onlyMedia, newest);
                    }
                } else {
                    postIterator = Post.getPosts(athlete, category, country, language, postId, onlyMedia, newest);
                }
                ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();
                //buscamos sus favoritos tambien y agregamos esa info
                while(postIterator.hasNext()){
                    Post post = postIterator.next();
                    boolean favorite = false;
                    for(PostHasAthlete postHasAthlete : post.getAthletes()){
                        favorite |= client.getAthleteIndex(postHasAthlete.getAthlete()) != -1;
                    }
                    ObjectNode postJson;
                    List athleteList = new ArrayList();
                    for (int i = 0; i < post.getAthletes().size(); i++){
                        athleteList.add(post.getAthletes().get(i).getAthlete());
                    }
                    List categoryList = new ArrayList();
                    for (int i= 0; i < post.getCategories().size(); i++){
                        categoryList.add(post.getCategories().get(i).getCategory());
                    }
                    List<Post> athleteRelated = post.relatedByAthletes(athleteList, country, language);
                    ArrayList<ObjectNode> actualRelatedAthlete = new ArrayList<>();
                    for (int i= 0; i < athleteRelated.size();i++){
                        actualRelatedAthlete.add(athleteRelated.get(i).toJsonPreview(language));
                    }
                    List<Post> categoryRelated = post.relatedByCategory(categoryList, country, language);
                    ArrayList<ObjectNode> actualRelatedCategory = new ArrayList<>();
                    for (int i = 0; i < categoryRelated.size(); i++){
                        actualRelatedCategory.add(categoryRelated.get(i).toJsonPreview(language));
                    }

                    if(onlyMedia){
                        postJson = post.toJsonOnlyMedia(language);
                    }else{
                        postJson = post.toJson(language);
                    }
                    postJson.put("has_favorite", favorite);
                    postJson.put("athlete_related", Json.toJson(actualRelatedAthlete));
                    postJson.put("category_related", Json.toJson(actualRelatedCategory));
                    posts.add(postJson);
                }
                return ok(buildBasicResponse(0, "OK", Json.toJson(posts)));
            } else {
                return notFound(buildBasicResponse(2, "el cliente no existe"));
            }
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando garotas", "error listando los post recientes", true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result getListForAthlete(Integer id){
        try {
            Athlete athlete = Athlete.getByID(id);
            if(athlete != null) {
                Iterator<PostHasAthlete> postIterator = athlete.getPosts().iterator();
                ArrayList<ObjectNode> posts = new ArrayList<>();
                while(postIterator.hasNext()){
                    posts.add(postIterator.next().toJson());
                }
                return ok(buildBasicResponse(0, "OK", Json.toJson(posts)));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a consultar"));
            }
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error obteniendo el post " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result getPostForClient(Integer idClient, Integer idPost){
        try {
            Post post = Post.getByID(idPost);
            Client client = Client.getByID(idClient);
            if(post != null && client != null) {
                return ok(buildBasicResponse(0, "OK", post.toJson(client.getCountry().getLanguage())));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a consultar"));
            }
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando posts", "error obteniendo el post " + idPost + " para el client " + idClient, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    //obtenemos todos los post por categoria
    public static Result getPostForCategory(Integer idClient, Integer idCategory, Integer page, Integer pageSize){
        try {
            Client client = Client.getByID(idClient);
            ObjectNode response = null;
//            if(client != null) {
//                Country country = client.getCountry();
//                Language language = country.getLanguage();
//                //obtenemos todos los id de las mujeres de una categoria
//                List<PostHasCategory> athletesCat = PostHasCategory.finder.where().eq("id_category",idCategory).findList();
//                ArrayList athletes = new ArrayList();
//                for(int i=0; i<athletesCat.size(); i++){
//                    athletes.add(athletesCat.get(i).getAthlete().getIdAthlete());
//                }
//                Iterator<Post> postIterator = Post.finder.fetch("countries").fetch("localizations").fetch("athlete").where().
//                        eq("countries.country.idCountry", country.getIdCountry()).
//                        eq("localizations.language.idLanguage",language.getIdLanguage()).
//                        in("athlete.idAthlete",athletes).
//                        setFirstRow(pageSize*page).setMaxRows(pageSize).orderBy("date desc").findList().iterator();
//                ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();
//
//                //buscamos sus favoritos tambien y agregamos esa info
//                while(postIterator.hasNext()){
//                    Post post = postIterator.next();
//                    int index = 0; // client.getAthleteIndex(post.getPosts().getIdAthlete());
//                    ObjectNode postJson = post.toJson(language);
//                    if(index != -1){
//                        //si la tiene como favorita
//                        postJson.put("starred", true);
//                    }else{
//                        postJson.put("starred", false);
//                    }
//                    posts.add(postJson);
//                }
//                return ok(buildBasicResponse(0, "OK", Json.toJson(posts)));
//            } else {
//                return notFound(buildBasicResponse(2, "el cliente no existe"));
//            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando garotas", "error listando los post recientes", true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

}
