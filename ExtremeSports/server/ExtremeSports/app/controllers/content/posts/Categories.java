package controllers.content.posts;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.basic.Language;
import models.content.posts.Category;
import models.content.posts.CategoryHasLocalization;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by plesse on 10/1/14.
 */
public class Categories extends HecticusController {

    public static Result create() {
        try{
            ObjectNode categoryData = getJson();
            ObjectNode response = null;
            if(categoryData.has("name") && categoryData.has("localizations")){
                Category category = new Category(categoryData.get("name").asText());
                Iterator<JsonNode> localizationsIterator = categoryData.get("localizations").elements();
                ArrayList<CategoryHasLocalization> localizations = new ArrayList<>();
                CategoryHasLocalization categoryHasLocalization = null;
                Language language = null;
                while(localizationsIterator.hasNext()){
                    JsonNode next = localizationsIterator.next();
                    if(next.has("language") && next.has("localization")){
                        language = Language.getByID(next.get("language").asInt());
                        if(language != null){
                            categoryHasLocalization = new CategoryHasLocalization(category, language, next.get("localization").asText());
                            localizations.add(categoryHasLocalization);
                        }
                    }
                }
                category.setLocalizations(localizations);
                category.save();
                response = buildBasicResponse(0, "OK", category.toJson());
            } else {
                response = buildBasicResponse(1, "Faltan campos para crear el registro");
            }
            return ok(response);
        } catch (Exception ex) {
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        try{
            ObjectNode categoryData = getJson();
            ObjectNode response = null;
            Category category = Category.getByID(id);
            if(category != null) {
                boolean save = false;
                if (categoryData.has("name") ) {
                    category.setName(categoryData.get("name").asText());
                    save = true;
                }
                if(save){
                    category.update();
                }
                response = buildBasicResponse(0, "OK", category.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a modificar");
            }
            return ok(response);
        } catch (Exception ex) {
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error actualizando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            ObjectNode response = null;
            Category category = Category.getByID(id);
            if(category != null) {
                category.delete();
                response = buildBasicResponse(0, "OK", category.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a eliminar");
            }
            return ok(response);
        } catch (Exception ex) {
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id){
        try {
            ObjectNode response = null;
            Category category = Category.getByID(id);
            if(category != null) {
                response = buildBasicResponse(0, "OK", category.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page){
        try {
            Iterator<Category> categoryIterator = Category.getPage(pageSize, page);
            ArrayList<ObjectNode> categories = new ArrayList<ObjectNode>();
            while(categoryIterator.hasNext()){
                categories.add(categoryIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(categories));
            return ok(response);
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }
}
