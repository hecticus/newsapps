package controllers;

import static play.data.Form.form;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Locale;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import models.basic.Config;
import models.content.themes.Category;
import models.content.themes.SocialNetwork;
import models.content.themes.Theme;
import play.data.Form;
import play.data.format.Formatters;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.Utils;

import views.html.themes.*;


@SuppressWarnings("unused")
public class ThemesView extends HecticusController {

    private static final int TTL = 900;

	final static Form<Theme> ThemesViewForm = form(Theme.class);
	public static Result GO_HOME = redirect(routes.ThemesView.list(0, "name", "asc", ""));
	
	@Restrict(@Group(Application.USER_ROLE))
	public static Result index() {
		return GO_HOME;
	}	
	
	@Restrict(@Group(Application.USER_ROLE))
	public static Result blank() {		
	    return ok(form.render(ThemesViewForm));
	}


	@Restrict(@Group(Application.USER_ROLE))
	public static Result edit(Integer id) {
		Theme theme = Theme.finder.byId(id);
        Form<Theme> filledForm = ThemesViewForm.fill(theme);
        return ok(edit.render(id, filledForm));
    }
	
	
	@Restrict(@Group(Application.USER_ROLE))
	public static Result update(Integer id) {
        Formatters.register(Category.class, new Formatters.SimpleFormatter<Category>() {
            @Override
            public Category parse(String input, Locale arg1) throws ParseException {
                Category category = Category.finder.byId(new Integer(input));
                return category;
            }

            @Override
            public String print(Category category, Locale arg1) {
                return category.getIdCategory().toString();
            }
        });

        Formatters.register(SocialNetwork.class, new Formatters.SimpleFormatter<SocialNetwork>() {
            @Override
            public SocialNetwork parse(String input, Locale arg1) throws ParseException {
                SocialNetwork socialNetwork = SocialNetwork.finder.byId(new Integer(input));
                return socialNetwork;
            }

            @Override
            public String print(SocialNetwork socialNetwork, Locale arg1) {
                return socialNetwork.getIdSocialNetwork().toString();
            }
        });

		Theme theme = Theme.finder.byId(id);
		Form<Theme> filledForm = ThemesViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
			return badRequest(edit.render(id, filledForm));
		}

