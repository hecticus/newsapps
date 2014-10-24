package controllers;

import static play.data.Form.form;

import java.io.IOException;

import play.data.Form;
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

		models.content.women.Woman objBanner = models.content.women.Woman.finder.byId(id);
		Form<models.content.women.Woman> filledForm = WomenViewForm.bindFromRequest();
		if(filledForm.hasErrors()) {
			return badRequest(edit.render(id, filledForm));
		}
		
    	models.content.women.Woman gfilledForm = filledForm.get();
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
		
		/*models.content.women.Woman objBanner = models.content.women.Woman.finder.byId(id);

		models.content.women.Woman.finder.ref(id).delete();
		flash("success", "La mujer se ha eliminado");*/
	    return GO_HOME;
	    
	}	


	//@Security.Authenticated(Secured.class)
	public static Result submit() throws IOException {

		Form<models.content.women.Woman> filledForm = WomenViewForm.bindFromRequest();

		if(filledForm.hasErrors()) {
           return badRequest(form.render(filledForm));
		}

		models.content.women.Woman gfilledForm = filledForm.get();    	   
   	  	//gfilledForm.setSort(models.content.women.Woman.finder.findRowCount());
   	  	gfilledForm.save();

   	   flash("success", "El Banner " + gfilledForm.getName() + " ha sido creado");
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
