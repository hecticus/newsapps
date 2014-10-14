package controllers.news;

import controllers.HecticusController;
import play.mvc.Result;

/**
 * Created by sorcerer on 10/14/14.
 */
public class NewsController extends HecticusController {

    /***
     * get latest news and paginate
     * @return
     */
    public static Result getNews(){
        return ok();
    }

}
