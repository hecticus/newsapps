package models.matches;

import java.util.Iterator;

import javax.persistence.Id;

import models.Config;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import play.data.Form;
import play.data.validation.Constraints;
import play.libs.Json;
import play.libs.WS;
import play.libs.F.Promise;
import utils.Utils;

public class Client  {

	@Id    
    private Long id;
	

	
	public String username;
		
	public String name;
    
	public String surname;
    
	@Constraints.Required(message="Este campo es requerido")
	@Constraints.Email(message="El email no es valido")
    public String email;
    
	@Constraints.Required(message="Este campo es requerido")
    @Constraints.MinLength(6)
    public String password;
    
    public Client() {}
    public Client(String username, String name, String surname,  String email,  String password) {
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }
    
    
    
    public String getUserName() {
        return username;
    }
    
    public void setUserName(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getSurName() {
        return surname;
    }
    
    public void setSurName(String surname) {
        this.surname = surname;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
	
    
    public JsonNode getLogin(Form<Client> filledForm) {
    	
    	ObjectNode dataJson = Json.newObject();    	
    	dataJson.put("id_country", Config.getIDCountry());
    	dataJson.put("id_business", Config.getIDBusiness());
    	dataJson.put("app_id", 1);
    	
    	if(filledForm.field("socialid").value().isEmpty()) {
    		dataJson.put("userLogin", filledForm.field("email").value());
    		dataJson.put("userPass", filledForm.field("password").value());
    	} else {    		
    		dataJson.put("socialId", filledForm.field("socialid").value());
    	}   

    	try {
            String url = Config.getKrakenHost();
    		Promise<WS.Response> wsLogin = WS.url(url+"KrakenSocialClients/v1/client/login").post(dataJson);
        	JsonNode jsonLogin = wsLogin.get().asJson();  
        	JsonNode jsonError = jsonLogin.get("error"); 
        	JsonNode jsonDescription = jsonLogin.get("description");
        	JsonNode jsonResponse = jsonLogin.get("response");
        	System.out.print(wsLogin.get().asJson().toString());
        	
        	if (jsonResponse.size() == 0) {

        		if(!filledForm.field("socialid").value().isEmpty()) {
        			return this.getLoginPass(filledForm).iterator().next();
        		}

        		return null;	
        		
        	} else {
        		
        		return jsonResponse.iterator().next();	
        	}

		} catch (Exception e) {
			// TODO: handle exception
			return null;
		}

    }
    
    
    
    public Boolean getCheckLogin(String email) {
    	        	
    	ObjectNode dataJson = Json.newObject();    	
    	dataJson.put("id_country", Config.getIDCountry());
    	dataJson.put("id_business", Config.getIDBusiness());
    	dataJson.put("app_id", Config.getIDSocialApp());
    	dataJson.put("userLogin", email);

    	try {
    		String url = Config.getKrakenHost();
    		Promise<WS.Response> wsCheckLogin = WS.url(url+"KrakenSocialClients/v1/client/checklogin").post(dataJson);
        	JsonNode jsonCheckLogin = wsCheckLogin.get().asJson();  
        	JsonNode jsonError = jsonCheckLogin.get("error"); 
        	JsonNode jsonDescription = jsonCheckLogin.get("description");
        	JsonNode jsonResponse = jsonCheckLogin.get("response");
        	System.out.print(wsCheckLogin.get().asJson().toString());
    		
    		if (jsonResponse.size() == 0) {
        		return false;
        	} else {
        		return true;
        	}
    		
		} catch (Exception e) {
			// TODO: handle exception
			return true;
		}

    }
    
    
    public JsonNode getLoginPass(Form<Client> filledForm) {
    
      	ObjectNode dataJson = Json.newObject();
     	dataJson.put("id_country", Config.getIDCountry());
     	dataJson.put("id_carrier", Config.getIDCarrierWeb());
     	dataJson.put("id_business", Config.getIDBusiness());
     	dataJson.put("app_id", Config.getIDSocialApp());
     	dataJson.put("origin", "WEB");
     	
     	if(filledForm.field("socialid").value().isEmpty()) {    		    		
     		dataJson.put("push_id",  filledForm.field("email").value());
         	dataJson.put("userLogin",  filledForm.field("email").value());
         	dataJson.put("userPass", filledForm.field("password").value());
         	dataJson.put("userNick",filledForm.field("name").value() + " " + filledForm.field("surname").value());    	
         	dataJson.put("email", filledForm.field("email").value());    		
     	} else {
     		dataJson.put("email", filledForm.field("email").value()); 
     		dataJson.put("socialId", filledForm.field("socialid").value());
     	}
     	
     	try {
            String url = Config.getKrakenHost();
     		Promise<WS.Response> wsLoginPass = WS.url(url+"KrakenSocialClients/v1/client/create/loginpass").post(dataJson);
         	JsonNode jsonLoginPass = wsLoginPass.get().asJson();    	
         	JsonNode jsonError = jsonLoginPass.get("error"); 
         	JsonNode jsonDescription = jsonLoginPass.get("description");
         	JsonNode jsonResponse = jsonLoginPass.get("response");   
         	System.out.print(wsLoginPass.get().asJson().toString());
        	  
         	Iterator<JsonNode> iJsonResponse = jsonResponse.iterator();    	
         	jsonResponse= iJsonResponse.next();
         	
         	if (jsonResponse.size() == 0) {         		
        		return null;
        	} else {
        		return jsonResponse;	
        	}
         	
         	
     	} catch (Exception e) {
			// TODO: handle exception
			return null;
		}
     	
     
     	          
       
    	
    	

    }
    
    
    
}
