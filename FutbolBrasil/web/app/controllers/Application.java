package controllers;

import java.util.ArrayList;
import java.util.List;

import models.*;

import com.fasterxml.jackson.databind.node.ObjectNode;

import play.*;
import play.libs.Json;
import play.mvc.*;
import views.html.*;

public class Application extends Controller {

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
    
    

}
