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

import controllers.newsapi.YoInformoController;
import models.Config;
import models.news.BannerFile;
import models.news.BannerResolution;
import models.news.Category;
//import play.twirl.api.Html;
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
    private static final String containerName = "tvn_advertising_upload";
    private static final int TTL = 900;
	
    final static Form<models.news.BannerFile> BannerFileform = form(models.news.BannerFile.class);
	final static Form<models.news.Banner> BannerForm = form(models.news.Banner.class);
	public static Result GO_HOME = redirect(routes.Banner.list(0, "sort", "asc", ""));
	
	@Security.Authenticated(Secured.class)
	public static Result index() {
		return GO_HOME;
	}	
	
	@Security.Authenticated(Secured.class)
	public static Result blank() {
		BannerResolution objResolution= new BannerResolution();
		List<BannerResolution> lstResolution = objResolution.getAllBannerResolutions();		
	   return ok(form.render(BannerForm,lstResolution));
	}
	
	@Security.Authenticated(Secured.class)
	public static Result edit(Long id) {
		
		models.news.Banner objBanner = models.news.Banner.finder.byId(id);
		List<BannerFile> lstFile = objBanner.getFileList();
		
        Form<models.news.Banner> filledForm = BannerForm.fill(
        		models.news.Banner.finder.byId(id)
        );
        
        return ok(
            edit.render(id, filledForm,lstFile)
        );
    }
	
	@Security.Authenticated(Secured.class)
	public static Result update(Long id) {

		BannerResolution objResolution= new BannerResolution();
		List<BannerResolution> lstResolution = objResolution.getAllBannerResolutions();
		models.news.Banner objBanner = models.news.Banner.finder.byId(id);
		List<BannerFile> lstFile = objBanner.getFileList();
		List <models.news.BannerFile>  lstBannerFile =   models.news.BannerFile.finder.all();
		
		Form<models.news.Banner> filledForm = BannerForm.bindFromRequest();
		if(filledForm.hasErrors()) {
			return badRequest(edit.render(id, filledForm, lstFile));
		}
		
		
		Http.MultipartFormData body = request().body().asMultipartFormData();
        List<Http.MultipartFormData.FilePart> lstPicture = body.getFiles();  
        
    	for (int i = 0; i < lstPicture.size(); i++) {

    		Http.MultipartFormData.FilePart picture = getImage(lstPicture.get(i).getKey());
    		
    		if (picture != null) {

    			for (int f = 0; f < lstBannerFile.size(); f++) {
    				if (lstBannerFile.get(f).getIdBannerFile() == Long.parseLong(lstPicture.get(i).getKey())) {

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
    	                    if(useCDN) dest.delete();
    	                    return badRequest(form.render(filledForm,lstResolution));        
    	                }
    	                
    	                ArrayList<Object> data = new ArrayList<Object>();
    	                String urlPrefix = Config.getString("rks-CDN-URL-BANNER");
    	                data.add(urlPrefix+sdf.format(today.getTime())+"_"+idFile+".jpeg");
    	                Utils.printToLog(Banner.class, "", urlPrefix+sdf.format(today.getTime())+"_"+idFile+".jpeg", false, null, "", Config.LOGGER_INFO);                    
    	             
    	                BufferedImage bffImage = null;
    					try {
    						    						
    						ArrayList<String> lstFileName = new ArrayList<String>();
    						String strUrl = lstBannerFile.get(f).getLocation();
    						String strfileName = strUrl.substring(strUrl.lastIndexOf('/')+1, strUrl.length());    						
    						lstFileName.add(strfileName); 
    						
    						bffImage = ImageIO.read(new File(dest.getAbsolutePath()));
    						models.news.BannerFile objBannerFile = new models.news.BannerFile();						
    						lstBannerFile.get(f).setName(file.getName());	        			        		
    						lstBannerFile.get(f).setWidth(bffImage.getWidth());
    						lstBannerFile.get(f).setHeight(bffImage.getHeight());        			
    	        			lstBannerFile.get(f).setLocation(data.get(0).toString());
    	        			if(useCDN) dest.delete();
    	        			
    	        			RackspaceDelete(lstFileName);

    					} catch (IOException e) {
    						// TODO Auto-generated catch block
    						//e.printStackTrace();
    						if(useCDN) dest.delete();
    						flash("success", "Error publicando el banner " + lstResolution.get(i).getWidth());
    						return badRequest(form.render(filledForm,lstResolution));       						
    					}

    				}
    			}
    			

    		}
    	}


    	models.news.Banner gfilledForm = filledForm.get();
    	if (lstBannerFile.size() >= 1) gfilledForm.setFileList(lstBannerFile);    	
    	gfilledForm.update(id);
		
		flash("success", "El banner " + gfilledForm.getName() + " se ha eliminado");
		return GO_HOME;
		
	}	
	
	@Security.Authenticated(Secured.class)
	public static Result list(int page, String sortBy, String order, String filter) {
        return ok(
            list.render(
            	models.news.Banner.page(page, 10, sortBy, order, filter),
                sortBy, order, filter,false
            )
        );
    }
	
	@Security.Authenticated(Secured.class)
	public static Result sort(String ids) {		
		String[] aids = ids.split(",");
		
		for (int i=0; i<aids.length; i++) {
			models.news.Banner oBanner = models.news.Banner.finder.byId(Long.parseLong(aids[i]));
			oBanner.setSort(i);
			oBanner.save();
		}
		
		return ok("Fine!");		
	}
	
	@Security.Authenticated(Secured.class)
	public static Result lsort() {		 	
	 	return ok(list.render(models.news.Banner.page(0, 0,"sort", "asc", ""),"sort", "asc", "",true));
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
		
		models.news.Banner objBanner = models.news.Banner.finder.byId(id);
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
		models.news.Banner.finder.ref(id).delete();
		flash("success", "El banner se ha eliminado");
	    return GO_HOME;
	    
	}	
	
	@Security.Authenticated(Secured.class)
	public static Result submit() {
		
		
		BannerResolution objResolution= new BannerResolution();
		List<BannerResolution> lstResolution = objResolution.getAllBannerResolutions();
		Form<models.news.Banner> filledForm = BannerForm.bindFromRequest();
		List <models.news.BannerFile>  lstBannerFile =  new ArrayList<models.news.BannerFile>();

		if(filledForm.hasErrors()) {
           return badRequest(form.render(filledForm,lstResolution));         
		} else {
			

			Http.MultipartFormData body = request().body().asMultipartFormData();
            List<Http.MultipartFormData.FilePart> lstPicture = body.getFiles();  
             
        	for (int i = 0; i < lstPicture.size(); i++) {

        		Http.MultipartFormData.FilePart picture = getImage(lstPicture.get(i).getKey());
        		
        		if (picture != null) {
        			
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
                        Utils.printToLog(Banner.class, "", "no se logró subir la imagen " + dest.getAbsolutePath(), false, null, "", Config.LOGGER_ERROR);                        
                        //return badRequest(buildBasicResponse(-3, "no se pudo subir la imagen"));
                        if(useCDN) dest.delete();
                        return badRequest(form.render(filledForm,lstResolution));        
                    }
                    
                    ArrayList<Object> data = new ArrayList<Object>();
                    String urlPrefix = Config.getString("rks-CDN-URL-BANNER");
                    data.add(urlPrefix+sdf.format(today.getTime())+"_"+idFile+".jpeg");
                    Utils.printToLog(Banner.class, "", urlPrefix+sdf.format(today.getTime())+"_"+idFile+".jpeg", false, null, "", Config.LOGGER_INFO);                    
                 
                    BufferedImage bffImage = null;
					try {
						bffImage = ImageIO.read(new File(dest.getAbsolutePath()));
						models.news.BannerFile objBannerFile = new models.news.BannerFile();						
						objBannerFile.setName(file.getName());	        			        		
	        			objBannerFile.setWidth(bffImage.getWidth());
	        			objBannerFile.setHeight(bffImage.getHeight());        			
	        			objBannerFile.setLocation(data.get(0).toString());
	        			lstBannerFile.add(objBannerFile);
	        			if(useCDN) dest.delete();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						//e.printStackTrace();
						RackspaceDelete(null);
						if(useCDN) dest.delete();
						flash("success", "Error publicando el banner " + lstResolution.get(i).getWidth());
						return badRequest(form.render(filledForm,lstResolution));   						 
					}

        		}

        	}

    	   models.news.Banner gfilledForm = filledForm.get();    	   
    	   gfilledForm.setFileList(lstBannerFile);
    	   gfilledForm.setSort(models.news.Banner.finder.findRowCount());
    	   gfilledForm.save();

    	   flash("success", "El Banner " + gfilledForm.getName() + " ha sido creado");
    	   return GO_HOME;  
    	   
		}

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
