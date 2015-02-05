package models.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;

import javax.persistence.*;

/**
 * Created by plesse on 2/4/15.
 */
@Entity
@Table(name="post_has_category")
public class PostHasCategory extends HecticusModel {

    @Id
    private Integer idPostHasAthlete;

    @ManyToOne
    @JoinColumn(name = "id_post")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    public static Model.Finder<Integer, PostHasCategory> finder = new Model.Finder<Integer, PostHasCategory>(Integer.class, PostHasCategory.class);

    public PostHasCategory(Post post, Category category) {
        this.post = post;
        this.category = category;
    }

    public Integer getIdPostHasAthlete() {
        return idPostHasAthlete;
    }

    public void setIdPostHasAthlete(Integer idPostHasAthlete) {
        this.idPostHasAthlete = idPostHasAthlete;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }
}