        boolean change = false;
        String link = "";
        if(filledForm.data().containsKey("defaultPhoto")){
            String defaultPhoto = filledForm.data().get("defaultPhoto");
            if(!theme.getDefaultPhoto().equalsIgnoreCase(defaultPhoto)){
                Http.MultipartFormData body = request().body().asMultipartFormData();
                Http.MultipartFormData.FilePart picture = body.getFile("defaultPhoto");
                String fileName = picture.getFilename();
                String contentType = picture.getContentType();
                File file = picture.getFile();
                String fileExtension = fileName.substring(fileName.lastIndexOf(".")-1, fileName.length());
                try {
                    link = Utils.uploadAttachment(file, id, fileExtension, true);
                    change = true;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    	Theme gfilledForm = filledForm.get();
        if(change) {
            gfilledForm.setDefaultPhoto(link);
        }
        gfilledForm.setIdTheme(id);
    	gfilledForm.update(id);

        flash("success", Messages.get("themes.java.updated", gfilledForm.getName()));
		return GO_HOME;
		
	}	

	@Restrict(@Group(Application.USER_ROLE))
	public static Result list(int page, String sortBy, String order, String filter) {
        return ok(
                list.render(
                        Theme.page(page, 10, sortBy, order, filter),
                        sortBy, order, filter, false
                )
        );
    }
	
	@Restrict(@Group(Application.USER_ROLE))
	public static Result sort(String ids) {		
		String[] aids = ids.split(",");
		
		for (int i=0; i<aids.length; i++) {
			Theme oTheme = Theme.finder.byId(Integer.parseInt(aids[i]));
			//oTheme.setSort(i);
			oTheme.save();
		}
		
		return ok("Fine!");		
	}
	
	@Restrict(@Group(Application.USER_ROLE))
	public static Result lsort() {		 	
	 	return ok(list.render(Theme.page(0, 0, "name", "asc", ""),"name", "asc", "",true));
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
		Theme theme = Theme.finder.byId(id);
        ArrayList<String> files = new ArrayList<>();
        String link = theme.getDefaultPhoto();
        link = link.substring(link.lastIndexOf("/"));
        System.out.println(id+link);
        files.add(id + link);
        String containerName = Config.getString("cdn-container");
        String username = Config.getString("rackspace-username");
        String apiKey = Config.getString("rackspace-apiKey");
        String provider = Config.getString("rackspace-provider");
        RackspaceDelete rackspaceDelete = new RackspaceDelete(username, apiKey, provider);
        rackspaceDelete.deleteObjectsFromContainer(containerName, files);
        theme.delete();
        flash("success", Messages.get("themes.java.deleted", theme.getName()));
		return GO_HOME;
	}


	@Restrict(@Group(Application.USER_ROLE))
	public static Result submit() throws IOException {
        Formatters.register(Category.class, new Formatters.SimpleFormatter<Category>() {
            @Override
            public Category parse(String input, Locale arg1) throws ParseException {
                Category category = Category.finder.byId(new Integer(input));
                return category;
            }

            @Override
            public String print(Category category, Locale arg1) {
                return category.getIdCategory().toString();
            }
        });

        Formatters.register(SocialNetwork.class, new Formatters.SimpleFormatter<SocialNetwork>() {
            @Override
            public SocialNetwork parse(String input, Locale arg1) throws ParseException {
                SocialNetwork socialNetwork = SocialNetwork.finder.byId(new Integer(input));
                return socialNetwork;
            }

            @Override
            public String print(SocialNetwork socialNetwork, Locale arg1) {
                return socialNetwork.getIdSocialNetwork().toString();
            }
        });

		Form<Theme> filledForm = ThemesViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
           return badRequest(form.render(filledForm));
		}
        Theme gfilledForm = filledForm.get();
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
                link = Utils.uploadAttachment(file, gfilledForm.getIdTheme().intValue(), fileExtension, true);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        gfilledForm.setDefaultPhoto(link);
        gfilledForm.update();
        flash("success", Messages.get("themes.java.created", gfilledForm.getName()));
        return GO_HOME;
		
	}

    /*
	@Security.Authenticated(Secured.class)
	private static boolean RackspaceUploadAndPublish(File file) {

        String username = "hctcsproddfw";
        String apiKey = "276ef48143b9cd81d3bef7ad9fbe4e06";
        String provider = "cloudfiles-us";
        RackspaceCreate upload = new RackspaceCreate(username, apiKey, provider);
        RackspacePublish pub = new RackspacePublish(username, apiKey, provider);
        long init = System.currentTimeMillis();
        int retry = 3;
        if(upload == null || pub == null){
            return false;
        }
        try {
            upload.createContainer(containerName);
            Utils.printToLog(Banner.class, "", "Creado container " + containerName, false, null, "", Config.LOGGER_INFO);
            //resources
            boolean uploaded = uploadFile(upload, retry, containerName, file, "advertising", init);
            Utils.printToLog(Banner.class, "", "Archivo" + (!uploaded?" NO":"") + " subido " + file.getAbsolutePath(), false, null, "", Config.LOGGER_INFO);
            if(uploaded){
                //publish
                pub.enableCdnContainer(containerName, TTL);
                Utils.printToLog(Banner.class, "", "Container CDN enabled", false, null, "", Config.LOGGER_INFO);
            }
            return uploaded;
        } catch (Exception ex) {
            Utils.printToLog(null, "", "Error subiendo el archivo al CDN", false, ex, "", Config.LOGGER_ERROR);
            return false;
        }
	        
	}*/
	
}
