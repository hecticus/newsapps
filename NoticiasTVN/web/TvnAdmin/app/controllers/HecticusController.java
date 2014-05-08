package controllers;

import models.Config;
import org.apache.commons.codec.digest.DigestUtils;
import play.mvc.Controller;
import play.libs.Json;

import javax.persistence.MappedSuperclass;

import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Http;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import com.hecticus.rackspacecloud.RackspaceCreate;
import utils.Utils;

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

    public static Http.MultipartFormData.FilePart getImage(){
        Http.MultipartFormData body = request().body().asMultipartFormData();
        Http.MultipartFormData.FilePart picture = body.getFile("file");

        return picture;
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
        }
        tr.put("response",innerObj);
        return tr;
    }

    public static ObjectNode tvnResponse(String parentObj, ArrayList data){
        ObjectNode tr = Json.newObject();
        tr.put(parentObj, Json.toJson((data)));
        return tr;
    }

    public static boolean uploadFile(RackspaceCreate upload,int retry,String container, File file, String parent, long init) throws InterruptedException{
        boolean uploaded = false;
        while(retry > 0 && !uploaded){
            Utils.printToLog(HecticusController.class, "", "Subiendo el archivo " + file.getName() + " intento " + retry, false, null, "", Config.LOGGER_INFO);
            try {
                upload.uploadObject(container,file);
                uploaded = true;
            } catch (Exception ex) {
                Utils.printToLog(null, "Falla subiendo el archivo " + (System.currentTimeMillis() - init) + " ms", "Se realizará reintento en 3 minutos", false, ex, "", Config.LOGGER_ERROR);
                Thread.sleep(5000);
                retry--;
            }
        }

        if(!uploaded){
            Utils.printToLog(null,"Luego de "+retry+" intentos, el archivo no pudo ser cargado el cloud","-",false,null,"",Config.LOGGER_ERROR);
            return false;
        }

        return true;
    }
}
