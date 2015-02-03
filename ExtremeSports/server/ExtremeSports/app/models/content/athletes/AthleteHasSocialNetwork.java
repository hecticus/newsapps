package models.content.athletes;

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
@Table(name="athlete_has_social_network")
public class AthleteHasSocialNetwork extends HecticusModel {

    @Id
    private Integer idAthleteHasSocialNetwork;

    @ManyToOne
    @JoinColumn(name = "id_theme")
    private Athlete athlete;

    @ManyToOne
    @JoinColumn(name = "id_social_network")
    private SocialNetwork socialNetwork;

    @Constraints.Required
    private String link;

    public static Model.Finder<Integer, AthleteHasSocialNetwork> finder = new Model.Finder<Integer, AthleteHasSocialNetwork>(Integer.class, AthleteHasSocialNetwork.class);

    public AthleteHasSocialNetwork(Athlete theme, SocialNetwork socialNetwork, String link) {
        this.athlete = theme;
        this.socialNetwork = socialNetwork;
        this.link = link;
    }

    public Integer getIdAthleteHasSocialNetwork() {
        return idAthleteHasSocialNetwork;
    }

    public void setIdAthleteHasSocialNetwork(Integer idAthleteHasSocialNetwork) {
        this.idAthleteHasSocialNetwork = idAthleteHasSocialNetwork;
    }

    public Athlete getAthlete() {
        return athlete;
    }

    public void setAthlete(Athlete athlete) {
        this.athlete = athlete;
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
        response.put("id_athlete_has_social_network", idAthleteHasSocialNetwork);
        response.put("athlete", athlete.toJsonWithoutRelations());
        response.put("social_network", socialNetwork.toJson());
        response.put("link", link);
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_athlete_has_social_network", idAthleteHasSocialNetwork);
        response.put("social_network", socialNetwork.toJson());
        response.put("link", link);
        return response;
    }

    public ObjectNode toJsonWithoutSocialNetwork() {
        ObjectNode response = Json.newObject();
        response.put("id_athlete_has_social_network", idAthleteHasSocialNetwork);
        response.put("athlete", athlete.toJsonWithoutRelations());
        response.put("link", link);
        return response;
    }
}
