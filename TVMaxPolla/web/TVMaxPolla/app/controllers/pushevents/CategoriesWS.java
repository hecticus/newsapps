package controllers.pushevents;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.Expr;
import controllers.HecticusController;
import models.pushevents.Action;
import models.pushevents.Category;
import models.pushevents.CategoryClient;
import models.pushevents.ClientAction;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import play.mvc.Result;

import java.util.ArrayList;
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
                Iterator<JsonNode> cats = jsonInfo.get("categories").elements();
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
                Iterator<JsonNode> cats = jsonInfo.get("deleteCategories").elements();
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
                Iterator<JsonNode> acts = jsonInfo.get("insertActions").elements();
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
                Iterator<JsonNode> acts = jsonInfo.get("deleteActions").elements();
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
            Iterator<JsonNode> cats = jsonInfo.get("categories").elements();
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
                Iterator<JsonNode> acts = jsonInfo.get("actions").elements();
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
                Iterator<JsonNode> acts = jsonInfo.get("actions").elements();
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



    public static Result getClientInfo(){
        try{
            ObjectNode jsonInfo = getJson();
            Long idClient  = jsonInfo.get("idClient").asLong();
            List<Category> availableCategories = Category.finder.findList();
            ArrayList<ObjectNode> avNodes = new ArrayList<>();
            for(Category c : availableCategories){
                avNodes.add(c.toJson());
            }

            List<Action> action = Action.finder.where().eq("pushable", 1).findList();
            ArrayList<ObjectNode> catNodes = new ArrayList<>();
            for(Action a : action){
                catNodes.add(a.toJson());
            }

            List<CategoryClient> catCl = CategoryClient.finder.where().eq("idClient", idClient).findList();
            ArrayList<Long> catClNodes = new ArrayList<>();
            for(CategoryClient a : catCl){
                catClNodes.add(a.getCategory().getIdCategory());
            }

            List<ClientAction> actCl = ClientAction.finder.where().eq("idClient", idClient).findList();
            ArrayList<Long> actClNodes = new ArrayList<>();
            for(ClientAction a : actCl){
                actClNodes.add(a.getAction().getIdAction());
            }


            ObjectNode responseNode = Json.newObject();
            responseNode.put("error", 0);
            responseNode.put("description", "ok");
            responseNode.put("categoriesAll", Json.toJson(avNodes));
            responseNode.put("actionsAll", Json.toJson(catNodes));
            responseNode.put("clientCategories", Json.toJson(catClNodes));
            responseNode.put("clientActions", Json.toJson(actClNodes));
            return ok(responseNode);
        } catch (Exception e){
            return badRequest("Ocurrio un error insertando el cliente " + e.getMessage());
        }
    }


    public static Result updateClient(){
        try{
            ObjectNode jsonInfo = getJson();
            Long idClient  = jsonInfo.get("idClient").asLong();
            if(jsonInfo.has("categories")){
                Iterator<JsonNode> acts = jsonInfo.get("categories").elements();
                ArrayList<Long> asoActs = new ArrayList<>();
                while(acts.hasNext()){
                    JsonNode actual = acts.next();
                    asoActs.add(actual.get("category").asLong());
                }
                List<CategoryClient> actCl = CategoryClient.finder.where().eq("idClient", idClient).not(Expr.in("id_category", asoActs)).findList();
                for(CategoryClient a : actCl){
                    a.delete();
                }
                actCl.clear();

                acts = jsonInfo.get("categories").elements();
                long creationTime = System.currentTimeMillis();
                while(acts.hasNext()){
                    JsonNode actual = acts.next();
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
            }
            if(jsonInfo.has("actions")){
                Iterator<JsonNode> acts = jsonInfo.get("actions").elements();
                ArrayList<Long> asoActs = new ArrayList<>();
                while(acts.hasNext()){
                    JsonNode actual = acts.next();
                    asoActs.add(actual.get("action").asLong());
                }
                List<ClientAction> actCl = ClientAction.finder.where().eq("idClient", idClient).not(Expr.in("id_action", asoActs)).findList();
                for(ClientAction a : actCl){
                    a.delete();
                }
                actCl.clear();

                acts = jsonInfo.get("actions").elements();
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

            CategoryClient cc = CategoryClient.finder.where().eq("idClient", idClient).eq("id_category",74).findUnique();
            if(cc == null){
                Category category = Category.finder.byId(74L);
                if(category != null ){
                    cc = new CategoryClient(idClient, category, System.currentTimeMillis());
                    cc.save();
                }
            }
            ClientAction ca = ClientAction.finder.where().eq("idClient", idClient).eq("id_action", 0).findUnique();
            if(ca == null){
                Action action = Action.finder.byId(0L);
                if(action != null ){
                    ca = new ClientAction(idClient, action);
                    ca.save();
                }
            }

            return ok(hecticusResponseSimple(0,"ok", null,null));
        } catch (Exception e){
            return badRequest("Ocurrio un error actualizando el cliente " + e.getMessage());
        }
    }


    public static Result deleteFalseClients(){
        try{
            ObjectNode jsonInfo = getJson();
            Iterator<JsonNode> cats = jsonInfo.get("clients").elements();
            while(cats.hasNext()){
                JsonNode actual = cats.next();
                Long idClient = actual.get("client").asLong();
                List<CategoryClient> categories = CategoryClient.finder.where().eq("idClient", idClient).findList();
                if(categories != null && !categories.isEmpty()){
                    for(CategoryClient c : categories){
                        c.delete();
                    }
                }
                List<ClientAction> actions = ClientAction.finder.where().eq("idClient", idClient).findList();
                if(categories != null && !categories.isEmpty()){
                    for(ClientAction a : actions){
                        a.delete();
                    }
                }
            }
            return ok(hecticusResponseSimple(0,"ok", null,null));
        } catch (Exception e){
            return badRequest(hecticusResponseSimple(-1,"no se pudo eliminar los clientes", null,null));
        }
    }

}
