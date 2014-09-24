package controllers.newsapi;

import controllers.HecticusController;
import models.Config;
import models.news.Banner;
import models.news.BannerFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import play.libs.Json;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

/**
 * Created by sorcerer on 4/23/14.
 */
public class BannerController extends HecticusController {

    public static Result getActiveBanner(){
        try {
            //get activebanner
            Banner search = Banner.getActiveBanner();
            ArrayList data = new ArrayList();
            if (search != null){
                data.add(search);
            }
            //build answer
            ObjectNode response = hecticusResponse(0, "ok", "banners", data);
            return ok(response);
        } catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }
    
    
    public static Result getConfigBanners(){
        try {        	       
            //get activebanner            
            String urlPrefix = Config.getString("banner-interval");            
            //build answer
            ObjectNode response = hecticusResponseSimple(0, "ok", "interval-banner", urlPrefix);
            return ok(response);
        } catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }
    
    
    
    public static Result getActiveBanners(){
        try {
        	
            //get activebanner
        	 List<Banner> lstBanner = Banner.getActiveBanners();        	 
        	 Iterator<Banner> iBanner = lstBanner.iterator();
        	 ArrayList data = new ArrayList();
        	 
        	 if (lstBanner != null) {
        		 if (lstBanner.size() >= 1) {
        			 while(iBanner.hasNext()) {     	     
     	                data.add(iBanner.next());
     	             }	 
        		 }

             }
        	 
            //build answer
            //ObjectNode response = hecticusResponse(0, "ok", "banners", data);
            String bannerInterval = Config.getString("banner-interval");
            ObjectNode response = Json.newObject();
            response.put("error", 0);
            response.put("description", "ok");
            ObjectNode innerObj = Json.newObject();
            innerObj.put("banners", Json.toJson((data)));
            innerObj.put("interval-banner",bannerInterval);
            response.put("response",innerObj);
            return ok(response);
        } catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }
    
}
