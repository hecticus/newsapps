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
    	return ok(index.render(lstPhase));
    

    }
    
    public static Result exit()
    {
    	session().clear();
    	return redirect(controllers.routes.SignIn.blank());
		//return redirect("/signin");
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