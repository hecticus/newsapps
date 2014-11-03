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
import models.content.women.SocialNetwork;
import models.content.women.Woman;
import play.data.Form;
import play.data.format.Formatters;
import play.i18n.Messages;
import play.libs.Json;
import play.mvc.Http;
import play.mvc.Result;

import java.io.File;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;
import java.util.*;

import static play.data.Form.form;

import play.mvc.Security;
import utils.Utils;
import views.html.posts.*;

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
        Form<Post> filledForm = PostViewForm.fill(Post.finder.byId(id));
        return ok(edit.render(id, filledForm));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result update(Integer id) {

        Formatters.register(Language.class, new Formatters.SimpleFormatter<Language>() {
            @Override
            public Language parse(String input, Locale arg1) throws ParseException {
                Language language = Language.finder.byId(new Integer(input));
                return language;
            }

            @Override
            public String print(Language language, Locale arg1) {
                return language.getIdLanguage().toString();
            }
        });

        Formatters.register(Country.class, new Formatters.SimpleFormatter<Country>() {
            @Override
            public Country parse(String input, Locale arg1) throws ParseException {
                Country country = Country.finder.byId(new Integer(input));
                return country;
            }

            @Override
            public String print(Country country, Locale arg1) {
                return country.getIdCountry().toString();
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

        Formatters.register(Woman.class, new Formatters.SimpleFormatter<Woman>() {
            @Override
            public Woman parse(String input, Locale arg1) throws ParseException {
                Woman woman = Woman.finder.byId(new Integer(input));
                return woman;
            }

            @Override
            public String print(Woman woman, Locale arg1) {
                return woman.getIdWoman().toString();
            }
        });

        Formatters.register(FileType.class, new Formatters.SimpleFormatter<FileType>() {
            @Override
            public FileType parse(String input, Locale arg1) throws ParseException {
                FileType fileType = FileType.finder.byId(new Integer(input));
                return fileType;
            }

            @Override
            public String print(FileType fileType, Locale arg1) {
                return fileType.getIdFileType().toString();
            }
        });

        Form<Post> filledForm = PostViewForm.bindFromRequest();

        if(filledForm.hasErrors()) {
            return badRequest(edit.render(id, filledForm));
        }

        int i = 0;
        boolean exists = filledForm.data().containsKey("media[" + i + "].link");
        Http.MultipartFormData body = request().body().asMultipartFormData();
        ObjectNode data = Json.newObject();
        String woman = filledForm.data().get("woman");

        while(exists) {
            if(!filledForm.data().containsKey("media[" + i + "].md5")){
                try {
                    Http.MultipartFormData.FilePart picture = body.getFile("media[" + i + "].link");
                    String fileName = picture.getFilename();
                    String contentType = picture.getContentType();
                    FileType fileType = FileType.finder.where().eq("mimeType", contentType).findUnique();
                    if(fileType == null) {
                        filledForm.reject("Invalid File Type", "For file: " + fileName);
                        return badRequest(edit.render(id, filledForm));
                    } else {
                        System.out.println("Valid " + fileName);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    filledForm.reject("Error uploading file", "For file: " + filledForm.data().containsKey("media[" + i + "].link"));
                    return badRequest(edit.render(id, filledForm));
                }
            }
            ++i;
            exists = filledForm.data().containsKey("media[" + i + "].link");
        }

        i = 0;
        exists = filledForm.data().containsKey("media[" + i + "].link");

        while(exists) {
            if(!filledForm.data().containsKey("media[" + i + "].md5")){
                try {
                    Http.MultipartFormData.FilePart picture = body.getFile("media[" + i + "].link");
                    String fileName = picture.getFilename();
                    String contentType = picture.getContentType();
                    File file = picture.getFile();
                    String fileExtension = fileName.substring(fileName.lastIndexOf(".")-1, fileName.length());
                    String link = Utils.uploadAttachment(file, Integer.parseInt(woman), fileExtension);
                    String md5 = Utils.getMD5(file);
                    ObjectNode dataFile = Json.newObject();
                    dataFile.put("md5", md5);
                    dataFile.put("link", link);
                    dataFile.put("mime_type", contentType);
                    data.put(fileName, dataFile);
                } catch (IOException e) {
                    e.printStackTrace();
                    filledForm.reject("Error uploading file", "For file: " + filledForm.data().containsKey("media[" + i + "].link"));
                    return badRequest(edit.render(id, filledForm));
                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                    filledForm.reject("Error uploading file", "For file: " + filledForm.data().containsKey("media[" + i + "].link"));
                    return badRequest(edit.render(id, filledForm));
                } catch (Exception e) {
                    e.printStackTrace();
                    filledForm.reject("Error uploading file", "For file: " + filledForm.data().containsKey("media[" + i + "].link"));
                    return badRequest(edit.render(id, filledForm));
                }
            }
            ++i;
            exists = filledForm.data().containsKey("media[" + i + "].link");
        }
        Post gfilledForm = filledForm.get();

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
            gfilledForm.setPushDate(push.getTimeInMillis());
        }

        for(PostHasMedia postHasMedia : gfilledForm.getMedia()){
            if(data.has(postHasMedia.getLink())) {
                ObjectNode dataFile = (ObjectNode) data.get(postHasMedia.getLink());
                postHasMedia.setLink(dataFile.get("link").asText());
                postHasMedia.setMd5(dataFile.get("md5").asText());
                FileType fileType = FileType.finder.where().eq("mimeType", dataFile.get("mime_type").asText()).findUnique();
                postHasMedia.setFileType(fileType);
            }
        }

        gfilledForm.setIdPost(id);
        gfilledForm.update(id);
        flash("success", Messages.get("post.java.updated", gfilledForm.getWoman().getName()));
        return GO_HOME;

    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Post oPost = Post.finder.byId(Integer.parseInt(aids[i]));
            oPost.save();
        }

        return ok("Fine!");
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result lsort() {
        return ok(list.render(Post.page(0, 0,"date", "desc", ""),"date", "desc", "",true));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result delete(Integer id) {
        Post post = Post.finder.byId(id);
        ArrayList<String> files = new ArrayList<>();
        for(PostHasMedia postHasMedia : post.getMedia()){
            String link = postHasMedia.getLink();
            link = link.substring(link.lastIndexOf("/")-1);
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
        post.delete();
        flash("success", Messages.get("post.java.deleted", post.getWoman().getName()));
		return GO_HOME;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result submit() throws IOException {

        Formatters.register(Language.class, new Formatters.SimpleFormatter<Language>() {
            @Override
            public Language parse(String input, Locale arg1) throws ParseException {
                Language language = Language.finder.byId(new Integer(input));
                return language;
            }

            @Override
            public String print(Language language, Locale arg1) {
                return language.getIdLanguage().toString();
            }
        });

        Formatters.register(Country.class, new Formatters.SimpleFormatter<Country>() {
            @Override
            public Country parse(String input, Locale arg1) throws ParseException {
                Country country = Country.finder.byId(new Integer(input));
                return country;
            }

            @Override
            public String print(Country country, Locale arg1) {
                return country.getIdCountry().toString();
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

        Formatters.register(Woman.class, new Formatters.SimpleFormatter<Woman>() {
            @Override
            public Woman parse(String input, Locale arg1) throws ParseException {
                Woman woman = Woman.finder.byId(new Integer(input));
                return woman;
            }

            @Override
            public String print(Woman woman, Locale arg1) {
                return woman.getIdWoman().toString();
            }
        });

        Formatters.register(FileType.class, new Formatters.SimpleFormatter<FileType>() {
            @Override
            public FileType parse(String input, Locale arg1) throws ParseException {
                FileType fileType = FileType.finder.byId(new Integer(input));
                System.out.println("fileType.parse" + fileType.getName());
                return fileType;
            }

            @Override
            public String print(FileType fileType, Locale arg1) {
                return fileType.getIdFileType().toString();
            }
        });

        Form<Post> filledForm = PostViewForm.bindFromRequest();

        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        int i = 0;
        boolean exists = filledForm.data().containsKey("media[" + i + "].link");
        Http.MultipartFormData body = request().body().asMultipartFormData();
        ObjectNode data = Json.newObject();
        String woman = filledForm.data().get("woman.idWoman");
        while(exists) {
            if(!filledForm.data().containsKey("media[" + i + "].md5")){
                try {
                    Http.MultipartFormData.FilePart picture = body.getFile("media[" + i + "].link");
                    String fileName = picture.getFilename();
                    String contentType = picture.getContentType();
                    FileType fileType = FileType.finder.where().eq("mimeType", contentType).findUnique();
                    if(fileType == null) {
                        filledForm.reject("Invalid File Type", "For file: " + fileName);
                        return badRequest(form.render(filledForm));
                    } else {
                        System.out.println("Valid " + fileName);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    filledForm.reject("Error uploading file", "For file: " + filledForm.data().get("media[" + i + "].link"));
                    return badRequest(form.render(filledForm));
                }
            }
            ++i;
            exists = filledForm.data().containsKey("media[" + i + "].link");
        }

        i = 0;
        exists = filledForm.data().containsKey("media[" + i + "].link");

        while(exists) {
            if(!filledForm.data().containsKey("media[" + i + "].md5")){
                try {
                    Http.MultipartFormData.FilePart picture = body.getFile("media[" + i + "].link");
                    String fileName = picture.getFilename();
                    String contentType = picture.getContentType();
                    File file = picture.getFile();
                    String fileExtension = fileName.substring(fileName.lastIndexOf("."), fileName.length());

                    String link = Utils.uploadAttachment(file, Integer.parseInt(woman), fileExtension);
                    System.out.println(woman + " " + fileExtension + " " + link);
                    String md5 = Utils.getMD5(file);
                    ObjectNode dataFile = Json.newObject();
                    dataFile.put("md5", md5);
                    dataFile.put("link", link);
                    dataFile.put("mime_type", contentType);
                    data.put(fileName, dataFile);
                } catch (IOException e) {
                    e.printStackTrace();
                    filledForm.reject("Error uploading file", "For file: " + filledForm.data().containsKey("media[" + i + "].link"));
                    return badRequest(form.render(filledForm));
                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                    filledForm.reject("Error uploading file", "For file: " + filledForm.data().containsKey("media[" + i + "].link"));
                    return badRequest(form.render(filledForm));
                } catch (Exception e) {
                    e.printStackTrace();
                    filledForm.reject("Error uploading file", "For file: " + filledForm.data().containsKey("media[" + i + "].link"));
                    return badRequest(form.render(filledForm));
                }
            }
            ++i;
            exists = filledForm.data().containsKey("media[" + i + "].link");
        }


        Post gfilledForm = filledForm.get();

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
            gfilledForm.setPushDate(push.getTimeInMillis());
        }

        for(PostHasMedia postHasMedia : gfilledForm.getMedia()){
            if(data.has(postHasMedia.getLink())) {
                ObjectNode dataFile = (ObjectNode) data.get(postHasMedia.getLink());
                postHasMedia.setLink(dataFile.get("link").asText());
                postHasMedia.setMd5(dataFile.get("md5").asText());
                FileType fileType = FileType.finder.where().eq("mimeType", dataFile.get("mime_type").asText()).findUnique();
                postHasMedia.setFileType(fileType);
            }
        }

        gfilledForm.save();
        flash("success", Messages.get("post.java.created", gfilledForm.getWoman().getName()));
        return GO_HOME;

    }
}
