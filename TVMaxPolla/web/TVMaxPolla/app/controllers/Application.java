package controllers;

import static play.data.Form.form;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import models.Person;
import models.matches.*;

import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ArrayNode;

import play.*;
import play.libs.WS;
import play.data.Form;
import play.libs.F.Promise;
import play.libs.Json;
import play.libs.WS.Response;
import play.mvc.*;
import views.html.*;

public class Application extends Controller
{
	
	final static Form<Person> personForm = form(Person.class);
	
   /* public static Result indexs()
    {

    	int[] myIntArray = new int[3];
    	Promise<WS.Response> wsResponse = WS.url("http://localhost:9000/matchesapi/v1/phase/get/matches/all").get();
    	JsonNode jsonResponse = wsResponse.get().asJson();    	
    	JsonNode jsonPhases = jsonResponse.get("phases");  
    	Iterator<JsonNode> iJsonPhase = jsonPhases.iterator();    	
    	java.util.List<Phase> lstPhase = new ArrayList<Phase>();
    	 
    	
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
                	objGameMatch.setScoreTeamA(0);
                	objGameMatch.setScoreTeamB(0); 
                	
                	lstGameMatch.add(objGameMatch);
                	
            	}
            	
            	objMatchGroup.setGameMatch(lstGameMatch);
            	lstMatchGroup.add(objMatchGroup);
            	objPhase.setMatchGroup(lstMatchGroup);

        	}
    		

        	lstPhase.add(objPhase);
        	
    	}
    	     
    	return ok(index.render(lstPhase));
 
    }*/

    public static Result index()
    {
    	
    	int[] myIntArray = new int[3];
    	Promise<WS.Response> wsResponse = WS.url("http://localhost:8080/TVMaxPolla/ejemplo.json").get();
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
                    	
                    	objGameMatch.setScoreTeamA(0);
                    	objGameMatch.setScoreTeamB(0); 
                    	
                    	if (jsonGame.get("score_team_a") != null ) {
                    			objGameMatch.setScoreTeamA(jsonGame.get("score_team_a").asInt());	
                    	}
                    	
                    	if (jsonGame.get("score_team_b") != null ) {
                    		objGameMatch.setScoreTeamB(jsonGame.get("score_team_b").asInt());
                    	}
                    	
                    	
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
    
    
    public static Result signUpForm()
    {
        return ok(signUpForm.render(personForm,"Your new application is ready."));
    }
    
    
     
     
    public static Result getAll()
    {
        return ok(Json.toJson(Person.getAll()));
    }

    public static Result delete(Long id)
    {
        Result result;
        Person person = Person.getById(id);
        if (person != null)
        {
            person.delete();
            result = ok(person.name + " deleted");
        } else
        {
            result = notFound(String.format("Person with ID [%d] not found", id));
        }
        return result;
    }

    @BodyParser.Of(BodyParser.Json.class)
    public static Result create()
    {
        JsonNode json = request().body().asJson();
        Person person = Json.fromJson(json, Person.class);
        person.save();
        return ok(Json.toJson(person));
    }

    public static Result jsRoutes()
    {
        response().setContentType("text/javascript");
        return ok(Routes.javascriptRouter("appRoutes", //appRoutes will be the JS object available in our view
                                          routes.javascript.Application.getAll(),
                                          routes.javascript.Application.delete(),
                                          routes.javascript.Application.create()));
    }
    
    
    
    public static Result isEmailExist(String email)
    {
         	
    	
    	
      Person person = Person.getPersonByName(email);
      
      if (person == null) {
        	return ok("false");
       } else {
        	return ok("true");	
       }

    }
    
    
    public static Result javascriptRoutes()
    {
        response().setContentType("text/javascript");
        return ok(Routes.javascriptRouter("jsRoutes", //appRoutes will be the JS object available in our view
                                          routes.javascript.Application.getAll(),
                                          routes.javascript.Application.delete(),
                                          routes.javascript.Application.create(),
                                          routes.javascript.Application.isEmailExist()));
    }
    
    
    
    
}