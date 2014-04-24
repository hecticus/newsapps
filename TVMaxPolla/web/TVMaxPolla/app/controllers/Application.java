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
    	

    	
    	
    	/*JsonNode jsonCacheResponse = (JsonNode) Cache.get("signin.jsonResponse");

        if (jsonCacheResponse == null) {
        	return redirect("/signin");
        }    	
      
        jsonCacheResponse = jsonCacheResponse.iterator().next();     
        System.out.println(jsonCacheResponse.get("id_social").asText());*/
    	
    		
		int[] myIntArray = new int[3];
		
		ObjectNode dataJson = Json.newObject();    	
    	dataJson.put("idClient", connected);

    	String url = Config.getTVMaxPollaHost();
    	Promise<WS.Response> wsResponse = WS.url(url+"matchesapi/v1/prediction/get").post(dataJson);

    	
    	JsonNode jsonResponse = wsResponse.get().asJson();    	
    	JsonNode jsonPredictions = jsonResponse.get("response").get("prediction");  
    	Iterator<JsonNode> iJsonPredictions = jsonPredictions.iterator();    	
    	java.util.List<Phase> lstPhase = new ArrayList<Phase>();
    	
    	while (iJsonPredictions.hasNext()) {
    		
    		JsonNode jsonPrediction = iJsonPredictions.next();  
    		JsonNode jsonPhases = jsonPrediction.get("matches");  
    		Iterator<JsonNode> iJsonPhase = jsonPhases.iterator();  
        	
        	
        	while (iJsonPhase.hasNext()) {
        		

        		JsonNode jsonPhase = iJsonPhase.next();   
        		Phase objPhase = new Phase();
        		
        		objPhase.setIdPhase(jsonPhase.get("id").asInt());
            	objPhase.setName(jsonPhase.get("name").asText());
            	objPhase.setDateStart(Long.parseLong(jsonPhase.get("date_start").asText()));
            	objPhase.setDateEnd(Long.parseLong(jsonPhase.get("date_end").asText()));

            	
            	Iterator<JsonNode> iJsonGroup = jsonPhase.get("groups").iterator();
            	List<MatchGroup> lstMatchGroup = new ArrayList<MatchGroup>();
            	
            	
            	while (iJsonGroup.hasNext()) {
            		
            		MatchGroup objMatchGroup = new MatchGroup();    		
                	JsonNode jsonGroup = iJsonGroup.next();        	
                	objMatchGroup.setIdGroup(jsonGroup.get("id").asInt());
                	objMatchGroup.setName(jsonGroup.get("name").asText());
                	Iterator<JsonNode> iJsonGame = jsonGroup.get("games").iterator();	
                	List<GameMatch> lstGameMatch = new ArrayList<GameMatch>();
                	
                	while (iJsonGame.hasNext()) {
                		
                		GameMatch objGameMatch = new GameMatch();    		
                    	JsonNode jsonGame = iJsonGame.next();            	
                    	objGameMatch.setIdMatch(jsonGame.get("id").asInt());
                    	objGameMatch.setDate(Long.parseLong(jsonGame.get("date").asText()));            	               
                    	
                    	
                    	
                    		Team objTeamA = new Team();
                        	Team objTeamB = new Team();

                        	JsonNode jsonTeamA = jsonGame.get("team_a");
                        	JsonNode jsonTeamB = jsonGame.get("team_b");                    	

                        	objTeamA.setIdTeam(jsonTeamA.get("id").asInt());            	
                        	objTeamA.setName(jsonTeamA.get("name").asText());            	
                        	objTeamA.setShortName(jsonTeamA.get("shortName").asText());
                        	objTeamA.setFlagFile(jsonTeamA.get("flag_file").asText());
                        	
                        	objTeamB.setIdTeam(jsonTeamB.get("id").asInt());            	
                        	objTeamB.setName(jsonTeamB.get("name").asText());            	
                        	objTeamB.setShortName(jsonTeamB.get("shortName").asText());
                        	objTeamB.setFlagFile(jsonTeamB.get("flag_file").asText());
                        	
                        	objGameMatch.setTeamA(objTeamA);
                        	objGameMatch.setTeamB(objTeamB);
                    		
                    	
                    	
                    	Venue objVenue = new Venue();
                    	JsonNode jsonVenue = jsonGame.get("venue");
                    	objVenue.setIdVenue(jsonVenue.get("id").asInt());
                    	objVenue.setName(jsonVenue.get("name").asText());

                    	objGameMatch.setVenue(objVenue);

                        MatchResults objResults = new MatchResults(objGameMatch.getIdMatch(),0,0,0,0);

                    	if (jsonGame.get("score_team_a") != null ) {
                    		objResults.setScoreTeamA(jsonGame.get("score_team_a").asInt());
                    	}
                    	
                    	if (jsonGame.get("score_team_b") != null ) {
                    		objResults.setScoreTeamB(jsonGame.get("score_team_b").asInt());
                    	}
                    	
                        objGameMatch.setResults(objResults);
                    	
                    	lstGameMatch.add(objGameMatch);
                    	
                	}
                	
                	objMatchGroup.setGameMatch(lstGameMatch);
                	lstMatchGroup.add(objMatchGroup);
                	objPhase.setMatchGroup(lstMatchGroup);

            	}
        		

            	lstPhase.add(objPhase);
            	
        	}
        	
    	}
    
    	return ok(index.render(lstPhase));
    

    }
    
    public static Result exit()
    {
    	session().clear();
		return redirect("/signin");
    }
    
}