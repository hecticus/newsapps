package controllers.news;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.base.Predicate;
import controllers.HecticusController;
import models.Apps;
import models.Config;
import models.Language;
import models.Resource;
import models.football.News;

import play.mvc.Result;
import utils.Utils;

import java.util.*;

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

    public static Result getRecentNews(Integer idApp, Integer idLanguage, Long newsId, Boolean newest, Boolean first){
        try {
            Apps app = Apps.findId(idApp);
            ObjectNode response = null;
            if(app != null) {
                List<News> newsList = null;
                Iterator<News> newsIterator = null;
                int maxRows = first ? Config.getInt("news-to-deliver") : Config.getInt("news-to-deliver-lazy");

                Language requestLanguage = null;
                if (idLanguage > 0) {
                    requestLanguage = Language.getByID(idLanguage);
                }
                if (idLanguage <= 0 || requestLanguage == null) {
                    requestLanguage = app.getLanguage();
                }

                News news = null;
                if (newsId > 0) {
                    news = News.finder.byId(newsId);
                }
                if (news != null) {
                    if (newest) {
                        newsList = News.finder.where().eq("app", app).gt("publicationDate", news.getPublicationDate()).setMaxRows(maxRows).orderBy("publicationDate desc").findList();
                    } else {
                        newsList = News.finder.where().eq("app", app).lt("publicationDate", news.getPublicationDate()).setMaxRows(maxRows).orderBy("publicationDate desc").findList();
                    }
                } else {
                    newsList = News.finder.where().eq("app", app).setFirstRow(0).setMaxRows(maxRows).orderBy("publicationDate desc").findList();
                }

                Collection<News> result = null;
                try {
                    final Language finalRequestLanguage = requestLanguage;
                    Predicate<News> validNews = new Predicate<News>() {
                        public boolean apply(News n) {
                            return n.getLanguage().getIdLanguage().intValue() == finalRequestLanguage.getIdLanguage().intValue();
                        }
                    };
                    result = Utils.filterCollection(newsList, validNews);
                } catch (NoSuchElementException ex){
                    try {
                        final Language finalAppLanguage = app.getLanguage();
                        Predicate<News> validNews = new Predicate<News>() {
                            public boolean apply(News n) {
                                return n.getLanguage().getIdLanguage().intValue() == finalAppLanguage.getIdLanguage().intValue();
                            }
                        };
                        result = Utils.filterCollection(newsList, validNews);
                    } catch (NoSuchElementException e){
                        result = null;
                    }
                }
                if(result != null && !result.isEmpty()) {
                    newsIterator = result.iterator();
                } else {
                    newsIterator =  newsList.iterator();
                }

                ArrayList<ObjectNode> newsListResult = new ArrayList<>();
                while (newsIterator.hasNext()) {
                    News next = newsIterator.next();
                    newsListResult.add(next.toJson());
                }
                response = hecticusResponse(0, "ok", "news", newsListResult);
            } else {
                response = buildBasicResponse(1, "El app " + idApp + " no existe");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(NewsController.class, "Error manejando noticias", "error listando las noticias recientes", true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

}
