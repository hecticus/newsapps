package models;

import com.fasterxml.jackson.databind.JsonNode;
import play.mvc.*;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import play.libs.ws.*;
import play.libs.F.Promise;
import play.libs.Json;

/**
 * Created by alidaniel on 02/12/2015.
 */
public class HandsetDetection extends Controller {

    public static final Integer HTML4_AJAX = 4;
    public static final Integer HTML4 = 3;
    public static final Integer XHTML_ADV = 2;
    public static final Integer XHTML_SIMPLE = 1;
    public static final Integer CHTML = 0;
    public static final Integer WML = -1;


    private Integer levelSupport;
    private String contentType;

    public HandsetDetection() {

        try {
            ObjectNode dataJson = Json.newObject();
            dataJson.put("user-agent", request().getHeader("User-Agent"));
            dataJson.put("options", "legacy, markup, display, xhtml_ui");

            Promise<WSResponse> wsDevice = WS.url("http://api.handsetdetection.com/apiv3/site/detect/54356.json")
                    .setHeader("Content-Type", "application/json")
                    .setAuth("a5397171b7", "g!j76FfQZBCVQLG7")
                    .post(dataJson);

            JsonNode jDevice = wsDevice.get(10000).asJson();
            JsonNode jMarkup = jDevice.get("markup");
            JsonNode jXhtmlUi = jDevice.get("xhtml_ui");

            this.levelSupport = jMarkup.get("xhtml_support_level").asInt();
            this.contentType = jXhtmlUi.get("xhtmlmp_preferred_mime_type").asText();

            if ((this.levelSupport == this.XHTML_SIMPLE)
                    || (this.levelSupport ==  this.XHTML_ADV)){
                response().setContentType(this.contentType);
            } else {
                response().setContentType("text/html");
            }

        } catch (Exception e) {

        }

    }



    public Integer getLevelSupport(){
        return levelSupport;
    }

    public void setLevelSupport(Integer levelSupport) {
        this.levelSupport = levelSupport;
    }

    public String getContentType(){
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

}
