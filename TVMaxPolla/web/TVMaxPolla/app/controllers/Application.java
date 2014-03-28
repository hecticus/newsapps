package controllers;

import static play.data.Form.form;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import models.Person;












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

    	Promise<WS.Response> games = WS.url("http://localhost:9000/assets/jsons/games_x_phases.json").get();
    	JsonNode json = games.get().asJson();
    	JsonNode phase = json.get("phase").iterator().next();  
    	
    
    	String name_phase = phase.get("name").asText();
    	Iterator<JsonNode> group =phase.get("group").iterator();
    	List<Person> people = new ArrayList<Person>();
    	
    	while (group.hasNext()) {
    		Person p = new Person();
        	JsonNode a = group.next();        	
        	p.name = a.get("name").asText();        	
        	people.add(p);    		
    	}
    	
    	
    	
    	/*
       
   
    	
    	
    	
    	
        while (it.hasNext()) {
        	Person p = new Person();
        	JsonNode a = it.next();
        	p.id = Long.parseLong(a.get("id").toString());
        	p.name = a.get("name").toString();        	
        	people.add(p);
        	
        }*/
    	
    	return ok(index.render(name_phase,people));
    	
    	/*if (json.isObject()) {
    		return ok(index.render(json.get("phase").findValues("name").toString()));
    	} else {
    		return ok(index.render("Your new application is ready. NO Object",people));	
    	}*/
    	
        
        
  
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