package controllers.newsapi;

import controllers.HecticusController;
import models.news.TrendingTopics;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.mvc.Result;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


/**
 * Created by christian on 3/13/14.
 */

public class TrendingTopicsController extends HecticusController {

    public static Result get(){
        try {
            TrendingTopics toGet = new TrendingTopics();
            List<TrendingTopics> fullList = toGet.getAllTrendingTopics();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //recorrer lista
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response = tvnResponse("trends", data);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result insert(){
        try {
            TrendingTopics toGet = new TrendingTopics();
            List<TrendingTopics> toDelete = toGet.getAllTrendingTopics();
            ArrayList<TrendingTopics> toInsert = new ArrayList<TrendingTopics>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("noticiastrendingtopics")){
                Iterator it = data.get("noticiastrendingtopics").get("item").elements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        TrendingTopics received = new TrendingTopics(current);
                        toInsert.add(received);
                    }catch (Exception ex){
                        //must continue
                        ex.printStackTrace();
                    }
                }
                //insert
                TrendingTopics.insertBatch(toInsert,toDelete);
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

}
