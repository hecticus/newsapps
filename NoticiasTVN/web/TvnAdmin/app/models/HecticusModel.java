package models;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.MappedSuperclass;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

/**
 * Created by sorcerer on 2/20/14.
 */
@MappedSuperclass
public abstract class HecticusModel extends Model {

    public static final String CDN_URL = "http://9412fdf6c01bc9771bc2-f7308435bd9ae7a6ffc150d7e895a463.r87.cf1.rackcdn.com/img/";

    public static final int MAX_SIZE = 20;

    public abstract ObjectNode toJson();

    public JsonNode toObjJson() {
        return Json.toJson(this);
    }

    public String decode(String val){
        String tr = null;
        try {
            tr= URLDecoder.decode(val, "UTF-8");
        }catch (UnsupportedEncodingException ex){

        }catch (Exception ex){

        }
        return tr;

    }

    public String encode(String val){
        String tr = null;
        try {
            tr = URLEncoder.encode(val, "UTF-8");
        }catch (Exception ex){
        }
        return tr;
    }

}
