package controllers;

import static play.data.Form.form;

import java.io.File;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Locale;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import models.basic.Config;
import models.content.posts.FileType;
import models.content.women.Category;
import models.content.women.SocialNetwork;
import play.data.Form;
import play.data.format.Formatters;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;
import utils.Utils;

import views.html.women.*;


@SuppressWarnings("unused")
public class WomenView extends HecticusController {

    private static final int TTL = 900;

	final static Form<models.content.women.Woman> WomenViewForm = form(models.content.women.Woman.class);
	public static Result GO_HOME = redirect(routes.WomenView.list(0, "name", "asc", ""));
	
	//@Security.Authenticated(Secured.class)
	public static Result index() {
		return GO_HOME;
	}	
	
	//@Security.Authenticated(Secured.class)
	public static Result blank() {		
	    return ok(form.render(WomenViewForm));
	}


	//@Security.Authenticated(Secured.class)
	public static Result edit(Integer id) {
		models.content.women.Woman objBanner = models.content.women.Woman.finder.byId(id);		
        Form<models.content.women.Woman> filledForm = WomenViewForm.fill(models.content.women.Woman.finder.byId(id));
        return ok(edit.render(id, filledForm));
    }
	
	
	//@Security.Authenticated(Secured.class)
	public static Result update(Integer id) {
        Formatters.register(Category.class, new Formatters.SimpleFormatter<Category>() {
            @Override
            public Category parse(String input, Locale arg1) throws ParseException {
                System.out.println("PASANDO!!! "+input);
                Category category = Category.finder.byId(new Integer(input));
                System.out.println("Category!!! "+category.getIdCategory());
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

		models.content.women.Woman woman = models.content.women.Woman.finder.byId(id);
		Form<models.content.women.Woman> filledForm = WomenViewForm.bindFromRequest();
        System.out.println("IMPRIMIENDO!!!!");
        System.out.println(filledForm.toString());
		if(filledForm.hasErrors()) {
			return badRequest(edit.render(id, filledForm));
		}

        boolean change = false;
        String link = "";
        if(filledForm.data().containsKey("defaultPhoto")){
            String defaultPhoto = filledForm.data().get("defaultPhoto");
            if(!woman.getDefaultPhoto().equalsIgnoreCase(defaultPhoto)){
                Http.MultipartFormData body = request().body().asMultipartFormData();
                Http.MultipartFormData.FilePart picture = body.getFile("defaultPhoto");
                String fileName = picture.getFilename();
                String contentType = picture.getContentType();
                File file = picture.getFile();
                String fileExtension = fileName.substring(fileName.lastIndexOf(".")-1, fileName.length());
                try {
                    link = Utils.uploadAttachment(file, id, fileExtension);
                    change = true;
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    	models.content.women.Woman gfilledForm = filledForm.get();
        if(change) {
            gfilledForm.setDefaultPhoto(link);
        }
        gfilledForm.setIdWoman(id);
    	gfilledForm.update(id);
		
		flash("success", "La mujer " + gfilledForm.getName() + " se ha actualizado");
		return GO_HOME;
		
	}	

	//@Security.Authenticated(Secured.class)
	public static Result list(int page, String sortBy, String order, String filter) {
        return ok(
                list.render(
                        models.content.women.Woman.page(page, 10, sortBy, order, filter),
                        sortBy, order, filter, false
                )
        );
    }
	
	//@Security.Authenticated(Secured.class)
	public static Result sort(String ids) {		
		String[] aids = ids.split(",");
		
		for (int i=0; i<aids.length; i++) {
			models.content.women.Woman oWoman = models.content.women.Woman.finder.byId(Integer.parseInt(aids[i]));
			//oWoman.setSort(i);
			oWoman.save();
		}
		
		return ok("Fine!");		
	}
	
	//@Security.Authenticated(Secured.class)
	public static Result lsort() {		 	
	 	return ok(list.render(models.content.women.Woman.page(0, 0,"name", "asc", ""),"name", "asc", "",true));
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

	//@Security.Authenticated(Secured.class)
	public static Result delete(Integer id) {
		models.content.women.Woman woman = models.content.women.Woman.finder.byId(id);
        ArrayList<String> files = new ArrayList<>();
        String link = woman.getDefaultPhoto();
        link = link.substring(link.lastIndexOf("/"));
        System.out.println(id+link);
        files.add(id + link);
        String containerName = Config.getString("cdn-container");
        String username = Config.getString("rackspace-username");
        String apiKey = Config.getString("rackspace-apiKey");
        String provider = Config.getString("rackspace-provider");
        RackspaceDelete rackspaceDelete = new RackspaceDelete(username, apiKey, provider);
        rackspaceDelete.deleteObjectsFromContainer(containerName, files);
        woman.delete();
		flash("success", "La mujer se ha eliminado");
	    return GO_HOME;
	}


	//@Security.Authenticated(Secured.class)
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

		Form<models.content.women.Woman> filledForm = WomenViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
           return badRequest(form.render(filledForm));
		}
        models.content.women.Woman gfilledForm = filledForm.get();
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
                link = Utils.uploadAttachment(file, gfilledForm.getIdWoman().intValue(), fileExtension);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        gfilledForm.setDefaultPhoto(link);
        gfilledForm.update();

        flash("success", "La mujer " + gfilledForm.getName() + " ha sido creado");
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
