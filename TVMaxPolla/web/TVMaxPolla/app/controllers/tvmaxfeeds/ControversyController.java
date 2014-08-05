package controllers.tvmaxfeeds;

import controllers.HecticusController;
import models.tvmaxfeeds.TvmaxControversy;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by sorcerer on 5/19/14.
 */
public class ControversyController extends HecticusController {

    public static Result insert(){
        try {
            ArrayList<TvmaxControversy> toInsert = new ArrayList<TvmaxControversy>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("controversies")){
                Iterator it = data.get("controversies").getElements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        TvmaxControversy received = new TvmaxControversy(current);
                        toInsert.add(received);
                    }catch (Exception ex){
                        //must continue
                        ex.printStackTrace();
                    }
                }
                //insert
                TvmaxControversy.batchInsertUpdate(toInsert);
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

    //getControversy
    public static Result getControversies(){
        try{
            List<TvmaxControversy> fullList = TvmaxControversy.getAllLimited();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("polemicas_mundial",data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }
}
