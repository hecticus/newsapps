package controllers.tvmaxfeeds;

import controllers.HecticusController;
import models.tvmaxfeeds.TvmaxMatch;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;
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

	public static Result getActiveMatch(){
        boolean active = false;
        boolean wc = false;
        int preWindow = 1;
        int postWindow = 3;
        String tz = "America/Panama";
        try{
            Calendar today = new GregorianCalendar(TimeZone.getTimeZone(tz));
            today.setTimeZone(TimeZone.getTimeZone(tz));

            Calendar top = new GregorianCalendar(TimeZone.getTimeZone(tz));
            top.set(Calendar.HOUR_OF_DAY, 9);
            top.set(Calendar.MINUTE, 30);
            top.setTimeZone(TimeZone.getTimeZone(tz));

            Calendar bottom = new GregorianCalendar(TimeZone.getTimeZone(tz));
            bottom.set(Calendar.HOUR_OF_DAY, 22);
            bottom.set(Calendar.MINUTE, 30);
            bottom.setTimeZone(TimeZone.getTimeZone(tz));

            Calendar wcInit = new GregorianCalendar(2014,05,12);
            wcInit.setTimeZone(TimeZone.getTimeZone(tz));
            wc = today.after(wcInit);

            if (today.after(top) && today.before(bottom)) {
//                SimpleDateFormat like = new SimpleDateFormat("yyyyMMdd");
//                like.setTimeZone(TimeZone.getTimeZone(tz));
//                List<TvmaxMatch> fullList = TvmaxMatch.getBroadcastableMatchesByDate(like.format(today.getTime())+"%");
//                if (fullList != null && !fullList.isEmpty()){
//                    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
//                    sdf.setTimeZone(TimeZone.getTimeZone(tz));
//                    for (int i = 0; i < fullList.size(); i++){
//                        TvmaxMatch act = fullList.get(i);
//                        Date dateStr = sdf.parse(act.getFormatedDate().trim());
//                        Calendar pre = new GregorianCalendar();
//                        Calendar post = new GregorianCalendar();
//                        pre.setTime(dateStr);
//                        pre.setTimeZone(TimeZone.getTimeZone(tz));
//                        pre.add(Calendar.HOUR_OF_DAY, -preWindow);
//                        post.setTime(dateStr);
//                        post.setTimeZone(TimeZone.getTimeZone(tz));
//                        post.add(Calendar.HOUR_OF_DAY, postWindow);
//                        active |= (today.after(pre) && today.before(post));
//                    }
//                }
                active = true;
            }
            ObjectNode response = Json.newObject();
            response.put("error", 0);
            response.put("description", "ok");
            response.put("live", active);
            response.put("worldCupStarted", wc);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

}
