package models;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.MappedSuperclass;

/**
 * Created by sorcerer on 2/20/14.
 */
@MappedSuperclass
public abstract class HecticusModel extends Model {

    public static final String CDN_URL = "http://9412fdf6c01bc9771bc2-f7308435bd9ae7a6ffc150d7e895a463.r87.cf1.rackcdn.com/img/";

    public abstract ObjectNode toJson();

    public JsonNode toObjJson() {
        return Json.toJson(this);
    }
}
