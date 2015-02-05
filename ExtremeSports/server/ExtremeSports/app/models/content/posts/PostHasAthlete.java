package models.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.content.athletes.Athlete;
import play.db.ebean.Model;

import javax.persistence.*;

/**
 * Created by plesse on 2/4/15.
 */
@Entity
@Table(name="post_has_athlete")
public class PostHasAthlete extends HecticusModel {

    @Id
    private Integer idPostHasAthlete;

    @ManyToOne
    @JoinColumn(name = "id_post")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "id_athlete")
    private Athlete athlete;

    public static Model.Finder<Integer, PostHasAthlete> finder = new Model.Finder<Integer, PostHasAthlete>(Integer.class, PostHasAthlete.class);

    public PostHasAthlete(Post post, Athlete country) {
        this.post = post;
        this.athlete = country;
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

    public Athlete getAthlete() {
        return athlete;
    }

    public void setAthlete(Athlete athlete) {
        this.athlete = athlete;
    }



    @Override
    public ObjectNode toJson() {
        return null;
    }
}
