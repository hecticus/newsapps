package controllers.news;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.news.News;
import models.news.Resource;
import play.libs.Json;
import play.mvc.Result;
import views.html.summary;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chrirod on 10/29/14.
 */
public class NewsController extends HecticusController {

    public static Result getNews() {

        List<News> lstNews = News.getAllNews();
        ArrayList lstData = new ArrayList();
        if (lstNews != null && !lstNews.isEmpty()){
            for (int i = 0; i < lstNews.size(); i++){
                lstData.add(lstNews.get(i).toJson());
            }

        }

        ObjectNode objResponse = Json.newObject();
        ObjectNode objItem = Json.newObject();
        objItem.put("item", Json.toJson((lstData)));
        objResponse.put("response",objItem);

        return ok(objResponse);

    }


    public static Result getResource() {

        List<Resource> lstResource = Resource.getAllResource();
        ArrayList lstData = new ArrayList();
        if (lstResource != null && !lstResource.isEmpty()){
            for (int i = 0; i < lstResource.size(); i++){
                lstData.add(lstResource.get(i).toJson());
            }
        }

        ObjectNode objResponse = Json.newObject();
        ObjectNode objItem = Json.newObject();
        objItem.put("item", Json.toJson((lstData)));
        objResponse.put("response",objItem);

        return ok(objResponse);

    }

    public static Result upResource() {

        ObjectNode jData = getJson();
        News objNews = new News();
        Resource objResource = new Resource();
        List<Resource> lstResource = new ArrayList<Resource>();

        for (int i = 0; i < jData.get("resources").size(); i++){
            objResource = Resource.getResource(jData.get("resources").get(i).asLong());
            lstResource.add(objResource);
        }

        objNews = News.getNewsById(jData.get("news").asLong());
        objNews.setResources(lstResource);
        objNews.update();

        ObjectNode jResponse = Json.newObject();
        jResponse.put("response",Json.toJson((objNews)));

        return ok(jResponse);

    }
}
