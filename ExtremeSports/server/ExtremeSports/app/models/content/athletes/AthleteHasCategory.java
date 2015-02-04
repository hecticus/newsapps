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
@Table(name="athlete_has_categories")
public class AthleteHasCategory extends HecticusModel {

    @Id
    private Integer idAthleteHasCategory;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "id_athlete")
    private Athlete athlete;

    public static Model.Finder<Integer, AthleteHasCategory> finder = new Model.Finder<Integer, AthleteHasCategory>(Integer.class, AthleteHasCategory.class);

    public AthleteHasCategory(Category category, Athlete theme) {
        this.category = category;
        this.athlete = theme;
    }

    public Integer getIdAthleteHasCategory() {
        return idAthleteHasCategory;
    }

    public void setIdAthleteHasCategory(Integer idAthleteHasCategory) {
        this.idAthleteHasCategory = idAthleteHasCategory;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setAthlete(Athlete athlete) {
        this.athlete = athlete;
    }

    public Category getCategory() {
        return category;
    }

    public Athlete getAthlete() {
        return athlete;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_athlete_has_category", idAthleteHasCategory);
        response.put("category", category.toJsonWithoutRelations());
        response.put("athlete", athlete.toJsonWithoutRelations());
        return response;
    }

    public ObjectNode toJsonWithoutCategory() {
        ObjectNode response = Json.newObject();
        response.put("id_athlete_has_category", idAthleteHasCategory);
        response.put("athlete", athlete.toJsonWithoutRelations());
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_athlete_has_category", idAthleteHasCategory);
        response.put("category", category.toJsonWithoutRelations());
        return response;
    }
}
