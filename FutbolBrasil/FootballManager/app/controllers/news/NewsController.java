package controllers.news;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.Config;
import models.Resource;
import models.football.News;
import play.libs.Json;
import play.mvc.Result;
import utils.Utils;

import java.util.ArrayList;
import java.util.Iterator;
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
            ObjectNode response;
            ArrayList data = new ArrayList();
            if (toReturn != null){
                data.add(toReturn.toJson());
                response = hecticusResponse(0, "ok", toReturn.toJson());
            } else {
                response = buildBasicResponse(1, "La noticia " + idNews + " no existe");
            }
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result updateResources(){
        try {
            ObjectNode json = getJson();
            long idNews = json.get("news").asLong();
            News news = News.getNews(idNews);
            if(news != null){
                Iterator<JsonNode> resources = json.get("resources").elements();
                while (resources.hasNext()) {
                    JsonNode next = resources.next();
                    Resource resource = Resource.getResource(next.asLong());
                    if(resource != null){
                        resource.setParent(news);
                        resource.update();
                    }
                }
                news.setStatus(1);
                news.update();
            }
            ObjectNode response;
            response = buildBasicResponse(0, "ok");
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getRecentNews(Integer idApp, Long newsId, Boolean newest, Boolean first){
        try {
            Iterator<News> newsIterator = null;
            int maxRows = first?Config.getInt("news-to-deliver"):Config.getInt("news-to-deliver-lazy");
            News news = null;
            if(newsId > 0) {
                news = News.finder.byId(newsId);
            }
            if(news != null) {
                if (newest) {
                    newsIterator = News.finder.where().eq("idApp", idApp).gt("publicationDate", news.getPublicationDate()).setMaxRows(maxRows).orderBy("publicationDate desc").findList().iterator();
                } else {
                    newsIterator = News.finder.where().eq("idApp", idApp).lt("publicationDate", news.getPublicationDate()).setMaxRows(maxRows).orderBy("publicationDate desc").findList().iterator();
                }
            } else {
                newsIterator = News.finder.where().eq("idApp", idApp).setFirstRow(0).setMaxRows(maxRows).orderBy("publicationDate desc").findList().iterator();
            }
            ArrayList<ObjectNode> newsList = new ArrayList<>();
            while(newsIterator.hasNext()){
                News next = newsIterator.next();
                newsList.add(next.toJson());
            }
            ObjectNode response;
            response = hecticusResponse(0, "ok", "news", newsList);
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(NewsController.class, "Error manejando noticias", "error listando las noticias recientes", true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

}
