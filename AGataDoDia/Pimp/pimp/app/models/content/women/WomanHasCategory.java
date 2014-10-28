package models.content.women;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="woman_has_categories")
public class WomanHasCategory extends HecticusModel {

    @Id
    private Integer idWomanHasCategory;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "id_woman")
    private Woman woman;

    public static Model.Finder<Integer, WomanHasCategory> finder = new Model.Finder<Integer, WomanHasCategory>(Integer.class, WomanHasCategory.class);

    public WomanHasCategory(Category category, Woman woman) {
        this.category = category;
        this.woman = woman;
    }

    public Integer getIdWomanHasCategory() {
        return idWomanHasCategory;
    }

    public void setIdWomanHasCategory(Integer idWomanHasCategory) {
        this.idWomanHasCategory = idWomanHasCategory;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setWoman(Woman woman) {
        this.woman = woman;
    }

    public Category getCategory() {
        return category;
    }

    public Woman getWoman() {
        return woman;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_woman_has_category", idWomanHasCategory);
        response.put("category", category.toJsonWithoutRelations());
        response.put("woman", woman.toJsonWithoutRelations());
        return response;
    }

    public ObjectNode toJsonWithoutCategory() {
        ObjectNode response = Json.newObject();
        response.put("id_woman_has_category", idWomanHasCategory);
        response.put("woman", woman.toJsonWithoutRelations());
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_woman_has_category", idWomanHasCategory);
        response.put("category", category.toJsonWithoutRelations());
        return response;
    }
}
