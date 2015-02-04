package controllers.content.athletes;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.content.athletes.Category;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by plesse on 10/1/14.
 */
public class Sports extends HecticusController {

    public static Result create() {
        try{
            ObjectNode sportData = getJson();
            ObjectNode response = null;
            if(sportData.has("name")){
                Category category = new Category(sportData.get("name").asText());
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
            ObjectNode sportData = getJson();
            ObjectNode response = null;
            Category category = Category.finder.byId(id);
            if(category != null) {
                boolean save = false;
                if (sportData.has("name") ) {
                    category.setName(sportData.get("name").asText());
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
            Category category = Category.finder.byId(id);
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
            Category category = Category.finder.byId(id);
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

            Iterator<Category> sportIterator = null;
            if(pageSize == 0){
                sportIterator = Category.finder.all().iterator();
            }else{
                sportIterator = Category.finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
            }

            ArrayList<ObjectNode> categories = new ArrayList<ObjectNode>();
            while(sportIterator.hasNext()){
                categories.add(sportIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(categories));
            return ok(response);
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }
}
