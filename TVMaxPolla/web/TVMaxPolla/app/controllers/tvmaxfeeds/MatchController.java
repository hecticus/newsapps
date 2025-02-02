package controllers.tvmaxfeeds;

import controllers.HecticusController;
import models.tvmaxfeeds.TvmaxMatch;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
                Iterator it = data.get("calendar").elements();
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
            Calendar current = new GregorianCalendar(Utils.APP_TIMEZONE);

            Calendar begin = new GregorianCalendar(Utils.APP_TIMEZONE);
            begin.add(Calendar.DAY_OF_MONTH, -3);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
            sdf.setTimeZone(Utils.APP_TIMEZONE);

            List<TvmaxMatch> fullList = TvmaxMatch.getFinisedMatchesByDate(sdf.format(begin.getTime())+"000000", sdf.format(current.getTime())+ "235959");
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
            //Witch Live VIDEO URL IS
            /*String liveVideoDroid = "http://mundial.tvmax-9.com/UA_APP.php";
            String liveVideoIOS = "http://urtmpkal-f.akamaihd.net/i/0s75qzjf5_1@132850/master.m3u8";*/
            String liveVideoDroid = "http://urtmpkal-f.akamaihd.net/i/02lk0qtmr_1@136253/master.m3u8";
            String liveVideoIOS = "http://urtmpkal-f.akamaihd.net/i/02lk0qtmr_1@136253/master.m3u8";

            response.put("live_android", liveVideoDroid);
            response.put("live_ios", liveVideoIOS);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

}
