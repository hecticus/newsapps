package models;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.MappedSuperclass;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

/**
 * Created by chrirod on 3/27/14.
 */
@MappedSuperclass
public abstract class HecticusModel extends Model {

    public static final int MAX_SIZE = 20;

    public abstract ObjectNode toJson();

    public JsonNode toObjJson() {
        return Json.toJson(this);
    }

    public String decode(String val){
        String tr = null;
        try {
            tr= URLDecoder.decode(val, "UTF-8");
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return tr;
    }
}
