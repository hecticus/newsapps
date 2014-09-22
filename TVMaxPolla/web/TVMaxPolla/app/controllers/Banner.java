package controllers;

import static play.data.Form.form;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.TimeZone;
import java.util.UUID;

import javax.imageio.ImageIO;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceCreate;
import com.hecticus.rackspacecloud.RackspaceDelete;
import com.hecticus.rackspacecloud.RackspacePublish;


import models.Config;
import models.Banners.BannerFile;
import models.Banners.BannerResolution;

import play.data.Form;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;
import utils.Utils;
import views.html.banner.*;


@SuppressWarnings("unused")
public class Banner extends HecticusController {
	
	public static final String imageDir = "files/banneruploader/";
    private static final String containerName = "tvmax_banners";
    private static final int TTL = 900;
	
    final static Form<models.Banners.BannerFile> BannerFileform = form(models.Banners.BannerFile.class);
	final static Form<models.Banners.Banner> BannerForm = form(models.Banners.Banner.class);
	public static Result GO_HOME = redirect(routes.Banner.list(0, "sort", "asc", ""));
	
	@Security.Authenticated(Secured.class)
	public static Result index() {
		return GO_HOME;
	}	
	
	@Security.Authenticated(Secured.class)
	public static Result blank() {		
	   return ok(form.render(BannerForm));
	}


	@Security.Authenticated(Secured.class)
	public static Result edit(Long id) {		
		models.Banners.Banner objBanner = models.Banners.Banner.finder.byId(id);		
        Form<models.Banners.Banner> filledForm = BannerForm.fill(models.Banners.Banner.finder.byId(id));        
        return ok(edit.render(id, filledForm));
    }
	
	@Security.Authenticated(Secured.class)
	public static Result uploadFileBanner(Long id) {
		
		
		BannerResolution objResolution= new BannerResolution();
		List<BannerResolution> lstResolution = objResolution.getAllBannerResolutions();
		
		models.Banners.Banner objBanner = models.Banners.Banner.finder.byId(id);
		List<BannerFile> lstFile = objBanner.getFileList();
		
		for (int i = 0; i < lstResolution.size(); i++) {			
			BannerFile objBannerFile =  BannerFile.getFileByResolution(id, lstResolution.get(i).getWidth(), lstResolution.get(i).getHeight());
			lstResolution.get(i).setFile(objBannerFile);			
		}
				

        Form<models.Banners.Banner> filledForm = BannerForm.fill(models.Banners.Banner.finder.byId(id));        
        return ok(uploadFile.render(id, lstFile,lstResolution));
        
    }
	
	
	
	@Security.Authenticated(Secured.class)
	public static Result update(Long id) {

		models.Banners.Banner objBanner = models.Banners.Banner.finder.byId(id);
		Form<models.Banners.Banner> filledForm = BannerForm.bindFromRequest();
		if(filledForm.hasErrors()) {
			return badRequest(edit.render(id, filledForm));
		}
		
    	models.Banners.Banner gfilledForm = filledForm.get();    	
    	gfilledForm.update(id);
		
		flash("success", "El banner " + gfilledForm.getName() + " se ha eliminado");
		return GO_HOME;
		
	}	
	

