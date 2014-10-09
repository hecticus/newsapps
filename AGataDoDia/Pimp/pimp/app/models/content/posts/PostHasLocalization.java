package models.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.basic.Country;
import models.basic.Language;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="post_has_localizations")
public class PostHasLocalization extends HecticusModel {

    @Id
    private Integer idPostHasLocalization;

    @ManyToOne
    @JoinColumn(name = "id_post")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "id_language")
    private Language language;

    @Constraints.Required
    private String title;

    @Constraints.Required
    private String content;

    public static Model.Finder<Integer, PostHasLocalization> finder = new Model.Finder<Integer, PostHasLocalization>(Integer.class, PostHasLocalization.class);

    public PostHasLocalization(Post post, Language language, String title, String content) {
        this.post = post;
        this.language = language;
        this.title = title;
        this.content = content;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_localization", idPostHasLocalization);
        response.put("post", post.toJsonWithoutRelations());
        response.put("language", language.toJson());
        response.put("title", title);
        response.put("content", content);
        return response;
    }

    public ObjectNode toJsonWithoutPost() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_localization", idPostHasLocalization);
        response.put("language", language.toJson());
        response.put("title", title);
        response.put("content", content);
        return response;
    }
}
