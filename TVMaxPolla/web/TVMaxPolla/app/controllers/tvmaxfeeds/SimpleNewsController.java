package controllers.tvmaxfeeds;

import controllers.HecticusController;
import models.Config;
import models.tvmaxfeeds.TvmaxNewsCategory;
import models.tvmaxfeeds.TvmaxSimpleNews;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import play.mvc.Result;
import utils.Utils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by christian on 7/22/14.
 */
public class SimpleNewsController extends HecticusController {

    //insert news
    public static Result insert(){
        try {
            ArrayList<TvmaxSimpleNews> toInsert = new ArrayList<TvmaxSimpleNews>();
            //get data from post
            ObjectNode data = getJson();
            //get data from json
            if (data.has("simplenews")){
                Iterator it = data.get("simplenews").elements();
                while (it.hasNext()){
                    JsonNode current = (JsonNode)it.next();
                    try {
                        //build obj
                        TvmaxSimpleNews received = new TvmaxSimpleNews(current);
                        toInsert.add(received);
                    }catch (Exception ex){
                        //must continue
                        ex.printStackTrace();
                    }
                }
                //insert
                TvmaxSimpleNews.insertBatch(toInsert);
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
        return ok(buildBasicResponse(0,"OK"));
    }

    //getNews
    public static Result getNews(String categoryName){
        try{
            List<TvmaxSimpleNews> fullList = TvmaxSimpleNews.getAllLimitedByCategoryV2(categoryName);
            String domainShare = Config.getShareDomain();      
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                	ObjectNode innerObj = fullList.get(i).toJson();
                	innerObj.put("shareDomain", domainShare + "?id=" +innerObj.get("id"));              	
                	data.add(innerObj);                    
                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("noticias_deportes",data);
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getLatest(){
        try {
            List<TvmaxSimpleNews> fullList = TvmaxSimpleNews.getLatestLimited();
            ArrayList data = new ArrayList();
           
            
            String domainShare = Config.getShareDomain();            
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){                	
                	ObjectNode innerObj = fullList.get(i).toJson();
                	innerObj.put("shareDomain", domainShare + "?id=" +innerObj.get("id"));              	
                	data.add(innerObj);
                }
            }
            ObjectNode response;
            response = tvmaxResponse("noticias_deportes",data);
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getAwesome(){
        try {
            List<TvmaxSimpleNews> fullList = TvmaxSimpleNews.getAwesome();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());

                }
            }

            ObjectNode response;
            response = tvmaxResponse("noticias_deportes",data);
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getNewsById(String id){
        try{
            TvmaxSimpleNews fullList = TvmaxSimpleNews.getNewsById(id);
            ArrayList data = new ArrayList();
            if (fullList != null){
                //i got data
                data.add(fullList.toJson());
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("noticias_deportes",data);
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getNewsCategories(int version, String os){
        try{
            List<TvmaxNewsCategory> fullList = TvmaxNewsCategory.getNewsCategories();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());

                }
            }
            //build response
            ObjectNode response;
            response = tvmaxResponse("news_categories",data);

            //agregamos informacion necesaria para la configuracion de la aplicacion
            //Witch Live VIDEO URL IS
            boolean active = true;
            /*String liveVideoDroid = "http://mundial.tvmax-9.com/UA_APP.php";
            String liveVideoIOS = "http://urtmpkal-f.akamaihd.net/i/0s75qzjf5_1@132850/master.m3u8";*/
            String liveVideoDroid = "http://urtmpkal-f.akamaihd.net/i/02lk0qtmr_1@136253/master.m3u8";
            String liveVideoIOS = "http://urtmpkal-f.akamaihd.net/i/02lk0qtmr_1@136253/master.m3u8";

            response.put("live_android", liveVideoDroid);
            response.put("live_ios", liveVideoIOS);
            response.put("live", active);

            response.put("wifiOnly",false);
            response.put("browserPlay",false);
                        

            
            //enviamos la informacion de actualizacion de la aplicacion
            String updateURL = Utils.getUpdateVersionURL(version, os);
            if(updateURL != null){
                response.put("updateUrl",updateURL);
            }
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

}
