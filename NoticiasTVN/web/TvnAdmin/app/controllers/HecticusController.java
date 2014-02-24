package controllers;

import play.mvc.Controller;
import play.libs.Json;

import javax.persistence.MappedSuperclass;

import org.codehaus.jackson.node.ObjectNode;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;

/**
 * Created by sorcerer on 2/20/14.
 */

@MappedSuperclass
public class HecticusController extends Controller {

    public static ObjectNode buildBasicResponse(int code, String responseMsg) {
        ObjectNode responseNode = Json.newObject();
        responseNode.put("error", code);
        responseNode.put("description", responseMsg);
        return responseNode;
    }

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
        return jsonInfo;
    }
}
