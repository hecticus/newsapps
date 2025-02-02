package controllers;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;


import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;


import models.basic.Config;
import play.libs.Json;
import play.mvc.Controller;


@MappedSuperclass
public class HecticusController extends Controller {
	/**
	 * Metodo para minar la data que se recibe por post, el daemon manda la data en el body como un json y los admins la mandan como un
	 * Form.
	 * 
	 * @return	data para insertar recibida por post
	 */

    public static StringBuilder invoker;
	public static ObjectNode getJson(){
		ObjectNode jsonInfo = (ObjectNode) request().body().asJson();
		if(jsonInfo == null){
			Map<String,String[]> b = request().body().asFormUrlEncoded();
			if(b == null){
				return null;
			}
			jsonInfo = Json.newObject();
			Set<String> keys = b.keySet();
			Iterator<String> it = keys.iterator();
			while(it.hasNext()){
				String key = (String)it.next();
				jsonInfo.put(key, Json.toJson(b.get(key)[0]));
			}
		}
        if(jsonInfo != null){
            if(jsonInfo.has("invoker")){
                invoker = new StringBuilder(jsonInfo.get("invoker").asText());
            } else {
                invoker = null;
            }
        }
        if(invoker == null) setInvoker();
		return jsonInfo;
	}
	
	public static ObjectNode buildBasicResponse(int code, String responseMsg) {
		ObjectNode responseNode = Json.newObject();
		responseNode.put(Config.ERROR_KEY, code);
		responseNode.put(Config.DESCRIPTION_KEY, responseMsg);
		return responseNode; 
	}

    public static ObjectNode buildBasicResponse(int code, String responseMsg, Exception e) {
        ObjectNode responseNode = Json.newObject();
        responseNode.put(Config.ERROR_KEY, code);
        responseNode.put(Config.DESCRIPTION_KEY, responseMsg);
        responseNode.put(Config.EXCEPTION_KEY, e.getMessage());
        return responseNode;
    }

	/**
	 * Metodo para validar que el json tenga por lo menos un campo
	 * 
	 * @return	data para insertar recibida por post
	 */
	public static boolean validateJson(ObjectNode jsonInfo, ArrayList<String> reqKeys){
		boolean atLeastOne = false;
		if(jsonInfo != null){
			for(String s : reqKeys){
				if(jsonInfo.has(s)){
					atLeastOne = true;
				}
			}
		}
		return atLeastOne;
	}

    public static ObjectNode buildBasicResponse(int code, String responseMsg, ObjectNode obj) {
        ObjectNode responseNode = Json.newObject();
        responseNode.put(Config.ERROR_KEY, code);
        responseNode.put(Config.DESCRIPTION_KEY, responseMsg);
        responseNode.put(Config.RESPONSE_KEY,obj);
        return responseNode;
    }

    public static ObjectNode buildBasicResponse(int code, String responseMsg, JsonNode obj) {
        ObjectNode responseNode = Json.newObject();
        responseNode.put(Config.ERROR_KEY, code);
        responseNode.put(Config.DESCRIPTION_KEY, responseMsg);
        responseNode.put(Config.RESPONSE_KEY,obj);
        return responseNode;
    }

    /**
     * Metodo para validar que el json tenga por lo menos un campo
     *
     * @return	data para insertar recibida por post
     */
    public static long validate(String var){
        return Long.parseLong(var);
    }

    public static int validateInt(String var){
        return Integer.parseInt(var);
    }

    public static void setInvoker(){
        if(request().queryString().containsKey("invoker")){
            invoker = new StringBuilder(request().queryString().get("invoker")[0]);
        }
    }
}
