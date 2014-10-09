package controllers.content.women;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.basic.Config;
import models.clients.Client;
import models.content.women.*;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;
import utils.Utils;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by plesse on 10/1/14.
 */
public class Women extends HecticusController {

    public static Result create() {
        ObjectNode womanData = getJson();
        try{
            ObjectNode response = null;
            if(womanData.has("name")){
                Woman woman = createWoman(womanData);
                response = buildBasicResponse(0, "OK", woman.toJson());
            } else {
                response = buildBasicResponse(1, "Faltan campos para crear el registro");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Women.class, "Error manejando garotas", "error creando con params" + womanData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        ObjectNode womanData = getJson();
        try{
            ObjectNode response = null;
            Woman woman = Woman.finder.byId(id);
            if(woman != null){
                if(womanData.has("name")){
                    woman.setName(womanData.get("name").asText());
                    woman.update();
                }
                if(womanData.has("add_social_networks")){
                    Iterator<JsonNode> socialNetworks = womanData.get("add_social_networks").elements();
                    while (socialNetworks.hasNext()){
                        ObjectNode next = (ObjectNode)socialNetworks.next();
                        if(next.has("social_network") && next.has("link")){
                            SocialNetwork socialNetwork = SocialNetwork.finder.byId(next.get("social_network").asInt());
                            if(socialNetwork != null){
                                WomanHasSocialNetwork whsn = new WomanHasSocialNetwork(woman, socialNetwork, next.get("link").asText());
                                whsn.save();
                            }
                        }
                    }
                }

                if(womanData.has("remove_social_networks")){
                    Iterator<JsonNode> socialNetworks = womanData.get("remove_social_networks").elements();
                    while (socialNetworks.hasNext()){
                        JsonNode next = socialNetworks.next();
                        WomanHasSocialNetwork whsn = WomanHasSocialNetwork.finder.where().eq("woman.idWoman", woman.getIdWoman()).eq("idWomanHasSocialNetwork", next.asInt()).findUnique();
                        if(whsn != null){
                            whsn.delete();
                        }
                    }
                }

                if(womanData.has("add_categories")){
                    Iterator<JsonNode> categories = womanData.get("add_categories").elements();
                    while (categories.hasNext()){
                        JsonNode next = categories.next();
                        Category category = Category.finder.byId(next.asInt());
                        if(category != null){
                            WomanHasCategory whc = new WomanHasCategory(category, woman);
                            whc.save();
                        }
                    }
                }

                if(womanData.has("remove_categories")){
                    Iterator<JsonNode> categories = womanData.get("remove_categories").elements();
                    while (categories.hasNext()){
                        JsonNode next = categories.next();
                        WomanHasCategory whc = WomanHasCategory.finder.where().eq("woman.idWoman", woman.getIdWoman()).eq("idWomanHasCategory", next.asInt()).findUnique();
                        if(whc != null){
                            whc.delete();
                        }
                    }
                }
                response = buildBasicResponse(0, "OK", woman.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a modificar");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Women.class, "Error manejando garotas", "error creando con params" + womanData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            ObjectNode response = null;
            Woman woman = Woman.finder.byId(id);
            if(woman != null) {
                woman.delete();
                response = buildBasicResponse(0, "OK", woman.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a eliminar");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Women.class, "Error manejando garotas", "error eliminando la garota " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id){
        try {
            ObjectNode response = null;
            Woman woman = Woman.finder.byId(id);
            if(woman != null) {
                response = buildBasicResponse(0, "OK", woman.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Women.class, "Error manejando garotas", "error buscando la garota " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page){
        try {

            Iterator<Woman> womanIterator = null;
            if(pageSize == 0){
                womanIterator = Woman.finder.all().iterator();
            }else{
                womanIterator = Woman.finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
            }

            ArrayList<ObjectNode> women = new ArrayList<ObjectNode>();
            while(womanIterator.hasNext()){
                women.add(womanIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(women));
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Women.class, "Error manejando garotas", "error listando las garotas con pageSize " + pageSize + " y " + page, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Woman createWoman(ObjectNode data){
        Woman woman = new Woman(data.get("name").asText());
        if(data.has("social_networks")){
            Iterator<JsonNode> socialNetworks = data.get("social_networks").elements();
            ArrayList<WomanHasSocialNetwork> nets = new ArrayList<>();
            while (socialNetworks.hasNext()){
                ObjectNode next = (ObjectNode)socialNetworks.next();
                if(next.has("social_network") && next.has("link")){
                    SocialNetwork socialNetwork = SocialNetwork.finder.byId(next.get("social_network").asInt());
                    if(socialNetwork != null){
                        WomanHasSocialNetwork whsn = new WomanHasSocialNetwork(woman, socialNetwork, next.get("link").asText());
                        nets.add(whsn);
                    }
                }
            }
            woman.setSocialNetworks(nets);
        }

        if(data.has("categories")){
            Iterator<JsonNode> categories = data.get("categories").elements();
            ArrayList<WomanHasCategory> cats = new ArrayList<>();
            while (categories.hasNext()){
                JsonNode next = categories.next();
                Category category = Category.finder.byId(next.asInt());
                if(category != null){
                    WomanHasCategory whc = new WomanHasCategory(category, woman);
                    cats.add(whc);
                }
            }
            woman.setCategories(cats);
        }
        woman.save();
        return woman;
    }
}
