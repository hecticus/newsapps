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
	
    public static Result index()
    {

    	Promise<WS.Response> wsResponse = WS.url("http://localhost:9000/matchesapi/v1/phase/get/matches/current").get();
    	JsonNode jsonResponse = wsResponse.get().asJson();    	
    	JsonNode jsonPhase = jsonResponse.get("phase");  
    	
    	Phase objPhase = new Phase();
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
            	Venue objVenue = new Venue();
            	
            	JsonNode jsonTeamA = jsonGame.get("team_a");
            	JsonNode jsonTeamB = jsonGame.get("team_b");
            	JsonNode jsonVenue = jsonGame.get("venue");
            	
            	objTeamA.setIdTeam(jsonTeamA.get("id").asInt());            	
            	objTeamA.setName(jsonTeamA.get("name").asText());            	
            	objTeamA.setShortName(jsonTeamA.get("shortName").asText());
            	objTeamA.setFlagFile(jsonTeamA.get("flag_file").asText());
            	
            	objTeamB.setIdTeam(jsonTeamB.get("id").asInt());            	
            	objTeamB.setName(jsonTeamB.get("name").asText());            	
            	objTeamB.setShortName(jsonTeamB.get("shortName").asText());
            	objTeamB.setFlagFile(jsonTeamB.get("flag_file").asText());

            	objVenue.setIdVenue(jsonVenue.get("id").asInt());
            	objVenue.setName(jsonVenue.get("name").asText());
            	
            	objGameMatch.setTeamA(objTeamA);
            	objGameMatch.setTeamB(objTeamB);
            	objGameMatch.setVenue(objVenue); 
            	
            	
            	lstGameMatch.add(objGameMatch);
            	
        	}
        	
        	objMatchGroup.setGameMatch(lstGameMatch);
        	lstMatchGroup.add(objMatchGroup);
        	objPhase.setMatchGroup(lstMatchGroup);

        	
        	/*while (iJsonGames.hasNext()) {
        		
        		GameMatch objGameMatch = new GameMatch();    		
            	JsonNode jsonGame = iJsonGames.next();
            	
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
            	
            	objTeamA.setIdTeam(jsonTeamB.get("id").asInt());            	
            	objTeamA.setName(jsonTeamB.get("name").asText());            	
            	objTeamA.setShortName(jsonTeamB.get("shortName").asText());
            	objTeamA.setFlagFile(jsonTeamB.get("flag_file").asText());

            	objGameMatch.setTeamA(objTeamA);
            	objGameMatch.setTeamB(objTeamB);
            	
            	lstGames.add(objGameMatch);
            	
            	objMatchGroup.setMatch(lstGames);
        	}*/
        	
        	
        	
        	
        	
        	
        	
    	}
    	
    
    	return ok(index.render(objPhase));
 
  
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