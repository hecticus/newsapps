package controllers.content.events;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import controllers.HecticusController;
import models.basic.Config;
import models.content.posts.FileType;
import models.events.Event;
import mongo.Location;
import org.mongodb.morphia.geo.Point;
import org.mongodb.morphia.geo.PointBuilder;
import play.data.Form;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Results;
import utils.Utils;

import java.io.File;
import java.util.*;

import static play.data.Form.form;

/**
 * Created by plesse on 3/30/15.
 */
public class Events extends HecticusController {

    final static Form<Event> EventAPIForm = form(Event.class);

    public static Result create() {
        try{
            Form<Event> eventForm = EventAPIForm.bindFromRequest();
            Http.MultipartFormData body = getMultiformData();
            if(eventForm.hasErrors()) {
                return badRequest(buildBasicResponse(1, "El formulario tiene errores"));
            }
            Http.MultipartFormData.FilePart image = body.getFile("image");
            if(image == null){
                return badRequest(buildBasicResponse(2, "Falta el campo image"));
            }
            String contentType = image.getContentType();
            FileType fileType = FileType.getByMimeType(contentType);
            if (fileType != null && !fileType.getName().equalsIgnoreCase("image")) {
                return badRequest(buildBasicResponse(3, "El campo image debe ser una imagen"));
            }
            Event event = eventForm.get();
            event.setStatus(1);
            event.save();
            String fileName = image.getFilename();
            File file = image.getFile();
            String fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length());
            String imagePath = Utils.uploadAttachment(file, event.getIdEvent(), fileExtension, 1);
            event.setImage(imagePath);
            double latitude = Double.parseDouble(eventForm.field("latitude").value());
            double longitude = Double.parseDouble(eventForm.field("longitude").value());
            Location location = Location.createLocation(event.getIdEvent(), latitude, longitude);
            event.setObjectId(location.getId().toString());
            event.update();
            event.refresh();
            return created(buildBasicResponse(0, "OK", event.toJson()));
        } catch (Exception ex) {
            Utils.printToLog(Events.class, "Error manejando garotas", "error creando con params", false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.internalServerError(buildBasicResponse(-1, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        try{
            Form<Event> eventForm = EventAPIForm.bindFromRequest();
            if (eventForm.hasErrors()) {
                return badRequest(buildBasicResponse(1, "El formulario tiene errores"));
            }
            Event originalEvent = Event.getByID(id);
            if(originalEvent != null) {
                Location location = originalEvent.getLocation();
                Event event = eventForm.get();
                event.setIdEvent(id);
                event.setLocation(location);
                event.setObjectId(location.getId().toString());
                Http.MultipartFormData body = getMultiformData();
                Http.MultipartFormData.FilePart image = body.getFile("image");
                if (image != null) {
                    System.out.println(event.getImage());
                    originalEvent.deleteImage();
                    String contentType = image.getContentType();
                    FileType fileType = FileType.getByMimeType(contentType);
                    if (fileType != null && !fileType.getName().equalsIgnoreCase("image")) {
                        return badRequest(buildBasicResponse(3, "El campo image debe ser una imagen"));
                    }
                    String fileName = image.getFilename();
                    File file = image.getFile();
                    String fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length());
                    String imagePath = Utils.uploadAttachment(file, event.getIdEvent(), fileExtension, 1);
                    event.setImage(imagePath);
                }
                String latitudeString = eventForm.field("latitude").value();
                String longitudeString = eventForm.field("longitude").value();
                if(latitudeString != null && !latitudeString.isEmpty() && longitudeString != null && !longitudeString.isEmpty()){
                    double latitude = Double.parseDouble(latitudeString);
                    double longitude = Double.parseDouble(longitudeString);
                    PointBuilder p = new PointBuilder();
                    p.latitude(latitude);
                    p.longitude(longitude);
                    Point loc = p.build();
                    Point originalLoc = location.getLoc();
                    System.out.println(originalLoc + " " + loc);
                    if(!originalLoc.equals(loc)){
                        Location updated = location.update(loc);
                        event.setLocation(updated);
                    }
                }
                event.update();
                event.refresh();
                return created(buildBasicResponse(0, "OK", event.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "El evento " + id + " no existe"));
            }
        } catch (Exception ex) {
            Utils.printToLog(Events.class, "Error manejando eventos", "error creando con params", false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.internalServerError(buildBasicResponse(-1, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            Event event = Event.getByID(id);
            if(event != null) {
                ArrayList<String> files = new ArrayList<>();
                String link = event.getImage();
                link = link.substring(link.lastIndexOf("/")-1);
                files.add(link);
//                Location location = event.getLocation();
//                location.delete();
                if(!files.isEmpty()){
                    String containerName = Config.getString("cdn-container");
                    String username = Config.getString("rackspace-username");
                    String apiKey = Config.getString("rackspace-apiKey");
                    String provider = Config.getString("rackspace-provider");
                    RackspaceDelete rackspaceDelete = new RackspaceDelete(username, apiKey, provider);
                    rackspaceDelete.deleteObjectsFromContainer(containerName, files);
                }
                event.delete();
                return ok(buildBasicResponse(0, "OK", event.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a eliminar"));
            }
        } catch (Exception ex) {
            Utils.printToLog(Events.class, "Error manejando posts", "error eliminando el evento " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }


    public static Result get(Integer id){
        try {
            Event event = Event.getByID(id);
            if(event != null) {
                return ok(buildBasicResponse(0, "OK", event.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el evento " + id));
            }
        }catch (Exception e) {
            Utils.printToLog(Events.class, "Error manejando eventos", "error obteniendo el evento " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize, Integer page){
        try {
            String[] latitudes = getFromQueryString("latitude");
            String[] longitudes = getFromQueryString("longitude");
            ArrayList<ObjectNode> events = new ArrayList<ObjectNode>();
            if(latitudes != null && longitudes != null && latitudes.length > 0 && longitudes.length > 0){
                double latitude = Double.parseDouble(latitudes[0]);
                double longitude = Double.parseDouble(longitudes[0]);
                int maxNearEvents = Config.getInt("max-near-events");
                double maxDistance = Config.getDouble("max-distance-events");
                List<Location> nearEvents = Location.getNearEvents(latitude, longitude, maxDistance, maxNearEvents);
                for(Location location : nearEvents){
                    events.add(location.getEvent().toJson());
                }
            } else {
                Iterator<Event> eventIterator = Event.getPage(pageSize, page);
                while (eventIterator.hasNext()) {
                    events.add(eventIterator.next().toJson());
                }
            }
            return ok(buildBasicResponse(0, "OK", Json.toJson(events)));
        }catch (Exception e) {
            Utils.printToLog(Event.class, "Error manejando Event", "error listando los Event con pageSize " + pageSize + " y " + page, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }




}
