package models.clients;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.content.athletes.Athlete;
import models.content.posts.Category;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 3/19/15.
 */
@Entity
@Table(name="client_has_category")
public class ClientHasCategory extends HecticusModel{

    @Id
    private Integer idClientHasCategory;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    private static Model.Finder<Integer, ClientHasCategory> finder = new Model.Finder<Integer, ClientHasCategory>(Integer.class, ClientHasCategory.class);

    public ClientHasCategory(Client client, Category category) {
        this.client = client;
        this.category = category;
    }

    public Integer getIdClientHasCategory() {
        return idClientHasCategory;
    }

    public void setIdClientHasCategory(Integer idClientHasCategory) {
        this.idClientHasCategory = idClientHasCategory;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_category", idClientHasCategory);
        response.put("category", category.toJson());
        return response;
    }
}
