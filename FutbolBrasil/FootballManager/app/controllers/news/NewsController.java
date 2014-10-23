package controllers.news;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.News;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by sorcerer on 10/14/14.
 */
public class NewsController extends HecticusController {

    /***
     * get latest news and paginate
     * @return
     */
    public static Result getNews(Integer idApp, Integer offset, Integer count){
        try {
            List<News> fullList = News.getLatestNews(idApp,offset,count);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = hecticusResponse(0, "ok", "news", data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getNewsById(Long idNews){
        try {
            News toReturn = News.getNews(idNews);
            ArrayList data = new ArrayList();
            if (toReturn != null){
                data.add(toReturn.toJson());
            }
            //build response
            ObjectNode response;
            response = hecticusResponse(0, "ok", "news", data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

}
