package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import models.Config;
import models.Resource;
import models.football.News;
import play.data.Form;
import play.mvc.Result;
import views.html.news.*;

import java.util.List;

import static play.data.Form.form;

/**
 * Created by plesse on 11/26/14.
 */
public class NewsView extends HecticusController {

    final static Form<News> NewsViewForm = form(News.class);
    public static Result GO_HOME = redirect(routes.NewsView.list(0, "title", "asc", ""));

    @Restrict(@Group(Application.USER_ROLE))
    public static Result index() {
        return GO_HOME;
    }


    @Restrict(@Group(Application.USER_ROLE))
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(News.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result edit(Long id) {
        List<Resource> lstResource = Resource.getAllResourcesAvailable();
        News news = News.getNews(id);
        return ok(edit.render(news, lstResource));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            News oPost = News.getNews(Long.parseLong(aids[i]));
            //oWoman.setSort(i);
            oPost.save();
        }

        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(News.page(0, 0, "title", "asc", ""),"date", "asc", "",true));
    }
}
