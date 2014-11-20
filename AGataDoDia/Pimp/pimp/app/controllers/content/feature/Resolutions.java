package controllers.content.feature;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.content.feature.Resolution;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by plesse on 11/11/14.
 */
public class Resolutions extends HecticusController {

    public static Result create() {
        try{
            ObjectNode resolutionData = getJson();
            ObjectNode response = null;
            if(resolutionData.has("width") && resolutionData.has("height")){
                Resolution resolution = new Resolution(resolutionData.get("width").asInt(), resolutionData.get("height").asInt());
                resolution.save();
                response = buildBasicResponse(0, "OK", resolution.toJson());
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
            ObjectNode resolutionData = getJson();
            ObjectNode response = null;
            Resolution resolution = Resolution.finder.byId(id);
            if(resolution != null) {
                boolean save = false;
                if (resolutionData.has("width") ) {
                    resolution.setWidth(resolutionData.get("width").asInt());
                    save = true;
                }
                if (resolutionData.has("height") ) {
                    resolution.setHeight(resolutionData.get("height").asInt());
                    save = true;
                }
                if(save){
                    resolution.update();
                }
                response = buildBasicResponse(0, "OK", resolution.toJson());
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
            Resolution resolution = Resolution.finder.byId(id);
            if(resolution != null) {
                resolution.delete();
                response = buildBasicResponse(0, "OK", resolution.toJson());
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
            Resolution resolution = Resolution.finder.byId(id);
            if(resolution != null) {
                response = buildBasicResponse(0, "OK", resolution.toJson());
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

            Iterator<Resolution> resolutionIterator = null;
            if(pageSize == 0){
                resolutionIterator = Resolution.finder.all().iterator();
            }else{
                resolutionIterator = Resolution.finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
            }

            ArrayList<ObjectNode> categories = new ArrayList<ObjectNode>();
            while(resolutionIterator.hasNext()){
                categories.add(resolutionIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(categories));
            return ok(response);
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }
}
