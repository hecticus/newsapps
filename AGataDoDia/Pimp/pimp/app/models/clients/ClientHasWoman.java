package models.clients;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.content.women.Woman;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="client_has_woman")
public class ClientHasWoman extends HecticusModel {

    @Id
    private Integer idClientHasWoman;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "id_woman")
    private Woman woman;

    public static Model.Finder<Integer, ClientHasWoman> finder = new Model.Finder<Integer, ClientHasWoman>(Integer.class, ClientHasWoman.class);

    public ClientHasWoman(Client client, Woman woman) {
        this.client = client;
        this.woman = woman;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Woman getWoman() {
        return woman;
    }

    public void setWoman(Woman woman) {
        this.woman = woman;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_woman", idClientHasWoman);
        response.put("client", client.toJsonWithoutRelations());
        response.put("woman", woman.toJson());
        return response;
    }

    public ObjectNode toJsonWithoutClient() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_woman", idClientHasWoman);
        response.put("woman", woman.toJsonWithNetworks());
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_woman", idClientHasWoman);
        response.put("client", client.toJsonWithoutRelations());
        return response;
    }
}
