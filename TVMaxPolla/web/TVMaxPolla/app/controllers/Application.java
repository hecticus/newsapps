package controllers;

import static play.data.Form.form;
import models.Person;


import org.codehaus.jackson.JsonNode;

import play.*;
import play.data.Form;
import play.libs.Json;
import play.mvc.*;
import views.html.*;

public class Application extends Controller
{
	
	final static Form<Person> personForm = form(Person.class);
	
    public static Result index()
    {
        return ok(index.render("Your new application is ready."));
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