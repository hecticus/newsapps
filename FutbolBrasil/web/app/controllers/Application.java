package controllers;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import models.*;

import com.fasterxml.jackson.databind.node.ObjectNode;

import play.*;
import play.libs.Json;
import play.mvc.*;
import views.html.*;

public class Application extends Controller {

	public static ObjectNode getJson(){
        ObjectNode jsonInfo = (ObjectNode) request().body().asJson();
        if(jsonInfo == null){
            Map<String,String[]> b = request().body().asFormUrlEncoded();
            if(b == null){
                return null;
            }
            jsonInfo = Json.newObject();
            Set<String> keys = b.keySet();
            Iterator<String> it = keys.iterator();
            while(it.hasNext()){
                String key = (String)it.next();
                jsonInfo.put(key, Json.toJson(b.get(key)[0]));
            }
        }
        return jsonInfo;
    }
	
	
    public static Result index(int page, String sortBy, String order, String filter) {
    	return ok(
    		index.render(News.page(page, 6, sortBy, order, filter),
    				sortBy, order, filter)
    	);    	
    }    
    
    public static Result getNews() {
    	
    	List<News> lstNews = News.getAllNews();
        ArrayList lstData = new ArrayList();
        if (lstNews != null && !lstNews.isEmpty()){	
            for (int i = 0; i < lstNews.size(); i++){
            	lstData.add(lstNews.get(i).toJson());                             
            }
            
        }

        ObjectNode objResponse = Json.newObject();          
        ObjectNode objItem = Json.newObject();
        objItem.put("item", Json.toJson((lstData)));
        objResponse.put("response",objItem);
        
        return ok(objResponse);
        
    }
    
    public static Result getNewsById(Long id) {    	
    	News objNews = News.getNewsById(id);    	
    	List<Resource> lstResource = Resource.getAllResourcesAvailable();        
    	//List<Resource> lstResource = Resource.getAllResource();
        return ok(summary.render(objNews,lstResource));        
    }
    
    
    
    public static Result getResource() {
    	
    	List<Resource> lstResource = Resource.getAllResource();
    	 ArrayList lstData = new ArrayList();
        if (lstResource != null && !lstResource.isEmpty()){	
            for (int i = 0; i < lstResource.size(); i++){
            	lstData.add(lstResource.get(i).toJson());                             
            }
        }

        ObjectNode objResponse = Json.newObject();          
        ObjectNode objItem = Json.newObject();
        objItem.put("item", Json.toJson((lstData)));
        objResponse.put("response",objItem);
        
        return ok(objResponse);
        
    }
    
    public static Result upResource() {
    	
    	ObjectNode jData = getJson();
    	News objNews = new News();
    	Resource objResource = new Resource();
    	List<Resource> lstResource = new ArrayList<Resource>();

    	 for (int i = 0; i < jData.get("resources").size(); i++){
    		 objResource = Resource.getResource(jData.get("resources").get(i).asLong());
    		 lstResource.add(objResource);    	                          
         }

    	objNews = News.getNewsById(jData.get("news").asLong());
    	objNews.setResources(lstResource);
    	objNews.update();
     
	 	ObjectNode jResponse = Json.newObject();
	    jResponse.put("response",Json.toJson((objNews)));
	    
	    return ok(jResponse);
   	 
   }
    

}
