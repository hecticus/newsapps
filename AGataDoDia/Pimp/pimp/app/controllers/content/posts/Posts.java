package controllers.content.posts;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.Rackspace;
import com.hecticus.rackspacecloud.RackspaceDelete;
import controllers.HecticusController;
import controllers.content.women.Women;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.content.posts.*;
import models.content.women.Woman;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;
import utils.Utils;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by plesse on 10/1/14.
 */
public class Posts extends HecticusController {

    public static Result create() {
        ObjectNode postData = getJson();
        try{
            ObjectNode response = null;
            if(postData.has("woman") && postData.has("localizations") && postData.has("media") && postData.has("countries") && postData.has("source") ){
                Woman woman = null;
                if(postData.get("woman").isInt()){
                    woman = Woman.finder.byId(postData.get("woman").asInt());
                } else {
                    ObjectNode womanData = (ObjectNode) postData.get("woman");
                    if(womanData.has("name")){
                        woman = Women.createWoman(womanData);
                    } else {
                        response = buildBasicResponse(1, "Faltan campos para crear el registro");
                        return ok(response);
                    }
                }
                if(woman == null){
                    response = buildBasicResponse(1, "Faltan campos para crear el registro");
                    return ok(response);
                }
                TimeZone tz = TimeZone.getDefault();
                Calendar actualDate = new GregorianCalendar(tz);
                SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmm");
                String date = sf.format(actualDate.getTime());
                Post post = new Post(woman, date, postData.get("source").asText());

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
                        String path = Utils.uploadAttachment(file, woman.getIdWoman());
                        PostHasMedia phm = new PostHasMedia(post, fileType, md5, path, mainScreen);
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
                if(postData.has("woman")){
                    Woman woman = null;
                    if(postData.get("woman").isInt()){
                        woman = Woman.finder.byId(postData.get("woman").asInt());
                    } else {
                        ObjectNode womanData = (ObjectNode) postData.get("woman");
                        if(womanData.has("name")){
                            woman = Women.createWoman(womanData);
                        } else {
                            response = buildBasicResponse(1, "Faltan campos para crear el registro");
                            return ok(response);
                        }
                    }
                    if(woman == null){
                        response = buildBasicResponse(1, "La modelo especificada no existe");
                        return ok(response);
                    }
                    if(woman != post.getWoman()){
                        post.setWoman(woman);
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
                                String path = Utils.uploadAttachment(file, post.getWoman().getIdWoman());
                                PostHasMedia phm = new PostHasMedia(post, fileType, md5, path, mainScreen);
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

    public static Result getRecentPosts(){
        try {
            Iterator<Post> postIterator = Post.finder.where().setFirstRow(0).setMaxRows(10).orderBy("date desc").findList().iterator();
            ArrayList<ObjectNode> posts = new ArrayList<ObjectNode>();
            while(postIterator.hasNext()){
                posts.add(postIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(posts));
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Posts.class, "Error manejando garotas", "error listando los post recientes", true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }
}
