package controllers.newsapi;

import controllers.HecticusController;
import models.news.Category;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;


/**
 * Created by sorcerer on 2/20/14.
 */

public class CategoryController extends HecticusController {

    public static Result get(){
        try {
            Category toGet = new Category();
            List<Category> fullList = toGet.getAllCategories();
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //recorrer lista
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode resp = buildBasicResponse(0,"OK");
            resp.put("categories", Json.toJson((data)));
            return ok(resp);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }
}