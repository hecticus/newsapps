package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import play.mvc.Controller;
import javax.persistence.MappedSuperclass;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

/**
 * Created by chrirod on 3/27/14.
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

    public static ObjectNode hecticusResponse(int code, String description, String parentObj, ArrayList data) {
        ObjectNode tr = Json.newObject();
        tr.put("error", code);
        tr.put("description", description);
        ObjectNode innerObj = Json.newObject();
        innerObj.put(parentObj, Json.toJson((data)));
        tr.put("response",innerObj);
        return tr;
    }

    public static ObjectNode hecticusMessageResponse(int code, String description, String parentObj, ArrayList data, String message) {
        ObjectNode tr = Json.newObject();
        tr.put("error", code);
        tr.put("description", description);
        tr.put("message", message);
        ObjectNode innerObj = Json.newObject();
        innerObj.put(parentObj, Json.toJson((data)));
        tr.put("response",innerObj);
        return tr;
    }

    public static ObjectNode hecticusResponseSimple(int code, String description, String parentObj, Object data) {
        ObjectNode tr = Json.newObject();
        tr.put("error", code);
        tr.put("description", description);
        ObjectNode innerObj = Json.newObject();
        if(data instanceof Integer){
            innerObj.put(parentObj, (Integer)data);
        }else if(data instanceof Long){
            innerObj.put(parentObj, (Long)data);
        }else if(data instanceof Float){
            innerObj.put(parentObj, (Float)data);
        }else if(data instanceof String){
            innerObj.put(parentObj, (String)data);
        }else if(data instanceof Boolean){
            innerObj.put(parentObj, (Boolean)data);
        }
        tr.put("response",innerObj);
        return tr;
    }

    public static ObjectNode tvmaxResponse(String parentObj, ArrayList data){
        ObjectNode tr = Json.newObject();
        ObjectNode innerObj = Json.newObject();
        innerObj.put("item", Json.toJson((data)));
        tr.put(parentObj,innerObj);
        return tr;
    }

    public static ObjectNode tvmaxResponseSimple(String parentObj, ArrayList data){
        ObjectNode tr = Json.newObject();
        tr.put(parentObj,Json.toJson(data));
        return tr;
    }

    public static ObjectNode tvmaxPhaseResponse(String parentObj, ObjectNode phaseObj, ArrayList groupsArray, ArrayList teamsArray, boolean isRunning){
        ObjectNode tr = Json.newObject();
        /*ArrayList groupsArrayNew = new ArrayList();
        for(int i=0;i<groupsArray.size();i++){
            ObjectNode obj = (ObjectNode)groupsArray.get(i);
            obj.put("games",Json.toJson(teamsArray));
            groupsArrayNew.add(obj);
        }*/
        phaseObj.put("groups",Json.toJson(groupsArray));
        phaseObj.put("isRunning",isRunning);
        tr.put("phase",phaseObj);
        return tr;
    }
}
