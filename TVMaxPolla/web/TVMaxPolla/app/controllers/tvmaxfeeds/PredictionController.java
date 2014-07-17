package controllers.tvmaxfeeds;

import controllers.HecticusController;
import models.tvmaxfeeds.TvmaxPrediction;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.mvc.Result;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by sorcerer on 5/19/14.
 */
public class PredictionController extends HecticusController {

    public static Result insert(){
        try {
            ArrayList<TvmaxPrediction> toInsert = new ArrayList<TvmaxPrediction>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("predictions")){
                Iterator it = data.get("predictions").elements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        TvmaxPrediction received = new TvmaxPrediction(current);
                        toInsert.add(received);
                    }catch (Exception ex){
                        //must continue
                        ex.printStackTrace();
                    }
                }
                //insert
                TvmaxPrediction.batchInsertUpdate(toInsert);
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

    //getControversy
    public static Result getPredictions(){
        try{
            List<TvmaxPrediction> fullList = TvmaxPrediction.getAllLimited();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("pronosticos_mundial",data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }
}
