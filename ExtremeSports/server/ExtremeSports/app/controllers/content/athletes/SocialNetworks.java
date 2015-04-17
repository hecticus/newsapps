package controllers.content.athletes;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.content.athletes.*;
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
            if(socialNetworkData.has("name") && socialNetworkData.has("home")){
                SocialNetwork socialNetwork = new SocialNetwork(socialNetworkData.get("name").asText(), socialNetworkData.get("home").asText());
                socialNetwork.save();
                return created(buildBasicResponse(0, "OK", socialNetwork.toJson()));
            } else {
                return badRequest(buildBasicResponse(1, "Faltan campos para crear el registro"));
            }
        } catch (Exception ex) {
            return internalServerError(buildBasicResponse(-1, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        try{
            ObjectNode socialNetworkData = getJson();
            SocialNetwork socialNetwork = SocialNetwork.getByID(id);
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
                return ok(buildBasicResponse(0, "OK", socialNetwork.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a modificar"));
            }
        } catch (Exception ex) {
            return internalServerError(buildBasicResponse(-1, "ocurrio un error actualizando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            SocialNetwork socialNetwork = SocialNetwork.getByID(id);
            if(socialNetwork != null) {
                socialNetwork.delete();
                return ok(buildBasicResponse(0, "OK", socialNetwork.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a consultar"));
            }
        } catch (Exception ex) {
            return internalServerError(buildBasicResponse(-1, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id){
        try {
            SocialNetwork socialNetwork = SocialNetwork.getByID(id);
            if(socialNetwork != null) {
                return ok(buildBasicResponse(0, "OK", socialNetwork.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a consultar"));
            }
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page){
        try {
            Iterator<SocialNetwork> socialNetworkIterator = SocialNetwork.getPage(pageSize, page);
            ArrayList<ObjectNode> socialNetworks = new ArrayList<ObjectNode>();
            while(socialNetworkIterator.hasNext()){
                socialNetworks.add(socialNetworkIterator.next().toJson());
            }
            return ok(buildBasicResponse(0, "OK", Json.toJson(socialNetworks)));
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-1,"Error buscando el registro",e));
        }
    }



}
