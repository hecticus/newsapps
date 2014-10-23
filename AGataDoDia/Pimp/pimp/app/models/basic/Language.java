package models.basic;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by plesse on 9/30/14.
 */

@Entity
@Table(name="languages")
public class Language extends HecticusModel {

    @Id
    private Integer idLanguage;
    @Constraints.Required
    private String name;
    @Constraints.Required
    private String shortName;
    @Constraints.Required
    private Integer active;


    public static Model.Finder<Integer, Language> finder = new Model.Finder<Integer, Language>(Integer.class, Language.class);

    public Integer getIdLanguage() {
        return idLanguage;
    }

    public void setIdLanguage(int idLanguage) {
        this.idLanguage = idLanguage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_language", idLanguage);
        response.put("name", name);
        response.put("short_name", shortName);
        response.put("active", active);
        return response;
    }

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        List<Language> languages = finder.where().eq("active", 1).findList();
        for(Language l: languages) {
            options.put(l.getIdLanguage().toString(), l.getName());
        }
        return options;
    }

}
