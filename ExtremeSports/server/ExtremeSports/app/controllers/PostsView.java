package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceDelete;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.content.posts.FileType;
import models.content.posts.Post;
import models.content.posts.PostHasMedia;
import models.content.athletes.SocialNetwork;
import models.content.athletes.Athlete;
import play.data.Form;
import play.data.format.Formatters;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;
import utils.Utils;
import views.html.posts.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.*;

import static play.data.Form.form;

/**
 * Created by plesse on 10/23/14.
 */
public class PostsView extends HecticusController {

    private static final int TTL = 900;

    final static Form<Post> PostViewForm = form(Post.class);
    public static Result GO_HOME = redirect(routes.PostsView.list(0, "date", "desc", ""));

    @Restrict(@Group(Application.USER_ROLE))
    public static Result index() {
        return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result blank() {
        return ok(form.render(PostViewForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Post.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result edit(Integer id) {
        Form<Post> filledForm = PostViewForm.fill(Post.getByID(id));
        return ok(edit.render(id, filledForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result update(Integer id) {
        Form<Post> filledForm = PostViewForm.bindFromRequest();
        System.out.println(filledForm.toString());
        if(filledForm.hasErrors()) {
            return badRequest(edit.render(id, filledForm));
        }
        Post post = filledForm.get();
        post.setIdPost(id);
        if(post.getMedia() != null && !post.getMedia().isEmpty()){
            Http.MultipartFormData body = getMultiformData();
            int i = 0;
            try {
                for (PostHasMedia postHasMedia : post.getMedia()) {
                    if(postHasMedia.getMd5() == null) {
                        Http.MultipartFormData.FilePart picture = body.getFile("media[" + i + "].link");
                        String fileName = picture.getFilename();
                        String contentType = picture.getContentType();
                        File file = picture.getFile();
                        String fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length());
                        FileType fileType = FileType.getByMimeType(contentType);
                        if (fileType != null) {
                            if (fileType.getName().equalsIgnoreCase("video")) {
                                ObjectNode wistiaResponse = Wistia.uploadVideo(file, fileName);
                                if (wistiaResponse != null) {
                                    String hashedId = wistiaResponse.get("hashed_id").asText();
                                    postHasMedia.setWistiaId(hashedId);
                                    postHasMedia.setLink(wistiaResponse.get("thumbnail").get("url").asText());
                                    String status = wistiaResponse.get("status").asText();
                                    if (status.equalsIgnoreCase("ready")) {
                                        ObjectNode videoInfo = Wistia.getVideo(hashedId);
                                        postHasMedia.setWistiaPlayer(videoInfo.get("embedCode").asText());
                                    }
                                } else {
                                    //TODO: ver que hacer con el error
                                }
                            } else {
                                postHasMedia.setLink(Utils.uploadAttachment(file, post.getIdPost(), fileExtension, 3));
                                BufferedImage bimg = ImageIO.read(file);
                                postHasMedia.setHeight(bimg.getHeight());
                                postHasMedia.setWidth(bimg.getWidth());
                            }
                            String md5 = Utils.getMD5(file);
                            postHasMedia.setMd5(md5);
                            postHasMedia.setFileType(fileType);
                        } else {
                            filledForm.reject("Invalid File Type", "For file: " + fileName);
                            return badRequest(edit.render(post.getIdPost(), filledForm));
                        }
                    }
                    ++i;
                }
            } catch (Exception e) {
                e.printStackTrace();
                filledForm.reject("Error uploading file", "For file: ");
                return badRequest(edit.render(post.getIdPost(), filledForm));
            }
        }
        String epochThis = filledForm.data().get("epochThis");
        if(epochThis != null && !epochThis.isEmpty()) {
            TimeZone tz = TimeZone.getDefault();
            Calendar push = new GregorianCalendar(tz);
            int year = Integer.parseInt(epochThis.substring(0, 4));
            int month = Integer.parseInt(epochThis.substring(4, 6), 10) - 1;
            int date = Integer.parseInt(epochThis.substring(6, 8), 10);
            int hourOfDay = Integer.parseInt(epochThis.substring(8, 10), 10);
            int minute = Integer.parseInt(epochThis.substring(10), 10);
            push.set(year, month, date, hourOfDay, minute);
            post.setPushDate(push.getTimeInMillis());
        }
        post.update();
        flash("success", Messages.get("post.java.updated", post.getIdPost()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Post oPost = Post.getByID(Integer.parseInt(aids[i]));
            oPost.save();
        }

        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(Post.page(0, 0, "date", "desc", ""),"date", "desc", "",true));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result delete(Integer id) {
        Post post = Post.getByID(id);
        ArrayList<String> files = new ArrayList<>();
        for(PostHasMedia postHasMedia : post.getMedia()){
            if(postHasMedia.getFileType().getName().equalsIgnoreCase("video")){
                Wistia.deleteVideo(postHasMedia.getWistiaId());
            } else {
                String link = postHasMedia.getLink();
                link = link.substring(link.lastIndexOf("/")-1);
                files.add(link);
            }
        }
        if(!files.isEmpty()){
            String containerName = Config.getString("cdn-container");
            String username = Config.getString("rackspace-username");
            String apiKey = Config.getString("rackspace-apiKey");
            String provider = Config.getString("rackspace-provider");
            RackspaceDelete rackspaceDelete = new RackspaceDelete(username, apiKey, provider);
            rackspaceDelete.deleteObjectsFromContainer(containerName, files);
        }
        post.delete();
        flash("success", Messages.get("post.java.deleted", post.getIdPost()));
		return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result submit() throws IOException {
        Form<Post> filledForm = PostViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }
        Post post = filledForm.get();
        String epochThis = filledForm.data().get("epochThis");
        if(epochThis != null && !epochThis.isEmpty()) {
            TimeZone tz = TimeZone.getDefault();
            Calendar push = new GregorianCalendar(tz);
            int year = Integer.parseInt(epochThis.substring(0, 4));
            int month = Integer.parseInt(epochThis.substring(4, 6), 10) - 1;
            int date = Integer.parseInt(epochThis.substring(6, 8), 10);
            int hourOfDay = Integer.parseInt(epochThis.substring(8, 10), 10);
            int minute = Integer.parseInt(epochThis.substring(10), 10);
            push.set(year, month, date, hourOfDay, minute);
            post.setPushDate(push.getTimeInMillis());
        }

        post.save();

        if(post.getMedia() != null && !post.getMedia().isEmpty()){
            Http.MultipartFormData body = getMultiformData();
            int i = 0;
            try {
                for (PostHasMedia postHasMedia : post.getMedia()) {
                    Http.MultipartFormData.FilePart picture = body.getFile("media[" + i + "].link");
                    String fileName = picture.getFilename();
                    String contentType = picture.getContentType();
                    File file = picture.getFile();
                    String fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length());
                    FileType fileType = FileType.getByMimeType(contentType);
                    if (fileType != null) {
                        if (fileType.getName().equalsIgnoreCase("video")) {
                            ObjectNode wistiaResponse = Wistia.uploadVideo(file, fileName);
                            if (wistiaResponse != null) {
                                String hashedId = wistiaResponse.get("hashed_id").asText();
                                postHasMedia.setWistiaId(hashedId);
                                postHasMedia.setLink(wistiaResponse.get("thumbnail").get("url").asText());
                                String status = wistiaResponse.get("status").asText();
                                if (status.equalsIgnoreCase("ready")) {
                                    ObjectNode videoInfo = Wistia.getVideo(hashedId);
                                    postHasMedia.setWistiaPlayer(videoInfo.get("embedCode").asText());
                                }
                            } else {
                                //TODO: ver que hacer con el error
                            }
                        } else {
                            postHasMedia.setLink(Utils.uploadAttachment(file, post.getIdPost(), fileExtension, 3));
                            BufferedImage bimg = ImageIO.read(file);
                            postHasMedia.setHeight(bimg.getHeight());
                            postHasMedia.setWidth(bimg.getWidth());
                        }
                        String md5 = Utils.getMD5(file);
                        postHasMedia.setMd5(md5);
                        postHasMedia.setFileType(fileType);
                        ++i;
                    } else {
                        filledForm.reject("Invalid File Type", "For file: " + fileName);
                        return badRequest(form.render(filledForm));
                    }
                }
                post.update();
            } catch (Exception e) {
                e.printStackTrace();
                filledForm.reject("Error uploading file", "For file: " + filledForm.data().get("media[" + i + "].link"));
                return badRequest(edit.render(post.getIdPost(), filledForm));
            }
        }
        flash("success", Messages.get("post.java.created", post.getIdPost()));
        return GO_HOME;
    }

}
