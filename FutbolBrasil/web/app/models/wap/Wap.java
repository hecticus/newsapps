package models.wap;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.data.Form;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;

import static play.data.Form.form;


/**
 * Created by alidaniel on 03/14/2015.
 */
public class Wap extends HandsetDetection {

    public static final Domain oDomain = new Domain();
    public static final Integer LIMIT = 5;
    final static Form<Client> form = form(Client.class);

    public Wap() {
        try {

            F.Promise<WSResponse> wsResponse = WS.url(oDomain.loading()).get();
            JsonNode jResponse = wsResponse.get(10000).asJson();
            Integer iError = jResponse.get("error").asInt();
            String sDescription = jResponse.get("description").asText();
            
        } catch (Exception e) {
            //
        }
    }
}
