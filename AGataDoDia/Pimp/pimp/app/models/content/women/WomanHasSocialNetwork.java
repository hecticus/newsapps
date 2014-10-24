package models.content.women;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="woman_has_social_network")
public class WomanHasSocialNetwork extends HecticusModel {

    @Id
    private Integer idWomanHasSocialNetwork;

    @ManyToOne
    @JoinColumn(name = "id_woman")
    private Woman woman;

    @ManyToOne
    @JoinColumn(name = "id_social_network")
    private SocialNetwork socialNetwork;

    @Constraints.Required
    private String link;

    public static Model.Finder<Integer, WomanHasSocialNetwork> finder = new Model.Finder<Integer, WomanHasSocialNetwork>(Integer.class, WomanHasSocialNetwork.class);

    public WomanHasSocialNetwork(Woman woman, SocialNetwork socialNetwork, String link) {
        this.woman = woman;
        this.socialNetwork = socialNetwork;
        this.link = link;
    }

    public Woman getWoman() {
        return woman;
    }

    public void setWoman(Woman woman) {
        this.woman = woman;
    }

    public SocialNetwork getSocialNetwork() {
        return socialNetwork;
    }

    public void setSocialNetwork(SocialNetwork socialNetwork) {
        this.socialNetwork = socialNetwork;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_woman_has_social_network", idWomanHasSocialNetwork);
        response.put("woman", woman.toJsonWithoutRelations());
        response.put("social_network", socialNetwork.toJson());
        response.put("link", link);
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_woman_has_social_network", idWomanHasSocialNetwork);
        response.put("social_network", socialNetwork.toJson());
        response.put("link", link);
        return response;
    }

    public ObjectNode toJsonWithoutSocialNetwork() {
        ObjectNode response = Json.newObject();
        response.put("id_woman_has_social_network", idWomanHasSocialNetwork);
        response.put("woman", woman.toJsonWithoutRelations());
        response.put("link", link);
        return response;
    }
}
