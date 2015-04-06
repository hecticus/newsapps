package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import models.basic.Config;
import models.content.posts.FileType;
import models.events.Event;
import mongo.Location;
import org.mongodb.morphia.geo.Point;
import org.mongodb.morphia.geo.PointBuilder;
import play.data.Form;
import play.data.format.Formatters;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;

import static play.data.Form.form;

import utils.Utils;
import views.html.events.*;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Map;

/**
 * Created by plesse on 4/1/15.
 */
public class EventsView extends HecticusController {

    //Admin Methods

    final static Form<Event> EventsForm = form(Event.class);
    public static Result GO_HOME = redirect(routes.EventsView.list(0, "date", "asc", ""));

    @Restrict(@Group(Application.USER_ROLE))
    public static Result index() {
        return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result blank() {
        return ok(form.render(EventsForm));
    }


    @Restrict(@Group(Application.USER_ROLE))
    public static Result edit(Integer id) {
        Event event = Event.getByID(id);
        Form<Event> filledForm = EventsForm.fill(event);
        Location location = event.getLocation();
        filledForm.data().put("longitude", location!=null?String.valueOf(location.getLoc().getLongitude()):"0.0");
        filledForm.data().put("latitude", location!=null?String.valueOf(location.getLoc().getLatitude()):"0.0");
        return ok(edit.render(id, filledForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result update(Integer id) {
        Event event = Event.getByID(id);
        Form<Event> filledForm = EventsForm.bindFromRequest();
        Map<String, String> data = filledForm.data();
        String lng = data.get("longitude");
        String ltd = data.get("latitude");
        if(lng.isEmpty() || ltd.isEmpty()) {
            flash("error", Messages.get("events.java.error.coords"));
            return badRequest(edit.render(id, filledForm));
        }
        double longitude = Double.parseDouble(lng);
        double latitude = Double.parseDouble(ltd);
        Event gfilledForm = filledForm.get();
        Http.MultipartFormData body = request().body().asMultipartFormData();
        String link = "";
        if(filledForm.data().containsKey("image")){
            String defaultPhoto = filledForm.data().get("image");
            System.out.println(event.getImage() + " " + defaultPhoto);
            if(!event.getImage().equalsIgnoreCase(defaultPhoto)) {
                Http.MultipartFormData.FilePart picture = body.getFile("image");
                String fileName = picture.getFilename();
                String contentType = picture.getContentType();
                FileType fileType = FileType.getByMimeType(contentType);
                if (fileType != null && !fileType.getName().equalsIgnoreCase("image")) {
                    flash("error", Messages.get("events.java.error.file"));
                    return badRequest(edit.render(event.getIdEvent(), filledForm));
                }
                File file = picture.getFile();
                String fileExtension = fileName.substring(fileName.lastIndexOf(".") - 1, fileName.length());
                try {
                    link = Utils.uploadAttachment(file, event.getIdEvent(), fileExtension, 1);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                gfilledForm.setImage(link);
            }
        }

        Location location = event.getLocation();
        if(location != null) {
            PointBuilder p = new PointBuilder();
            p.latitude(latitude);
            p.longitude(longitude);
            Point loc = p.build();
            Point originalLoc = location.getLoc();
            System.out.println(originalLoc + " " + loc);
            if (!originalLoc.equals(loc)) {
                location = location.update(loc);
                gfilledForm.setLocation(location);
            }
        } else {
            location = Location.createLocation(id, latitude, longitude);
        }
        gfilledForm.setLocation(location);
        gfilledForm.setObjectId(location.getId().toString());
        gfilledForm.setIdEvent(id);
        gfilledForm.update(id);
        flash("success", Messages.get("events.java.updated", gfilledForm.getIdEvent()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Event.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");
        for (int i=0; i<aids.length; i++) {
            Event event = Event.getByID(Integer.parseInt(aids[i]));
            //event.setSort(i);
            event.save();
        }
        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(Event.page(0, 0, "date", "asc", ""),"date", "asc", "",true));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result delete(Integer id) {
        Event event = Event.getByID(id);
        event.delete();
        flash("success", Messages.get("events.java.deleted", event.getIdEvent()));
        return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result submit() throws IOException {
        Form<Event> filledForm = EventsForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }
        Map<String, String> data = filledForm.data();
        String lng = data.get("longitude");
        String ltd = data.get("latitude");
        if(lng.isEmpty() || ltd.isEmpty()) {
            flash("error", Messages.get("events.java.error.coords"));
            return badRequest(form.render(filledForm));
        }
        double longitude = Double.parseDouble(lng);
        double latitude = Double.parseDouble(ltd);
        Event event = filledForm.get();
        event.save();
        Http.MultipartFormData body = request().body().asMultipartFormData();
        String link = "";
        if(filledForm.data().containsKey("image")){
            Http.MultipartFormData.FilePart picture = body.getFile("image");
            String fileName = picture.getFilename();
            String contentType = picture.getContentType();
            FileType fileType = FileType.getByMimeType(contentType);
            if (fileType != null && !fileType.getName().equalsIgnoreCase("image")) {
                flash("error", Messages.get("events.java.error.file"));
                return badRequest(edit.render(event.getIdEvent(), filledForm));
            }
            File file = picture.getFile();
            String fileExtension = fileName.substring(fileName.lastIndexOf(".")-1, fileName.length());
            try {
                link = Utils.uploadAttachment(file, event.getIdEvent(), fileExtension, 1);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        Location location = Location.createLocation(event.getIdEvent(), latitude, longitude);
        event.setObjectId(location.getId().toString());
        event.setImage(link);
        event.update();
        flash("success", Messages.get("events.java.created", event.getIdEvent()));
        return GO_HOME;

    }

}
