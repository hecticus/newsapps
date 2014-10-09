package models.basic;

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
@Table(name="countries")
public class Country extends HecticusModel {

    @Id
    private Integer idCountry;
    @Constraints.Required
    private String name;
    @Constraints.Required
    private String shortName;
    @Constraints.Required
    private Integer active;

    @OneToOne
    @JoinColumn(name = "id_language")
    private Language language;

    public static Model.Finder<Integer, Country> finder = new Model.Finder<Integer, Country>(Integer.class, Country.class);

    public Integer getIdCountry() {
        return idCountry;
    }

    public void setIdCountry(int idCountry) {
        this.idCountry = idCountry;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_country", idCountry);
        response.put("name", name);
        response.put("short_name", shortName);
        response.put("active", active);
        response.put("language", language.toJson());
        return response;
    }
}
