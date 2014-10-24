package controllers;

import models.content.posts.Post;
import models.content.women.Woman;
import play.data.Form;
import play.mvc.Result;

import java.io.IOException;

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

        Post objBanner = Post.finder.byId(id);

        Form<Post> filledForm = PostViewForm.bindFromRequest();
        if(filledForm.hasErrors()) {
            System.out.println(filledForm.toString());
            return badRequest(edit.render(id, filledForm));
            //return badRequest();
        }

        Post gfilledForm = filledForm.get();
//        gfilledForm.update(id);

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

        Form<Post> filledForm = PostViewForm.bindFromRequest();

        if(filledForm.hasErrors()) {
            return badRequest(form.render(filledForm));
        }

        Post gfilledForm = filledForm.get();
        //gfilledForm.setSort(models.content.women.Woman.finder.findRowCount());
        gfilledForm.save();

        flash("success", "El Banner " + gfilledForm.getWoman().getName() + " ha sido creado");
        return GO_HOME;

    }
}
