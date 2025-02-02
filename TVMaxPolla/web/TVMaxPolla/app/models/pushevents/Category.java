package models.pushevents;

/**
 * Created by plesse on 5/27/14.
 */

import com.avaje.ebean.Expr;
import models.HecticusModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="category")
public class Category extends HecticusModel {

    @Id
    private Long idCategory;
    @Constraints.Required
    private String name;
    @Constraints.Required
    private String idTeam;

    @OneToMany(mappedBy = "category")
    private List<CategoryClient> clients;


    public static Model.Finder<Long, Category> finder = new
            Model.Finder<Long, Category>(Long.class, Category.class);


    public Long getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Long idCategory) {
        this.idCategory = idCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIdTeam() {
        return idTeam;
    }

    public void setIdTeam(String idTeam) {
        this.idTeam = idTeam;
    }

    public List<CategoryClient> getClients() {
        return clients;
    }

    public void setClients(List<CategoryClient> clients) {
        this.clients = clients;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode responseNode = Json.newObject();
        responseNode.put("id_category", idCategory);
        responseNode.put("name", name);
        responseNode.put("id_team", idTeam);
//        List<ObjectNode> clients = new ArrayList<ObjectNode>(this.clients.size());
//        for(int i = 0; i < clients.size(); i++){
//            clients.add(this.clients.get(i).toJson());
//        }
//        responseNode.put("clients", Json.toJson(clients));
        return responseNode;
    }

    public static Long getIdCategoryByName(String name){
        Long tr = null;
        if (name.equalsIgnoreCase("noticias destacadas") ||
                name.equalsIgnoreCase("noticias generales") ||
                name.equalsIgnoreCase("historia") ||
                decode(name).equalsIgnoreCase("noticias destacadas") ||
                decode(name).equalsIgnoreCase("noticias generales") ||
                decode(name).equalsIgnoreCase("historia")){
            tr = 46l; //categoria fija de noticias generales
            return tr;
        }

        Category rs = finder.where().or(Expr.eq("name", name),Expr.eq("name",decode(name))).setMaxRows(1).findUnique();
        if (rs != null){
            tr = rs.getIdCategory();
        }
        return tr;
    }
}
