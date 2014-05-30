package controllers.tvmaxfeeds;

import controllers.HecticusController;
import models.tvmaxfeeds.TvmaxMatch;
import models.tvmaxfeeds.TvmaxNews;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by sorcerer on 5/15/14.
 */
public class NewsController extends HecticusController {

    //insert news
    public static Result insert(){
        try {
            ArrayList<TvmaxNews> toInsert = new ArrayList<TvmaxNews>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("news")){
                Iterator it = data.get("news").getElements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        TvmaxNews received = new TvmaxNews(current);
                        toInsert.add(received);
                    }catch (Exception ex){
                        //must continue
                        ex.printStackTrace();
                    }
                }
                //insert
                TvmaxNews.insertBatch(toInsert);
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

    //getNews
    public static Result getNews(String categoryName){
        try{
            List<TvmaxNews> fullList = TvmaxNews.getAllLimitedByCategoryV2(categoryName);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());

                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("noticias_mundial",data);
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getLatest(){
        try {
            List<TvmaxNews> fullList = TvmaxNews.getLatestLimited();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            ObjectNode response;
            response = tvmaxResponse("noticias_mundial",data);
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getAwesome(){
        try {
            List<TvmaxNews> fullList = TvmaxNews.getAwesome();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());

                }
            }

            ObjectNode response;
            response = tvmaxResponse("noticias_mundial",data);
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getNewsById(String id){
        try{
            TvmaxNews fullList = TvmaxNews.getNewsById(id);
            ArrayList data = new ArrayList();
            if (fullList != null){
                //i got data
                data.add(fullList.toJson());
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("noticias_mundial",data);
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

}
