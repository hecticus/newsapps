package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import models.basic.Config;
import models.content.athletes.Athlete;
import models.content.athletes.SocialNetwork;
import play.data.Form;
import play.data.format.Formatters;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.Utils;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Locale;

import static play.data.Form.form;

import views.html.athletes.*;

/**
 * Created by plesse on 3/12/15.
 */
public class AthletesView extends HecticusController {

    //Admin Methods

    final static Form<Athlete> AthletesForm = form(Athlete.class);
    public static Result GO_HOME = redirect(routes.AthletesView.list(0, "name", "asc", ""));

    @Restrict(@Group(Application.USER_ROLE))
    public static Result index() {
        return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result blank() {
        return ok(form.render(AthletesForm));
    }


    @Restrict(@Group(Application.USER_ROLE))
    public static Result edit(Integer id) {
        Athlete athlete = Athlete.getByID(id);
        Form<Athlete> filledForm = AthletesForm.fill(athlete);
        return ok(edit.render(id, filledForm));
    }


    @Restrict(@Group(Application.USER_ROLE))
    public static Result update(Integer id) {
        Formatters.register(SocialNetwork.class, new Formatters.SimpleFormatter<SocialNetwork>() {
            @Override
            public SocialNetwork parse(String input, Locale arg1) throws ParseException {
                SocialNetwork socialNetwork = SocialNetwork.getByID(new Integer(input));
                return socialNetwork;
            }

            @Override
            public String print(SocialNetwork socialNetwork, Locale arg1) {
                return socialNetwork.getIdSocialNetwork().toString();
            }
        });

        Athlete athlete = Athlete.getByID(id);
        Form<Athlete> filledForm = AthletesForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            return badRequest(edit.render(id, filledForm));
        }

        boolean change = false;
        String link = "";
        if(filledForm.data().containsKey("defaultPhoto")){
            String defaultPhoto = filledForm.data().get("defaultPhoto");
            if(!athlete.getDefaultPhoto().equalsIgnoreCase(defaultPhoto)){
                Http.MultipartFormData body = request().body().asMultipartFormData();
                Http.MultipartFormData.FilePart picture = body.getFile("defaultPhoto");
                String fileName = picture.getFilename();
                String contentType = picture.getContentType();
                File file = picture.getFile();
                String fileExtension = fileName.substring(fileName.lastIndexOf(".")-1, fileName.length());
                try {
                    link = Utils.uploadAttachment(file, id, fileExtension, 0);
                    change = true;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        Athlete gfilledForm = filledForm.get();
        if(change) {
            gfilledForm.setDefaultPhoto(link);
        }
        gfilledForm.setIdAthlete(id);
        gfilledForm.update(id);

        flash("success", Messages.get("athletes.java.updated", gfilledForm.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(
                list.render(
                        Athlete.page(page, 10, sortBy, order, filter),
                        sortBy, order, filter, false
                )
        );
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Athlete oAthlete = Athlete.getByID(Integer.parseInt(aids[i]));
            //oAthlete.setSort(i);
            oAthlete.save();
        }

        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(Athlete.page(0, 0, "name", "asc", ""),"name", "asc", "",true));
    }

    /*
	@Security.Authenticated(Secured.class)
	public static boolean RackspaceDelete(ArrayList<String> lstFileName) {

		try {
			String username = "hctcsproddfw";
	        String apiKey = "276ef48143b9cd81d3bef7ad9fbe4e06";
	        String provider = "cloudfiles-us";
	        RackspaceDelete delete = new RackspaceDelete(username, apiKey, provider);

	        if (lstFileName == null) {
	        	delete.deleteObjectsFromContainer(containerName);
	        } else {
	        	delete.deleteObjectsFromContainer(containerName,lstFileName);
	        }

	        return true;
		} catch (Exception e) {
			// TODO: handle exception
			return false;
		}

	}*/

    @Restrict(@Group(Application.USER_ROLE))
    public static Result delete(Integer id) {
        Athlete athlete = Athlete.getByID(id);
        ArrayList<String> files = new ArrayList<>();
        String link = athlete.getDefaultPhoto();
        link = link.substring(link.lastIndexOf("/"));
        System.out.println(id+link);
        files.add(id + link);
        String containerName = Config.getString("cdn-container");
        String username = Config.getString("rackspace-username");
        String apiKey = Config.getString("rackspace-apiKey");
        String provider = Config.getString("rackspace-provider");
        RackspaceDelete rackspaceDelete = new RackspaceDelete(username, apiKey, provider);
        rackspaceDelete.deleteObjectsFromContainer(containerName, files);
        athlete.delete();
        flash("success", Messages.get("athletes.java.deleted", athlete.getName()));
        return GO_HOME;
    }


    @Restrict(@Group(Application.USER_ROLE))
    public static Result submit() throws IOException {
        Formatters.register(SocialNetwork.class, new Formatters.SimpleFormatter<SocialNetwork>() {
            @Override
            public SocialNetwork parse(String input, Locale arg1) throws ParseException {
                SocialNetwork socialNetwork = SocialNetwork.getByID(new Integer(input));
                return socialNetwork;
            }

            @Override
            public String print(SocialNetwork socialNetwork, Locale arg1) {
                return socialNetwork.getIdSocialNetwork().toString();
            }
        });

        Form<Athlete> filledForm = AthletesForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }
        Athlete gfilledForm = filledForm.get();
        gfilledForm.save();

        Http.MultipartFormData body = request().body().asMultipartFormData();
        ObjectNode data = Json.newObject();
        String link = "";
        if(filledForm.data().containsKey("defaultPhoto")){
            Http.MultipartFormData.FilePart picture = body.getFile("defaultPhoto");
            String fileName = picture.getFilename();
            String contentType = picture.getContentType();
            File file = picture.getFile();
            String fileExtension = fileName.substring(fileName.lastIndexOf(".")-1, fileName.length());
            try {
                link = Utils.uploadAttachment(file, gfilledForm.getIdAthlete().intValue(), fileExtension, 0);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        gfilledForm.setDefaultPhoto(link);
        gfilledForm.update();
        flash("success", Messages.get("athletes.java.created", gfilledForm.getName()));
        return GO_HOME;

    }

}
