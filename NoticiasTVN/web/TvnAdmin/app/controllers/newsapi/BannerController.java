package controllers.newsapi;

import controllers.HecticusController;
import models.news.Banner;
import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Result;
import java.util.ArrayList;

/**
 * Created by sorcerer on 4/23/14.
 */
public class BannerController extends HecticusController {

    public static Result getActiveBanner(){
        try {
            //get activebanner
            Banner search = Banner.getActiveBanner();
            ArrayList data = new ArrayList();
            if (search != null){
                data.add(search);
            }
            //build answer
            ObjectNode response = hecticusResponse(0, "ok", "banners", data);
            return ok(response);
        } catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }
}
