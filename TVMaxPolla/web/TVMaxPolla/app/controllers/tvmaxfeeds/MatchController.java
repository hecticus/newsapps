package controllers.tvmaxfeeds;

import controllers.HecticusController;
import models.tvmaxfeeds.TvmaxMatch;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Result;
import utils.Utils;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by sorcerer on 5/19/14.
 */
public class MatchController extends HecticusController {

    public static Result insert(){
        try {
            ArrayList<TvmaxMatch> toInsert = new ArrayList<TvmaxMatch>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("calendar")){
                Iterator it = data.get("calendar").getElements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        TvmaxMatch received = new TvmaxMatch(current);
                        toInsert.add(received);
                    }catch (Exception ex){
                        //must continue
                        ex.printStackTrace();
                    }
                }
                //insert
                TvmaxMatch.batchInsertUpdate(toInsert);
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

    public static Result getMatchs(){
        try{
            List<TvmaxMatch> fullList = TvmaxMatch.getAllLimited();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("partidos_mundial",data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getAllMatchs(){
        try{
            List<TvmaxMatch> fullList = TvmaxMatch.getAll();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("partidos_mundial",data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getToday(){
        try{
            String date;
            Calendar current = new GregorianCalendar(TimeZone.getDefault());
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MMM");
            sdf.setTimeZone(Utils.APP_TIMEZONE);
            date = sdf.format(current.getTime())+"%";

            List<TvmaxMatch> fullList = TvmaxMatch.getMatchesByDate(date);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("partidos_mundial",data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getActive(){
        try{
            String date;
            Calendar current = new GregorianCalendar(TimeZone.getDefault());
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MMM");
            sdf.setTimeZone(Utils.APP_TIMEZONE);
            date = sdf.format(current.getTime())+"%";

            List<TvmaxMatch> fullList = TvmaxMatch.getActiveMatchesByDate(date);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("partidos_mundial",data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getResults(){
        try{
            String date;
            Calendar current = new GregorianCalendar(TimeZone.getDefault());
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MMM");
            sdf.setTimeZone(TimeZone.getTimeZone("America/Panama"));
            date = sdf.format(current.getTime())+"%";

            List<TvmaxMatch> fullList = TvmaxMatch.getFinisedMatchesByDate(date);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("partidos_mundial",data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

}