	@Security.Authenticated(Secured.class)
	public static Result updateFileBanner(Long id) {

		BannerResolution objResolution= new BannerResolution();
		List<BannerResolution> lstResolution = objResolution.getAllBannerResolutions();
		models.Banners.Banner objBanner = models.Banners.Banner.finder.byId(id);
		List<BannerFile> lstFile = objBanner.getFileList();
		

		Http.MultipartFormData body = request().body().asMultipartFormData();
        List<Http.MultipartFormData.FilePart> lstPicture = body.getFiles();  
        
    	for (int i = 0; i < lstPicture.size(); i++) {
    		
    		Http.MultipartFormData.FilePart picture = getImage(lstPicture.get(i).getKey());
    		
    		if (picture != null) {
    			
    			BannerResolution objBannerResolution = BannerResolution.getBannerResolutionById(Long.parseLong(lstPicture.get(i).getKey()));    			
    			BannerFile objBannerFile = new BannerFile();    			
    			objBannerFile = BannerFile.getFileByResolution(id, objBannerResolution.getWidth(), objBannerResolution.getHeight());
    			
				String fileName = picture.getFilename();
    			String contentType = picture.getContentType();
                File file = picture.getFile();
    			
                Calendar today = new GregorianCalendar(TimeZone.getDefault());
                SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
                sdf.setTimeZone(TimeZone.getDefault());
                UUID idFile = UUID.randomUUID();
               
                File dest = new File(Config.getString("img-Folder-Route-Banner")+sdf.format(today.getTime())+"_"+idFile+".jpeg");
                file.renameTo(dest);
   
                boolean useCDN = Config.getInt("use-cdn")==1;
                if(useCDN && !RackspaceUploadAndPublish(dest)){
                	flash("success", "Error publicando el banner " + lstResolution.get(i).getWidth());                    	
                    Utils.printToLog(Banner.class, "", "no se pudo subir la imagen " + dest.getAbsolutePath(), false, null, "", Config.LOGGER_ERROR);                        
                    //return badRequest(buildBasicResponse(-3, "no se pudo subir la imagen"));
                    if(useCDN) {
                    	 dest.delete();
                    }
                    return badRequest(uploadFile.render(id,lstFile,lstResolution));        
                }
                
                ArrayList<Object> data = new ArrayList<Object>();
                String urlPrefix = Config.getString("rks-CDN-URL-BANNER");
                data.add(urlPrefix+sdf.format(today.getTime())+"_"+idFile+".jpeg");
                Utils.printToLog(Banner.class, "", urlPrefix+sdf.format(today.getTime())+"_"+idFile+".jpeg", false, null, "", Config.LOGGER_INFO);
                
                BufferedImage bffImage = null;
                

				try {
					
					if (objBannerFile == null) {	

    					bffImage = ImageIO.read(new File(dest.getAbsolutePath()));
    					objBannerFile = new models.Banners.BannerFile();
    					objBannerFile.setName(objBanner.getName());	        			        		
            			objBannerFile.setWidth(bffImage.getWidth());
            			objBannerFile.setHeight(bffImage.getHeight());        			
            			objBannerFile.setLocation(data.get(0).toString());
            			lstFile.add(objBannerFile);            			
            			objBanner.setFileList(lstFile);    	
            	    	objBanner.update(id);            			            			
            			if(useCDN) dest.delete();
            			
	    			} else {
	    				
	    				ArrayList<String> lstFileName = new ArrayList<String>();
						String strUrl = lstFile.get(i).getLocation();
						String strfileName = strUrl.substring(strUrl.lastIndexOf('/')+1, strUrl.length());    						
						lstFileName.add(strfileName); 						
						bffImage = ImageIO.read(new File(dest.getAbsolutePath()));
						objBannerFile.setName(objBanner.getName());
						objBannerFile.setLocation(data.get(0).toString());
						lstFile.add(objBannerFile); 						
						objBanner.setFileList(lstFile);
						objBanner.update();						
	        			if(useCDN) dest.delete();	        			
	        			RackspaceDelete(lstFileName);

	    			}
        			
				} catch (IOException e) {
					// TODO Auto-generated catch block
					//e.printStackTrace();
					RackspaceDelete(null);
					if(useCDN) dest.delete();
					flash("success", "Error publicando el banner " + lstResolution.get(i).getWidth());
					return badRequest(uploadFile.render(id,lstFile,lstResolution));   						 
				}
    				
    			

    		}
    	}

		
		flash("success", "Los archvios del banner " + objBanner.getName() + " se han actualizados");
		return GO_HOME;
		
	}	
	

	
	
	@Security.Authenticated(Secured.class)
	public static Result list(int page, String sortBy, String order, String filter) {
        return ok(
            list.render(
            	models.Banners.Banner.page(page, 10, sortBy, order, filter),
                sortBy, order, filter,false
            )
        );
    }
	
	@Security.Authenticated(Secured.class)
	public static Result sort(String ids) {		
		String[] aids = ids.split(",");
		
		for (int i=0; i<aids.length; i++) {
			models.Banners.Banner oBanner = models.Banners.Banner.finder.byId(Long.parseLong(aids[i]));
			oBanner.setSort(i);
			oBanner.save();
		}
		
		return ok("Fine!");		
	}
	
	@Security.Authenticated(Secured.class)
	public static Result lsort() {		 	
	 	return ok(list.render(models.Banners.Banner.page(0, 0,"sort", "asc", ""),"sort", "asc", "",true));
	}	
	
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

	}
	
	@Security.Authenticated(Secured.class)
	public static Result delete(Long id) {
		
		models.Banners.Banner objBanner = models.Banners.Banner.finder.byId(id);
		List<BannerFile> lstFile = objBanner.getFileList();
		ArrayList<String> lstFileName = new ArrayList<String>();
		
		if (lstFile.size() >= 1) {			
			for (int i = 0; i < lstFile.size() ; i++) {				
				String url = lstFile.get(i).getLocation();
				String fileName = url.substring(url.lastIndexOf('/')+1, url.length());
				lstFileName.add(fileName);
			}
		}
		
		RackspaceDelete(lstFileName); 
		models.Banners.Banner.finder.ref(id).delete();
		flash("success", "El banner se ha eliminado");
	    return GO_HOME;
	    
	}	


	@Security.Authenticated(Secured.class)
	public static Result submit() throws IOException {

		Form<models.Banners.Banner> filledForm = BannerForm.bindFromRequest();

		if(filledForm.hasErrors()) {
           return badRequest(form.render(filledForm));         
		}

		models.Banners.Banner gfilledForm = filledForm.get();    	   
   	  	gfilledForm.setSort(models.Banners.Banner.finder.findRowCount());
   	  	gfilledForm.save();

   	   flash("success", "El Banner " + gfilledForm.getName() + " ha sido creado");
   	   return GO_HOME;
		
	}

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
	        
	}	 
	
}
