package controllers.newsapi;

import controllers.HecticusController;
import models.news.News;
import play.mvc.Result;

/**
 * Created by sorcerer on 2/20/14.
 */
public class NewsController extends HecticusController {

    public static Result get(){
        try{
            News toSearch = new News();



        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:"+ ex.toString()));
        }
        return ok(buildBasicResponse(0,"ok"));
    }

    public static Result insert(){
        return badRequest("not implemented");
    }

    public static Result delete(){
        return badRequest("not implemented");
    }

    public static Result update(){
        return badRequest("not implemented");
    }

    public static Result markAsGenerated(){
        return badRequest("not implemented");
    }


}
