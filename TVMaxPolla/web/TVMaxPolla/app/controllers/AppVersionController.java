package controllers;

import models.Config;
import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Result;

/**
 * Created by chrirod on 5/25/14.
 */
public class AppVersionController extends HecticusController {

    public static Result checkAppVersion(int version, String os){
        int versionServer = 0;
        String url = "";
        boolean differentVersion = false;
        if(os.contains("droid")){
            //is android
            versionServer = Config.getInt("app_version_android");
            if(version<versionServer){
                url = Config.getString("android_app_url");
                differentVersion = true;
            }
        }else{
            //is ios
            versionServer = Config.getInt("app_version_ios");
            if(version<versionServer){
                url = Config.getString("ios_app_url");
                differentVersion = true;
            }
        }

        if(differentVersion){
            //build response
            ObjectNode response = hecticusResponseSimple(0, "ok", "updateUrl", url);
            return ok(response);
        }else{
            //build response
            ObjectNode response = buildBasicResponse(0,"ok");
            return ok(response);
        }
    }
}
