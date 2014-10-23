package controllers.newsapi;

import controllers.HecticusController;
import exceptions.CategoryException;
import exceptions.NewsException;
import models.news.Category;
import models.news.News;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import play.mvc.BodyParser;
import play.mvc.Result;
import utils.Utils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by sorcerer on 2/20/14.
 */
public class NewsController extends HecticusController {

    //get news by category name
    public static Result getByCategoryName(String categoryName, Boolean hecticResponse){
        try{
            //transform category name into id_category
            Category cat = null;
            cat = Category.getCategoriesByName(categoryName);
            if (cat == null){
                //get by shortName
                cat = Category.getCategoriesByShortName(categoryName);
                if (cat == null){
                    //throw new exception
                    throw new CategoryException("la categoria no existe");
                }
            }
            List<News> fullList = News.getNewsByCategory(cat.idCategory);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    if (hecticResponse){
                        data.add(fullList.get(i).toJson());
                    }else{
                        data.add(fullList.get(i).toJsonTVN());
                    }
                }
            }
            //build response
            ObjectNode response;
            if (hecticResponse){
                response = hecticusResponse(0, "ok", "news", data);
            }else {
                if(cat.isVideo()){
                    response = tvnResponse("videos",data);
                }else if(cat.isTrending()){
                    response = tvnResponse("noticiastrendingnews",data);
                }else{
                    response = tvnResponse("noticias",data);
                }
            }
            return ok(response);

        }catch (CategoryException ex){
            return badRequest(buildBasicResponse(-1, ex.getMessage()));
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:"+ ex.toString()));
        }
    }

    //get news by id_category
    public static Result getByIdCategory(Long idCategory, Boolean hecticResponse){
        try{
            List<News> fullList = News.getNewsByCategory(idCategory);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    if (hecticResponse){
                        data.add(fullList.get(i).toJson());
                    }else{
                        data.add(fullList.get(i).toJsonTVN());
                    }
                }
            }
            //build response
            ObjectNode response;
            if (hecticResponse){
                response = hecticusResponse(0, "ok", "news", data);
            }else {
                Category cat = null;
                cat = Category.getCategory(idCategory);
                if(cat.isVideo()){
                    response = tvnResponse("videos",data);
                }else if(cat.isTrending()){
                    response = tvnResponse("noticiastrendingnews",data);
                }else{
                    response = tvnResponse("noticias",data);
                }
            }
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getTrendingNews(Long id, Boolean hecticResponse){
        try {
            List<News> fullList = News.getTrendingNewsById(id);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    if (hecticResponse){
                        data.add(fullList.get(i).toJson());
                    }else{
                        data.add(fullList.get(i).toJsonTVN());
                    }
                }
            }
            //build response
            ObjectNode response;
            if (hecticResponse){
                response = hecticusResponse(0, "ok", "news", data);
            }else {
                response = tvnResponse("noticias", data);
            }
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:" + ex.toString()));
        }
    }

    /**
     * devuelve una lista de las noticias que estan en la base de datos
     * @return
     */
    public static Result getBatch(){
        try {
            ArrayList<ObjectNode> listToInsert = new ArrayList<>();
            ObjectNode data = getJson();
            if (data.has("news")){
                Iterator it = data.get("news").elements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        News received = new News();
                        received.setExternalId(current.get("id").asInt());
                        received.setTitle(current.get("title").asText());
                        //crear crc del titulo
                        received.setCrc(Utils.createMd5(received.getTitle()));
                        if (received.existInBd()){
                            listToInsert.add(received.idToJson());
                        }
                    }catch (Exception ex){
                        //must continue
                        ex.printStackTrace();
                    }
                }
            }
            ObjectNode response = hecticusResponse(0, "ok", "insert", listToInsert);
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    @BodyParser.Of(value = BodyParser.Json.class, maxLength = 1024 * 1024)
    public static Result insert(){
        try {
            ArrayList<News> toInsert = new ArrayList<News>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("news")){
                Iterator it = data.get("news").elements();
                if(it == null || !it.hasNext()){
                    return ok(buildBasicResponse(0,"no news"));
                }
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        News received = new News(current);
                        toInsert.add(received);
                    }catch (Exception ex){
                        return ok(buildBasicResponse(-3,"Error: "+ex.toString()));
                        //must continue
                        //ex.printStackTrace();
                    }
                }
                //insert
                News.insertBatch(toInsert);
            }else{
                return ok(buildBasicResponse(-2,"bad params"));
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

    public static Result update(){
        try {
            ArrayList<News> toUpdate = new ArrayList<News>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("news")){
                Iterator it = data.get("news").elements();
                if(it == null || !it.hasNext()){
                    return ok(buildBasicResponse(0,"no news"));
                }
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        News received = new News(current);
                        toUpdate.add(received);
                    }catch (Exception ex){
                        return ok(buildBasicResponse(-3,"Error: "+ex.toString()));
                        //must continue
                        //ex.printStackTrace();
                    }
                }
                //insert
                News.batchInsertUpdate(toUpdate);
            }else{
                return ok(buildBasicResponse(-2,"bad params"));
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

    public static Result delete(){
        try{
            //get date from json
            //if not set create custom date
            //todays date or custom date?
            long date = System.currentTimeMillis();
            //execute delete query
            News.cleanInsertedNews(date);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.getMessage()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

    public static Result markAsGenerated(){
        try {
            ObjectNode data = getJson();
            if (data.has("id")){
                long idNews = data.get("id").asLong();
                News toUpdate = new News();
                toUpdate.setIdNews(idNews);
                toUpdate.setGenerated(true);
                //guardamos el dia de generacion para poder comparar
                toUpdate.setGenerationTime(Utils.currentTimeStampToDate(Utils.APP_TIMEZONE));
                toUpdate.update();
            }else {
                throw new NewsException("el valor 'id' es requerido");
            }
        }catch (Exception ex){
            return  badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.getMessage()));
        }
        return ok(HecticusController.buildBasicResponse(0, "OK"));
    }

    public static Result getNewsToGenerate(){
        //obtenemos una noticia activa a la cual se le puede hacer push
        News pushableNews = News.getNewsByDateAndNotPushed();
        if(pushableNews != null){
            //build response
            ObjectNode response;
            ArrayList data = new ArrayList();
            data.add(pushableNews.toJsonTVN());
            response = hecticusResponse(0, "ok", "pushNews", data);
            return ok(response);
        }

        //build empty response no news to push
        ObjectNode response;
        ArrayList data = new ArrayList();
        response = hecticusResponse(0, "ok", "pushNews", data);

        return ok(response);
    }

    public static Result getNewsGeneratedCount(){
        try{
            //obtenermos el dia actual
            long currentDay = Utils.currentTimeStampToDate(Utils.APP_TIMEZONE);
            //obtenemos las categorias a las que se les puede hacer push y estan activas
            int count = 0;
            count = News.getNewsByDateAndNotPushedCount(currentDay);

            //build response
            ObjectNode response;
            ArrayList data = new ArrayList();
            //count
            ObjectNode countObj = Json.newObject();
            countObj.put("newsGenerated", count);
            data.add(countObj);
            response = hecticusResponseSimple(0, "ok", "newsGenerated", new Integer(count));

            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getById(Long idNews) {
        try {
            News resultset = News.getNewsByExtID(idNews);
            ArrayList data = new ArrayList();
            if (resultset != null) {
                data.add(resultset.toJsonTVN());
            }
            //build response
            ObjectNode response;
            response = tvnResponse("noticias", data);

            return ok(response);
        } catch (Exception ex) {
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }
}
