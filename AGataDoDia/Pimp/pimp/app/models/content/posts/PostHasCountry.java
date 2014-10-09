package models.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.basic.Country;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="post_has_countries")
public class PostHasCountry extends HecticusModel{

    @Id
    private Integer idPostHasCountry;

    @ManyToOne
    @JoinColumn(name = "id_post")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "id_country")
    private Country country;

    public static Model.Finder<Integer, PostHasCountry> finder = new Model.Finder<Integer, PostHasCountry>(Integer.class, PostHasCountry.class);

    public PostHasCountry(Post post, Country country) {
        this.post = post;
        this.country = country;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_country", idPostHasCountry);
        response.put("post", post.toJsonWithoutRelations());
        response.put("country", country.toJson());
        return response;
    }

    public ObjectNode toJsonWithoutPost() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_country", idPostHasCountry);
        response.put("country", country.toJson());
        return response;
    }
}
