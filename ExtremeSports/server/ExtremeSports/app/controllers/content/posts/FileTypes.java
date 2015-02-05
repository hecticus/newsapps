package controllers.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.content.posts.FileType;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by plesse on 10/1/14.
 */
public class FileTypes extends HecticusController {

    public static Result create() {
        try{
            ObjectNode fileTypeData = getJson();
            ObjectNode response = null;
            if(fileTypeData.has("name") && fileTypeData.has("mime_type")){
                FileType fileType = new FileType(fileTypeData.get("name").asText(), fileTypeData.get("mime_type").asText());
                fileType.save();
                response = buildBasicResponse(0, "OK", fileType.toJson());
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
            ObjectNode fileTypeData = getJson();
            ObjectNode response = null;
            FileType fileType = FileType.getByID(id);
            if(fileType != null) {
                boolean save = false;
                if (fileTypeData.has("name") ) {
                    fileType.setName(fileTypeData.get("name").asText());
                    save = true;
                }
                if (fileTypeData.has("mime_type") ) {
                    fileType.setMimeType(fileTypeData.get("mime_type").asText());
                    save = true;
                }
                if(save){
                    fileType.update();
                }
                response = buildBasicResponse(0, "OK", fileType.toJson());
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
            FileType fileType = FileType.getByID(id);
            if(fileType != null) {
                fileType.delete();
                response = buildBasicResponse(0, "OK", fileType.toJson());
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
            FileType fileType = FileType.getByID(id);
            if(fileType != null) {
                response = buildBasicResponse(0, "OK", fileType.toJson());
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
            Iterator<FileType> fileTypeIterator = FileType.getPage(pageSize, page);
            ArrayList<ObjectNode> fileTypes = new ArrayList<ObjectNode>();
            while(fileTypeIterator.hasNext()){
                fileTypes.add(fileTypeIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(fileTypes));
            return ok(response);
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }
}
