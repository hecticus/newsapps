package controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.Config;
import play.mvc.Result;

/**
 * Created by chrirod on 9/23/14.
 */
public class ConfigurationController extends HecticusController {
    public static Result get(){
        try {
            String liveVideoDroid = Config.getString("stream_url_android");
            String liveVideoIOS = Config.getString("stream_url_ios");
            //build response
            ObjectNode response = buildBasicResponse(0,"ok");
            response.put("live_android", liveVideoDroid);
            response.put("live_ios", liveVideoIOS);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }
}
