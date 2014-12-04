package models.content.themes;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="theme_has_categories")
public class ThemeHasCategory extends HecticusModel {

    @Id
    private Integer idThemeHasCategory;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "id_theme")
    private Theme theme;

    public static Model.Finder<Integer, ThemeHasCategory> finder = new Model.Finder<Integer, ThemeHasCategory>(Integer.class, ThemeHasCategory.class);

    public ThemeHasCategory(Category category, Theme theme) {
        this.category = category;
        this.theme = theme;
    }

    public Integer getIdThemeHasCategory() {
        return idThemeHasCategory;
    }

    public void setIdThemeHasCategory(Integer idThemeHasCategory) {
        this.idThemeHasCategory = idThemeHasCategory;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    public Category getCategory() {
        return category;
    }

    public Theme getTheme() {
        return theme;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_theme_has_category", idThemeHasCategory);
        response.put("category", category.toJsonWithoutRelations());
        response.put("theme", theme.toJsonWithoutRelations());
        return response;
    }

    public ObjectNode toJsonWithoutCategory() {
        ObjectNode response = Json.newObject();
        response.put("id_theme_has_category", idThemeHasCategory);
        response.put("theme", theme.toJsonWithoutRelations());
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_theme_has_category", idThemeHasCategory);
        response.put("category", category.toJsonWithoutRelations());
        return response;
    }
}
