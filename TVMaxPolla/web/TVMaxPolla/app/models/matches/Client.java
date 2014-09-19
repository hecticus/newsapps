package models.matches;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.persistence.Id;

import models.Config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import play.data.Form;
import play.data.validation.Constraints;
import play.libs.Json;
import play.libs.WS;
import play.libs.WS.Response;
import play.libs.F.Function;
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
	@Constraints.MinLength(message="La longitud mínima es de 6 caracteres",value=6)
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
            Promise<Response> wsLogin = WS.url(url+"KrakenSocialClients/v1/client/login").post(dataJson);

            JsonNode jsonLogin = wsLogin.get(10000).asJson();
        	JsonNode jsonError = jsonLogin.get("error");
        	JsonNode jsonDescription = jsonLogin.get("description");
        	JsonNode jsonResponse = jsonLogin.get("response");


        	if (jsonResponse.size() == 0) {

        		if(!filledForm.field("socialid").value().isEmpty()) {
        			return this.getLoginPass(filledForm);
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
    		Promise<Response> wsCheckLogin = WS.url(url+"KrakenSocialClients/v1/client/checklogin").post(dataJson);
        	JsonNode jsonCheckLogin = wsCheckLogin.get(10000).asJson();
        	JsonNode jsonError = jsonCheckLogin.get("error");
        	JsonNode jsonDescription = jsonCheckLogin.get("description");
        	JsonNode jsonResponse = jsonCheckLogin.get("response");


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
     		dataJson.put("socialId", filledForm.field("socialid").value());
     		
     		if (filledForm.field("socialemail").value() != "undefined") {
     			dataJson.put("email", filledForm.field("socialemail").value());	
     		}
     		
     		dataJson.put("userNick", filledForm.field("socialname").value());
     	}
     	
     	try {
            String url = Config.getKrakenHost();
     		Promise<Response> wsLoginPass = WS.url(url+"KrakenSocialClients/v1/client/create/loginpass").post(dataJson);
         	JsonNode jsonLoginPass = wsLoginPass.get(10000).asJson();
         	JsonNode jsonError = jsonLoginPass.get("error"); 
         	JsonNode jsonDescription = jsonLoginPass.get("description");
         	JsonNode jsonResponse = jsonLoginPass.get("response");   

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

    
    public List<Phase> getPredictionBet(String idClient) {
    	
    	ObjectNode dataJson = Json.newObject();
    	dataJson.put("idClient", idClient);

    	String url = Config.getTVMaxPollaHost();
    	Promise<Response> wsResponse = WS.url(url+"matchesapi/v1/clientbet/get/current").post(dataJson);

    	JsonNode jsonResponse = wsResponse.get(10000).asJson();
    	JsonNode jsonPhase = jsonResponse.get("phase");
    	java.util.List<Phase> lstPhase = new ArrayList<Phase>();
    	
		Phase objPhase = new Phase();
		objPhase.setIdPhase(jsonPhase.get("id").asInt());
    	objPhase.setName(jsonPhase.get("name").asText());
    	objPhase.setDateStart(Long.parseLong(jsonPhase.get("date_start").asText()));
    	objPhase.setDateEnd(Long.parseLong(jsonPhase.get("date_end").asText()));
    	objPhase.setRunning(jsonPhase.get("isRunning").asBoolean());

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

    	return lstPhase;
    	
    }
    
    public List<Phase> getPrediction(String idClient) {
		
		ObjectNode dataJson = Json.newObject();    	
		dataJson.put("idClient", idClient);
    	
    	String url = Config.getTVMaxPollaHost();
    	Promise<Response> wsResponse = WS.url(url+"matchesapi/v1/prediction/get").post(dataJson);
    	JsonNode jsonResponse = wsResponse.get(10000).asJson();
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
    	
    	
    	return lstPhase;
    	
    }
    
    
    
}
