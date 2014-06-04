package controllers.pushevents;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import controllers.HecticusController;
import models.pushevents.Action;
import models.pushevents.Category;
import models.pushevents.CategoryClient;
import models.pushevents.ClientAction;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.mvc.Result;

import java.util.Iterator;
import java.util.List;

/**
 * Created by plesse on 5/27/14.
 */
public class CategoriesWS extends HecticusController {

    public static Result insertClient(){
        try{
            ObjectNode jsonInfo = getJson();
            Long idClient  = jsonInfo.get("idClient").asLong();

            if(jsonInfo.has("categories")){
                Iterator<JsonNode> cats = jsonInfo.get("categories").getElements();
                long creationTime = System.currentTimeMillis();
                while(cats.hasNext()){
                    JsonNode actual = cats.next();
                    Long idCategory = actual.get("category").asLong();
                    Category category = Category.finder.byId(idCategory);
                    if(category != null){
                        CategoryClient act = CategoryClient.finder.where().eq("idClient", idClient).eq("id_category", idCategory).findUnique();
                        if(act == null){
                            act = new CategoryClient(idClient, category, creationTime);
                            act.save();
                        }
                    }
                }
                if(!jsonInfo.has("insertActions")){
                    List<Action> action = Action.finder.where().eq("pushable", 1).findList();
                    for(Action a : action){
                        ClientAction act = ClientAction.finder.where().eq("idClient", idClient).eq("id_action", a.getIdAction()).findUnique();
                        if(act == null){
                            act = new ClientAction(idClient, a);
                            act.save();
                        }
                    }
                }
            }

            if(jsonInfo.has("deleteCategories")){
                Iterator<JsonNode> cats = jsonInfo.get("deleteCategories").getElements();
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
            }


            if(jsonInfo.has("insertActions")){
                Iterator<JsonNode> acts = jsonInfo.get("insertActions").getElements();
                while(acts.hasNext()){
                    JsonNode actual = acts.next();
                    Long idAction = actual.get("action").asLong();
                    Action action = Action.finder.byId(idAction);
                    if(action != null){
                        ClientAction act = ClientAction.finder.where().eq("idClient", idClient).eq("id_action", idAction).findUnique();
                        if(act == null){
                            act = new ClientAction(idClient, action);
                            act.save();
                        }
                    }
                }
            }

            if(jsonInfo.has("deleteActions")){
                Iterator<JsonNode> acts = jsonInfo.get("deleteActions").getElements();
                while(acts.hasNext()){
                    JsonNode actual = acts.next();
                    Long idAction = actual.get("action").asLong();
                    Action action = Action.finder.byId(idAction);
                    if(action != null){
                        ClientAction act = ClientAction.finder.where().eq("idClient", idClient).eq("id_action", idAction).findUnique();
                        if(act != null){
                            act.delete();
                        }
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

    public static Result insertActions(){
        try{
            ObjectNode jsonInfo = getJson();
            Long idClient  = jsonInfo.get("idClient").asLong();
            if(jsonInfo.has("actions")){
                Iterator<JsonNode> acts = jsonInfo.get("actions").getElements();
                while(acts.hasNext()){
                    JsonNode actual = acts.next();
                    Long idAction = actual.get("action").asLong();
                    Action action = Action.finder.byId(idAction);
                    if(action != null){
                        ClientAction act = ClientAction.finder.where().eq("idClient", idClient).eq("id_action", idAction).findUnique();
                        if(act == null){
                            act = new ClientAction(idClient, action);
                            act.save();
                        }
                    }
                }
            }
            return ok(hecticusResponseSimple(0,"ok", null,null));
        } catch (Exception e){
            return badRequest("Ocurrio un error insertando el cliente " + e.getMessage());
        }
    }

    public static Result deleteActions(){
        try{
            ObjectNode jsonInfo = getJson();
            Long idClient  = jsonInfo.get("idClient").asLong();
            if(jsonInfo.has("actions")){
                Iterator<JsonNode> acts = jsonInfo.get("actions").getElements();
                while(acts.hasNext()){
                    JsonNode actual = acts.next();
                    Long idAction = actual.get("action").asLong();
                    Action action = Action.finder.byId(idAction);
                    if(action != null){
                        ClientAction act = ClientAction.finder.where().eq("idClient", idClient).eq("id_action", idAction).findUnique();
                        if(act != null){
                            act.delete();
                        }
                    }
                }
            }
            return ok(hecticusResponseSimple(0,"ok", null,null));
        } catch (Exception e){
            return badRequest("Ocurrio un error insertando el cliente " + e.getMessage());
        }
    }

}
