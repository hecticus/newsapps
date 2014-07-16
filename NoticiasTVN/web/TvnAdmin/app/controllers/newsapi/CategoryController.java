package controllers.newsapi;

import controllers.HecticusController;
import models.news.Category;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
            ObjectNode response = hecticusResponse(0, "ok", "categories", data);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result getActive(){
        try {
            Category toGet = new Category();
            List<Category> fullList = toGet.getActiveCategories(1);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()) {
                //recorrer lista
                for (int i = 0; i < fullList.size(); i++) {
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response = hecticusResponse(0, "ok", "categories", data);
            return ok(response);

        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result test(){
        return ok("comm check, comm check, do you read me?");
    }

}