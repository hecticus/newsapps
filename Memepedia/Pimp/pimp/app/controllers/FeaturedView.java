package controllers;


import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import com.avaje.ebean.Expr;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import models.basic.Config;
import models.content.feature.FeaturedImage;
import models.content.feature.FeaturedImageHasResolution;
import models.content.feature.Resolution;
import play.data.Form;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.Utils;
import views.html.featured.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static play.data.Form.form;

/**
 * Created by plesse on 11/12/14.
 */
public class FeaturedView  extends HecticusController {
    final static Form<FeaturedImage> FeaturedImageViewForm = form(FeaturedImage.class);
    public static Result GO_HOME = redirect(routes.FeaturedView.list(0, "name", "asc", ""));

    @Restrict(@Group(Application.USER_ROLE))
    public static Result index() {
        return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result blank() {
        List<Resolution> all = Resolution.finder.all();
        for(int i = 0; i < all.size(); ++i){
            FeaturedImageViewForm.data().put("images["+ i +"].resolution", all.get(i).getName());
            FeaturedImageViewForm.data().put("images["+ i +"].link", "");
        }
        return ok(form.render(FeaturedImageViewForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(FeaturedImage.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result edit(Integer id) {
        FeaturedImage featuredImage = FeaturedImage.finder.byId(id);
        ArrayList<Integer> existingResolutions = new ArrayList<>();
        for(FeaturedImageHasResolution featuredImageHasResolution : featuredImage.getResolutions()){
            existingResolutions.add(featuredImageHasResolution.getResolution().getIdResolution());
        }
        List<Resolution> list = Resolution.finder.where().not(Expr.in("idResolution", existingResolutions)).findList();
        for(int i = 0; i < list.size(); ++i){
            FeaturedImageHasResolution featuredImageHasResolution = new FeaturedImageHasResolution(featuredImage, list.get(i), null);
            featuredImage.getResolutions().add(featuredImageHasResolution);
        }
        Form<FeaturedImage> filledForm = FeaturedImageViewForm.fill(featuredImage);
        return ok(edit.render(id, filledForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result update(Integer id) {
        Form<FeaturedImage> filledForm = FeaturedImageViewForm.bindFromRequest();
        System.out.println(filledForm.toString());
        if(filledForm.hasErrors()) {
            System.out.println(filledForm.toString());
            return badRequest(edit.render(id, filledForm));
        }
        FeaturedImage featuredImage = filledForm.get();
        Http.MultipartFormData body = request().body().asMultipartFormData();
        List<FeaturedImageHasResolution> resolutions = featuredImage.getResolutions();
        for(int i = 0; i < resolutions.size(); ++i){
            String link = resolutions.get(i).getLink();
            if(!link.startsWith("http://")){
                Resolution resolution = Resolution.finder.byId(resolutions.get(i).getResolution().getIdResolution());
                try{
                    Http.MultipartFormData.FilePart picture = body.getFile("resolutions[" + i + "].link");
                    File file = picture.getFile();
                    BufferedImage bimg = ImageIO.read(file);
                    if(bimg.getWidth() == resolution.getWidth() && bimg.getHeight() == resolution.getHeight()){
                        String fileName = picture.getFilename();
                        String fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length());
                        resolutions.get(i).file = file;
                        resolutions.get(i).extension = fileExtension;
                        resolutions.get(i).setResolution(resolution);
                    } else {
                        filledForm.reject("Bad Resolution", "For resolution: " + resolution.getName());
                    }
                } catch (IOException e){
                    filledForm.reject("Missing file", "For resolution: " + resolution.getName());
                }
            } else {
                resolutions.get(i).file = null;
            }
        }

        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        for(int i = 0; i < resolutions.size(); i++){
            try {
                if(resolutions.get(i).file != null){
                    String link = Utils.uploadAttachment(resolutions.get(i).file, id, resolutions.get(i).extension, false);
                    resolutions.get(i).setLink(link);
                }
            } catch (IOException e){
                filledForm.reject("Missing file", "For resolution: " + resolutions.get(i).getResolution().getName());
            }
        }


        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        featuredImage.update(id);
        flash("success", Messages.get("featured.java.updated", featuredImage.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            FeaturedImage oPost = FeaturedImage.finder.byId(Integer.parseInt(aids[i]));
            //oWoman.setSort(i);
            oPost.save();
        }

        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(FeaturedImage.page(0, 0,"name", "asc", ""),"date", "asc", "",true));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result delete(Integer id) {
        FeaturedImage featuredImage = FeaturedImage.finder.byId(id);
        ArrayList<String> files = new ArrayList<>();
        for(FeaturedImageHasResolution featuredImageHasResolution : featuredImage.getResolutions()){
            String link = featuredImageHasResolution.getLink();
            link = link.substring(link.lastIndexOf("featured/"));
            System.out.println(link);
            files.add(link);
        }
        if(!files.isEmpty()){
            String containerName = Config.getString("cdn-container");
            String username = Config.getString("rackspace-username");
            String apiKey = Config.getString("rackspace-apiKey");
            String provider = Config.getString("rackspace-provider");
            RackspaceDelete rackspaceDelete = new RackspaceDelete(username, apiKey, provider);
            rackspaceDelete.deleteObjectsFromContainer(containerName, files);
        }

        featuredImage.delete();
        flash("success", Messages.get("featured.java.deleted", featuredImage.getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result submit() {
        Form<FeaturedImage> filledForm = FeaturedImageViewForm.bindFromRequest();


        Map<String, String> data = filledForm.data();

        Http.MultipartFormData body = request().body().asMultipartFormData();
        ArrayList<FeaturedImageHasResolution> resolutions = new ArrayList<>();
        List<Resolution> all = Resolution.finder.all();
        System.out.println(body.toString());
        for(int i = 0; i < all.size(); ++i){
            if(data.containsKey("images["+ i +"].resolution") && data.containsKey("images["+ i +"].link")){
                String link = data.get("images[" + i + "].link");
                if(link != null && !link.isEmpty()){
                    try {
                        Http.MultipartFormData.FilePart picture = body.getFile("images[" + i + "].link");
                        File file = picture.getFile();
                        BufferedImage bimg = ImageIO.read(file);
                        if (bimg.getWidth() == all.get(i).getWidth() && bimg.getHeight() == all.get(i).getHeight()) {
                            String fileName = picture.getFilename();
                            String fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length());
                            resolutions.add(new FeaturedImageHasResolution(all.get(i), file, fileExtension));
                        } else {
                            filledForm.reject("Bad Resolution", "For resolution: " + all.get(i).getName());
                        }
                    } catch (IOException e){
                        filledForm.reject("Missing file", "For resolution: " + all.get(i).getName());
                    }
                } else {
                    filledForm.reject("Missing file", "For resolution: " + all.get(i).getName());
                }
            } else {
                filledForm.reject("Missing resolution", "For resolution: " + all.get(i).getName());
            }
        }


        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        FeaturedImage gfilledForm = filledForm.get();
        gfilledForm.save();
        for(int i = 0; i < resolutions.size(); i++){
            try {
                resolutions.get(i).setFeaturedImage(gfilledForm);
                String link = Utils.uploadAttachment(resolutions.get(i).file, gfilledForm.getIdFeaturedImages(), resolutions.get(i).extension, false);
                resolutions.get(i).setLink(link);
            } catch (IOException e){
                filledForm.reject("Missing file", "For resolution: " + resolutions.get(i).getResolution().getName());
            }
        }
        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        gfilledForm.setResolutions(resolutions);
        gfilledForm.update();
        flash("success", Messages.get("featured.java.created", gfilledForm.getName()));
        return GO_HOME;

    }
}
