package controllers.content.feature;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.content.feature.FeaturedImage;
import models.content.feature.FeaturedImageHasResolution;
import models.content.feature.Resolution;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by plesse on 11/11/14.
 */
public class FeaturedImages extends HecticusController {
    public static Result create() {
        try{
            ObjectNode featuredImageData = getJson();
            ObjectNode response = null;
            if(featuredImageData.has("name") && featuredImageData.has("links")){
                FeaturedImage featuredImage = new FeaturedImage(featuredImageData.get("name").asText());
                Iterator<JsonNode> links = featuredImageData.get("name").elements();
                ArrayList<FeaturedImageHasResolution> featuredImageHasResolutions = new ArrayList<>();
                while(links.hasNext()){
                    JsonNode image = links.next();
                    if(image.has("resolution") && image.has("link")){
                        Resolution resolution = Resolution.finder.byId(image.get("resolution").asInt());
                        if(resolution != null){
                            featuredImageHasResolutions.add(new FeaturedImageHasResolution(featuredImage, resolution, image.get("link").asText()));
                        }
                    }
                }
                if(!featuredImageHasResolutions.isEmpty()){
                    featuredImage.setResolutions(featuredImageHasResolutions);
                    featuredImage.save();
                    response = buildBasicResponse(0, "OK", featuredImage.toJson());
                } else {
                    response = buildBasicResponse(1, "Faltan campos para crear el registro");
                }
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
            ObjectNode featuredImageData = getJson();
            ObjectNode response = null;
            FeaturedImage featuredImage = FeaturedImage.finder.byId(id);
            if(featuredImage != null) {
                boolean save = false;
                if (featuredImageData.has("name") ) {
                    featuredImage.setName(featuredImageData.get("name").asText());
                    save = true;
                }
                if(save){
                    featuredImage.update();
                }
                response = buildBasicResponse(0, "OK", featuredImage.toJson());
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
            FeaturedImage featuredImage = FeaturedImage.finder.byId(id);
            if(featuredImage != null) {
                featuredImage.delete();
                response = buildBasicResponse(0, "OK", featuredImage.toJson());
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
            FeaturedImage featuredImage = FeaturedImage.finder.byId(id);
            if(featuredImage != null) {
                response = buildBasicResponse(0, "OK", featuredImage.toJson());
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

            Iterator<FeaturedImage> featuredImageIterator = null;
            if(pageSize == 0){
                featuredImageIterator = FeaturedImage.finder.all().iterator();
            }else{
                featuredImageIterator = FeaturedImage.finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
            }

            ArrayList<ObjectNode> categories = new ArrayList<ObjectNode>();
            while(featuredImageIterator.hasNext()){
                categories.add(featuredImageIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(categories));
            return ok(response);
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result getRandomImage(Integer width, Integer height){
        try {
            List<Resolution> resolutions = Resolution.finder.where().ge("width", width).ge("height", height).orderBy("width asc").findList();
            Resolution resolution = null;
            if(resolutions == null || resolutions.isEmpty()){
                resolutions = Resolution.finder.all();
                if(resolutions != null) {
                    resolution = resolutions.get(resolutions.size()-1);
                } else {
                    return ok(buildBasicResponse(1, "No hay imagenes disponibles"));
                }
            } else {
                resolution = resolutions.get(0);
            }
            List<FeaturedImageHasResolution> featuredImageHasResolutions = FeaturedImageHasResolution.finder.where().eq("resolution.idResolution", resolution.getIdResolution()).orderBy("rand()").findList();
            ObjectNode response = null;
            if(featuredImageHasResolutions != null && !featuredImageHasResolutions.isEmpty()){
                response = buildBasicResponse(0, "OK", featuredImageHasResolutions.get(0).toJson());
            } else {
                response = buildBasicResponse(1, "No hay imagenes disponibles");
            }
            return ok(response);
        }catch (Exception e) {
//            Utils.printToLog(ClientsWs.class, "Error manejando Clientes", "error buscando el cliente " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }
}
