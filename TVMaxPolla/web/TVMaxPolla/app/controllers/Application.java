package controllers;

import static play.data.Form.form;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import models.Config;
import models.matches.*;

import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;

import play.*;
import play.libs.WS;
import play.cache.Cache;
import play.data.Form;
import play.libs.F.Promise;
import play.libs.Json;
import play.libs.WS.Response;
import play.mvc.*;
import views.html.*;



public class Application extends Controller
{

    public static Result checkFile(String name){
        File file = new File(name);
        //Logger.info("nameFile "+name+", path "+file.getAbsolutePath());
        if(file.exists()){
            return ok("OK");
        }else{
            return badRequest("file not found");
        }
    }
	
    public static Result index()
    {
    	
    	String connected = session("connected");
    	if(connected==null) {
    		return redirect("/signin");
    	}
    	
    	Client objClient =  new Client();
    	java.util.List<Phase> lstPhase = new ArrayList<Phase>();
    	lstPhase = objClient.getPrediction(connected);
    	
    	String url = Config.getKrakenHost();        	
    	//Promise<WS.Response> wsLeaderboard = WS.url("http://api.hecticus.com/KrakenSocialLeaderboards/v1/leaderboard/rank/1/" + connected).get();
    	Promise<WS.Response> wsLeaderboard = WS.url(url+"KrakenSocialLeaderboards/v1/leaderboard/rank/1/" + connected).get();   	
    	JsonNode jsonLeaderboard = wsLeaderboard.get().asJson();  
    	JsonNode jsonError = jsonLeaderboard.get("error"); 
    	JsonNode jsonDescription = jsonLeaderboard.get("description");
    	JsonNode jsonResponse = jsonLeaderboard.get("response");
    	    	
    	return ok(index.render(lstPhase,jsonResponse.get("rank").asText()));
    
   
    }

    
    public static Result leaderboardfb()
    {
    	
    	String connected = session("connected");
    	if(connected==null) {
    		return redirect("/signin");
    	}
    	
    	return ok(leaderboardfb.render());
    	
    }
    
    
    public static Result wsleaderboardfb()
    {

    	String connected = session("connected");
    	if(connected==null) {
    		return redirect("/signin");
    	}
    	    	
    	ObjectNode jsonInfo =  controllers.HecticusController.getJson();    	    	
    	ObjectNode dataJson = Json.newObject();        	
    	dataJson.put("leaderboard_id", 1);
    	dataJson.put("client_id", connected);
    	dataJson.put("social_ids",jsonInfo.get("friends"));

    	String url = Config.getKrakenHost();  
    	Promise<WS.Response> wsLeaderboard = WS.url(url+"KrakenSocialLeaderboards/v1/leaderboard/facebook").post(dataJson);
    	JsonNode jsonLeaderboard = wsLeaderboard.get().asJson();  
    	JsonNode jsonError = jsonLeaderboard.get("error"); 
    	JsonNode jsonDescription = jsonLeaderboard.get("description");
    	JsonNode jsonResponse = jsonLeaderboard.get("response");
    	Iterator<JsonNode> iJsonLeader = jsonResponse.get("leaderboard").iterator();

    	return ok(jsonResponse);

    }
    
    
    
    public static Result leaderboard()
    {


    	String connected = session("connected");
    	if(connected==null) {
    		return redirect("/signin");
    	}
    	
    	String url = Config.getKrakenHost();  
    	Promise<WS.Response> wsLeaderboard = WS.url(url+"KrakenSocialLeaderboards/v1/leaderboard/rank/1/" + connected).get();
    	//Promise<WS.Response> wsLeaderboard = WS.url("http://api.hecticus.com/KrakenSocialLeaderboards/v1/leaderboard/rank/1/" + connected).get();
    	JsonNode jsonLeaderboard = wsLeaderboard.get().asJson();  
    	JsonNode jsonError = jsonLeaderboard.get("error"); 
    	JsonNode jsonDescription = jsonLeaderboard.get("description");
    	JsonNode jsonResponse = jsonLeaderboard.get("response");

    	return ok(leaderboard.render(jsonResponse));    	
  
    }
    
    
    public static Result index2()
    {

    	String connected = session("connected");
    	if(connected==null) {
    		return redirect("/signin");
    	}
    	    
    	Client objClient =  new Client();
    	java.util.List<Phase> lstPhase = new ArrayList<Phase>();
    	lstPhase = objClient.getPredictionBet(connected);    	
    	return ok(index2.render(lstPhase));    	
  
    }
    
    
    
    public static Result exit()
    {
    	session().clear();
    	return redirect(controllers.routes.SignIn.blank());
    }
        

    
    public static Result share(String id)
    {
    	
    	String url = Config.getKrakenHost();    	
    	Promise<WS.Response> wsResponse = WS.url(url+"KrakenSocialClients/v1/client/" + id).get();
    	
    	JsonNode jsonResponse = wsResponse.get().asJson();
    	
    	if (jsonResponse.get("error").asLong() == 0) {    		
    		session("nick",jsonResponse.get("response").get("nick").asText());
    		Client objClient =  new Client();
        	java.util.List<Phase> lstPhase = new ArrayList<Phase>();
        	lstPhase = objClient.getPrediction(id);    	
        	return ok(share.render(lstPhase));	
    	} else {
    		return redirect(controllers.routes.SignIn.blank());
    		//return redirect("/signin");
    	}
    	

    }
    
}