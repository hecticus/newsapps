package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import exceptions.UpstreamException;
import models.Config;
import play.libs.Json;

import static play.libs.Jsonp.jsonp;

/**
 * Created by plessmann on 02/06/15.
 */
public class FootballController extends HecticusController {

    public static ObjectNode buildUpstreamResponse(int code, String responseMsg, UpstreamException e) {
        ObjectNode responseNode = Json.newObject();
        responseNode.put(Config.ERROR_KEY, code);
        responseNode.put(Config.DESCRIPTION_KEY, responseMsg);
        responseNode.put(Config.EXCEPTION_KEY, e.getMessage());
        responseNode.put(Config.UPSTREAM_CODE, e.getCode());
        return responseNode;
    }

    public static play.libs.Jsonp buildBasicJSONPResponse(int code, String responseMsg, ObjectNode obj) {
        String callback = getJSONPCallback();
        ObjectNode responseNode = buildBasicResponse(code, responseMsg, obj);
        return jsonp(callback, responseNode);
    }

    public static ObjectNode buildBasicResponse(int code, String responseMsg, ObjectNode obj) {
        ObjectNode responseNode = Json.newObject();
        responseNode.put(Config.ERROR_KEY, code);
        responseNode.put(Config.DESCRIPTION_KEY, responseMsg);
        responseNode.put(Config.RESPONSE_KEY,obj);
        return responseNode;
    }

    public static play.libs.Jsonp buildBasicJSONPResponse(int code, String responseMsg, JsonNode obj) {
        String callback = getJSONPCallback();
        ObjectNode responseNode = buildBasicResponse(code, responseMsg, obj);
        return jsonp(callback, responseNode);
    }

    public static ObjectNode buildBasicResponse(int code, String responseMsg, JsonNode obj) {
        ObjectNode responseNode = Json.newObject();
        responseNode.put(Config.ERROR_KEY, code);
        responseNode.put(Config.DESCRIPTION_KEY, responseMsg);
        responseNode.put(Config.RESPONSE_KEY,obj);
        return responseNode;
    }

    public static String getJSONPCallback(){
        String callback = request().queryString().get("callback")[0];
        return callback;
    }

    public static play.libs.Jsonp buildBasicJSONPResponse(int code, String responseMsg) {
        String callback = getJSONPCallback();
        ObjectNode responseNode = buildBasicResponse(code, responseMsg);
        return jsonp(callback, responseNode);
    }

    public static play.libs.Jsonp buildBasicJSONPResponse(int code, String responseMsg, Exception e) {
        String callback = getJSONPCallback();
        ObjectNode responseNode = buildBasicResponse(code, responseMsg, e);
        return jsonp(callback, responseNode);
    }
}
