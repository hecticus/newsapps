package models.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.basic.Language;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 2/6/15.
 */
@Entity
@Table(name="category_has_localizations")
public class CategoryHasLocalization extends HecticusModel {

    @Id
    private Integer idCategoryHasLocalization;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "id_language")
    private Language language;

    @Constraints.Required
    private String name;

    public static Model.Finder<Integer, CategoryHasLocalization> finder = new Model.Finder<Integer, CategoryHasLocalization>(Integer.class, CategoryHasLocalization.class);


    public CategoryHasLocalization(Category category, Language language, String name) {
        this.category = category;
        this.language = language;
        this.name = name;
    }

    public Integer getIdCategoryHasLocalization() {
        return idCategoryHasLocalization;
    }

    public void setIdCategoryHasLocalization(Integer idCategoryHasLocalization) {
        this.idCategoryHasLocalization = idCategoryHasLocalization;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("name", name);
        response.put("language", language.toJson());
        return response;
    }
}
