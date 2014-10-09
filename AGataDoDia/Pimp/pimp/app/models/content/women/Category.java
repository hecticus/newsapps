package models.content.women;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.ClientHasWoman;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="categories")
public class Category extends HecticusModel {

    @Id
    private Integer idCategory;
    @Constraints.Required
    private String name;

    @OneToMany(mappedBy="category", cascade = CascadeType.ALL)
    private List<WomanHasCategory> women;

    public static Model.Finder<Integer, Category> finder = new Model.Finder<Integer, Category>(Integer.class, Category.class);

    public Category(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<WomanHasCategory> getWomen() {
        return women;
    }

    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_category", idCategory);
        response.put("name", name);
        if(women != null && !women.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(WomanHasCategory ad : women){
                apps.add(ad.toJsonWithoutCategory());
            }
            response.put("clients", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_category", idCategory);
        response.put("name", name);
        return response;
    }

}
