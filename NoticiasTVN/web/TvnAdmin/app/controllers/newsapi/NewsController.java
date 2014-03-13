package controllers.newsapi;

import controllers.HecticusController;
import exceptions.CategoryException;
import models.news.Category;
import models.news.News;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Result;
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
                System.out.println("shortname");
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
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            if (hecticResponse){
                response = hecticusResponse(0, "ok", "news", data);
            }else {
                response = tvnResponse(data);
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
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            if (hecticResponse){
                response = hecticusResponse(0, "ok", "news", data);
            }else {
                response = tvnResponse(data);
            }
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getBatch(){
        try {
            ArrayList<ObjectNode> listToInsert = new ArrayList<>();
            ObjectNode data = getJson();
            if (data.has("news")){
                Iterator it = data.get("news").getElements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        News received = new News(current);
                        if (!received.existInBd()){
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

    public static Result insert(){
        try {
            ArrayList<News> toInsert = new ArrayList<News>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("news")){
                Iterator it = data.get("news").getElements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        News received = new News(current);
                        toInsert.add(received);
                    }catch (Exception ex){
                        //must continue
                        ex.printStackTrace();
                    }
                }
                //insert
                News.insertBatch(toInsert);
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

    public static Result markAsGenerated(long idNews){
        try {
            News toUpdate = new News();
            toUpdate.setIdCategory(idNews);
            toUpdate.setGenerated(true);
            toUpdate.save();
        }catch (Exception ex){
            return  badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.getMessage()));
        }
        return ok(HecticusController.buildBasicResponse(0, "OK"));
    }

    public static Result getNewsToGenerate(){
        return badRequest("not implemented");
    }

    public static Result getNewsCount(){
        return badRequest("not implemented");
    }


}
