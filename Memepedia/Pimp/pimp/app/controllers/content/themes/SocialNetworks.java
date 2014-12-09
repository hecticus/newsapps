package controllers.content.themes;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.content.themes.*;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by plesse on 10/1/14.
 */
public class SocialNetworks extends HecticusController {

    public static Result create() {
        try{
            ObjectNode socialNetworkData = getJson();
            ObjectNode response = null;
            if(socialNetworkData.has("name") && socialNetworkData.has("home")){
                SocialNetwork socialNetwork = new SocialNetwork(socialNetworkData.get("name").asText(), socialNetworkData.get("home").asText());
                socialNetwork.save();
                response = buildBasicResponse(0, "OK", socialNetwork.toJson());
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
            ObjectNode socialNetworkData = getJson();
            ObjectNode response = null;
            SocialNetwork socialNetwork = SocialNetwork.finder.byId(id);
            if(socialNetwork != null) {
                boolean save = false;
                if (socialNetworkData.has("name") ) {
                    socialNetwork.setName(socialNetworkData.get("name").asText());
                    save = true;
                }
                if (socialNetworkData.has("home")) {
                    socialNetwork.setHome(socialNetworkData.get("home").asText());
                    save = true;
                }
                if(save){
                    socialNetwork.update();
                }
                response = buildBasicResponse(0, "OK", socialNetwork.toJson());
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
            SocialNetwork socialNetwork = SocialNetwork.finder.byId(id);
            if(socialNetwork != null) {
                socialNetwork.delete();
                response = buildBasicResponse(0, "OK", socialNetwork.toJson());
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
            SocialNetwork socialNetwork = SocialNetwork.finder.byId(id);
            if(socialNetwork != null) {
                response = buildBasicResponse(0, "OK", socialNetwork.toJson());
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

            Iterator<SocialNetwork> socialNetworkIterator = null;
            if(pageSize == 0){
                socialNetworkIterator = SocialNetwork.finder.all().iterator();
            }else{
                socialNetworkIterator = SocialNetwork.finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
            }

            ArrayList<ObjectNode> socialNetworks = new ArrayList<ObjectNode>();
            while(socialNetworkIterator.hasNext()){
                socialNetworks.add(socialNetworkIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(socialNetworks));
            return ok(response);
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }



}
