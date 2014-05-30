package models.pushevents;

import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 5/27/14.
 */
@Entity
@Table(name="client_category")
public class CategoryClient extends HecticusModel {

    @Id
    private Long idClientCategory;
    @Constraints.Required
    private Long idClient;

    @ManyToOne
    @JoinColumn(name="id_category")
    private Category category;

    public static Model.Finder<Long, CategoryClient> finder = new
            Model.Finder<Long, CategoryClient>(Long.class, CategoryClient.class);

    public Long getIdClientCategory() {
        return idClientCategory;
    }

    public CategoryClient(Long idClient, Category category) {
        this.idClient = idClient;
        this.category = category;
    }

    public void setIdClientCategory(Long idClientCategory) {
        this.idClientCategory = idClientCategory;
    }

    public Long getIdClient() {
        return idClient;
    }

    public void setIdClient(Long idClient) {
        this.idClient = idClient;
    }

    public Category getCategory() {
        return category;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode responseNode = Json.newObject();
        responseNode.put("idClientCategory", idClientCategory);
        responseNode.put("idClient", idClient);
        return responseNode;
    }
}
