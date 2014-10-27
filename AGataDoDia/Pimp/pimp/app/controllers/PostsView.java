package controllers;

import models.basic.Country;
import models.basic.Language;
import models.content.posts.FileType;
import models.content.posts.Post;
import models.content.posts.PostHasMedia;
import models.content.women.SocialNetwork;
import models.content.women.Woman;
import play.data.Form;
import play.data.format.Formatters;
import play.mvc.Result;

import java.io.IOException;
import java.text.ParseException;
import java.util.Locale;

import static play.data.Form.form;

import views.html.posts.*;

/**
 * Created by plesse on 10/23/14.
 */
public class PostsView extends HecticusController {

    private static final int TTL = 900;

    final static Form<Post> PostViewForm = form(Post.class);
    public static Result GO_HOME = redirect(routes.PostsView.list(0, "date", "asc", ""));

    //@Security.Authenticated(Secured.class)
    public static Result index() {
        return GO_HOME;
    }

    //@Security.Authenticated(Secured.class)
    public static Result blank() {
        return ok(form.render(PostViewForm));
    }

    //@Security.Authenticated(Secured.class)
    public static Result list(int page, String sortBy, String order, String filter) {
        return ok(list.render(Post.page(page, 10, sortBy, order, filter), sortBy, order, filter, false));
    }

    //@Security.Authenticated(Secured.class)
    public static Result edit(Integer id) {
        Post objBanner = Post.finder.byId(id);
        Form<Post> filledForm = PostViewForm.fill(Post.finder.byId(id));
//        System.out.println(filledForm.value().get().toJson().toString());
        return ok(edit.render(id, filledForm));
    }

    //@Security.Authenticated(Secured.class)
    public static Result update(Integer id) {

        final Post post = Post.finder.byId(id);

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

//        Formatters.register(PostHasMedia.class, new Formatters.SimpleFormatter<PostHasMedia>() {
//            @Override
//            public PostHasMedia parse(String input, Locale arg1) throws ParseException {
//                System.out.println(input);
//                FileType fileType = FileType.finder.byId(1);
//                PostHasMedia postHasMedia = new PostHasMedia(post, fileType, "jfhgskjdfhglkjs", "link-"+input, 0);
//                return postHasMedia;
//            }
//
//            @Override
//            public String print(PostHasMedia postHasMedia, Locale arg1) {
//                return postHasMedia.getIdPostHasMedia().toString();
//            }
//        });

        Form<Post> filledForm = PostViewForm.bindFromRequest();
        System.out.println(filledForm.toString());
        System.out.println("-------------------------------------------");

        if(filledForm.hasErrors()) {
            return badRequest(edit.render(id, filledForm));
        }

        Post gfilledForm = filledForm.get();

        for(PostHasMedia postHasMedia : gfilledForm.getMedia()){
            System.out.println(postHasMedia.getLink());
        }


        gfilledForm.setIdPost(id);
        gfilledForm.update(id);

//        System.out.println("update " + gfilledForm.toJson().toString());

        flash("success", "El post " + gfilledForm.getWoman().getName() + " se ha actualizado");
        return GO_HOME;

    }

    //@Security.Authenticated(Secured.class)
    public static Result sort(String ids) {
        String[] aids = ids.split(",");

        for (int i=0; i<aids.length; i++) {
            Post oPost = Post.finder.byId(Integer.parseInt(aids[i]));
            //oWoman.setSort(i);
            oPost.save();
        }

        return ok("Fine!");
    }

    //@Security.Authenticated(Secured.class)
    public static Result lsort() {
        return ok(list.render(Post.page(0, 0,"date", "asc", ""),"date", "asc", "",true));
    }

    //@Security.Authenticated(Secured.class)
    public static Result delete(Integer id) {

		/*models.content.women.Woman objBanner = models.content.women.Woman.finder.byId(id);

		models.content.women.Woman.finder.ref(id).delete();
		flash("success", "La mujer se ha eliminado");*/
        return GO_HOME;

    }

    //@Security.Authenticated(Secured.class)
    public static Result submit() throws IOException {

        Formatters.register(Language.class, new Formatters.SimpleFormatter<Language>() {
            @Override
            public Language parse(String input, Locale arg1) throws ParseException {
                Language language = Language.finder.byId(new Integer(input));
                System.out.println("language.parse" + language.getName());
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
                System.out.println("country.parse" + country.getName());
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
                System.out.println("socialNetwork.parse" + socialNetwork.getName());
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
                System.out.println("woman.parse" + woman.getName());
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
        System.out.println(filledForm.value());
        if(filledForm.hasErrors()) {
            System.out.println(filledForm.toString());
            return badRequest(form.render(filledForm));
        }

        Post gfilledForm = filledForm.get();
        //gfilledForm.setSort(models.content.women.Woman.finder.findRowCount());
        gfilledForm.save();

        flash("success", "El Banner " + gfilledForm.getWoman().getName() + " ha sido creado");
        return GO_HOME;

    }
}
