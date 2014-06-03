package controllers.tvmaxfeeds;

import com.avaje.ebean.SqlRow;
import controllers.HecticusController;
import models.tvmaxfeeds.TvmaxGoal;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by sorcerer on 5/19/14.
 */
public class GoalController extends HecticusController {

    public static Result insert(){
        try {
            ArrayList<TvmaxGoal> toInsert = new ArrayList<TvmaxGoal>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("goals")){
                Iterator it = data.get("goals").getElements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        TvmaxGoal received = new TvmaxGoal(current);
                        toInsert.add(received);
                    }catch (Exception ex){
                        //must continue
                        ex.printStackTrace();
                    }
                }
                //insert
                TvmaxGoal.batchInsertUpdate(toInsert);
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

    //getControversy
    public static Result getGoals(){
        try{
            List<TvmaxGoal> fullList = TvmaxGoal.getAllLimited();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("goles_mundial",data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getGoalsSorted(String field, Integer limit){
        try {
            if(limit <= 0){
                return badRequest(buildBasicResponse(-1, "el campo limit debe ser mayor a 0"));
            }
            ArrayList data = new ArrayList();
            ObjectNode t = TvmaxGoal.getGoalSorted(field, limit);
            ObjectNode result = Json.newObject();
            result.put("error", 0);
            result.put("description","OK");
            result.put("response",t);
            return ok(result);
        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }
}
