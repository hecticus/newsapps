package controllers.pushevents;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import controllers.HecticusController;
import models.pushevents.Category;
import models.pushevents.CategoryClient;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Result;

import java.util.Iterator;

/**
 * Created by plesse on 5/27/14.
 */
public class CategoriesWS extends HecticusController {

    public static Result insertClient(){
        try{
            ObjectNode jsonInfo = getJson();
            Long idClient  = jsonInfo.get("idClient").asLong();

            Iterator<JsonNode> cats = jsonInfo.get("categories").getElements();
            while(cats.hasNext()){
                JsonNode actual = cats.next();
                Long idCategory = actual.get("category").asLong();
                Category category = Category.finder.byId(idCategory);
                if(category != null){
                    CategoryClient act = CategoryClient.finder.where().eq("idClient", idClient).eq("id_category", idCategory).findUnique();
                    if(act == null){
                        act = new CategoryClient(idClient, category);
                        act.save();
                    }
                }
            }
            return ok(hecticusResponseSimple(0,"ok", null,null));
        } catch (Exception e){
            return badRequest("Ocurrio un error insertando el cliente " + e.getMessage());
        }
    }

    public static Result deleteClient(){
        try{
            ObjectNode jsonInfo = getJson();
            Long idClient  = jsonInfo.get("idClient").asLong();
            Iterator<JsonNode> cats = jsonInfo.get("categories").getElements();
            while(cats.hasNext()){
                JsonNode actual = cats.next();
                Long idCategory = actual.get("category").asLong();
                Category category = Category.finder.byId(idCategory);
                if(category != null){
                    CategoryClient act = CategoryClient.finder.where().eq("idClient", idClient).eq("id_category", idCategory).findUnique();
                    if(act != null){
                        act.delete();
                    }
                }
            }
            return ok(hecticusResponseSimple(0,"ok", null,null));
        } catch (Exception e){
            return badRequest("Ocurrio un error insertando el cliente " + e.getMessage());
        }
    }

}
