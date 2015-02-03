package models.content.athletes;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="athlete_has_sports")
public class AthleteHasSport extends HecticusModel {

    @Id
    private Integer idAthleteHasCategory;

    @ManyToOne
    @JoinColumn(name = "id_sport")
    private Sport sport;

    @ManyToOne
    @JoinColumn(name = "id_athlete")
    private Athlete athlete;

    public static Model.Finder<Integer, AthleteHasSport> finder = new Model.Finder<Integer, AthleteHasSport>(Integer.class, AthleteHasSport.class);

    public AthleteHasSport(Sport category, Athlete theme) {
        this.sport = category;
        this.athlete = theme;
    }

    public Integer getIdAthleteHasCategory() {
        return idAthleteHasCategory;
    }

    public void setIdAthleteHasCategory(Integer idAthleteHasCategory) {
        this.idAthleteHasCategory = idAthleteHasCategory;
    }

    public void setSport(Sport sport) {
        this.sport = sport;
    }

    public void setAthlete(Athlete athlete) {
        this.athlete = athlete;
    }

    public Sport getSport() {
        return sport;
    }

    public Athlete getAthlete() {
        return athlete;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_athlete_has_sport", idAthleteHasCategory);
        response.put("sport", sport.toJsonWithoutRelations());
        response.put("athlete", athlete.toJsonWithoutRelations());
        return response;
    }

    public ObjectNode toJsonWithoutCategory() {
        ObjectNode response = Json.newObject();
        response.put("id_athlete_has_sport", idAthleteHasCategory);
        response.put("athlete", athlete.toJsonWithoutRelations());
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_athlete_has_category", idAthleteHasCategory);
        response.put("sport", sport.toJsonWithoutRelations());
        return response;
    }
}
