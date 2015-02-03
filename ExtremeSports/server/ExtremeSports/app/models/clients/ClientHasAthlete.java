package models.clients;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.content.athletes.Athlete;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="client_has_athlete")
public class ClientHasAthlete extends HecticusModel {

    @Id
    private Integer idClientHasTheme;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "id_athlete")
    private Athlete athlete;

    public static Model.Finder<Integer, ClientHasAthlete> finder = new Model.Finder<Integer, ClientHasAthlete>(Integer.class, ClientHasAthlete.class);

    public ClientHasAthlete(Client client, Athlete theme) {
        this.client = client;
        this.athlete = theme;
    }

    public Integer getIdClientHasTheme() {
        return idClientHasTheme;
    }

    public void setIdClientHasTheme(Integer idClientHasTheme) {
        this.idClientHasTheme = idClientHasTheme;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Athlete getAthlete() {
        return athlete;
    }

    public void setAthlete(Athlete athlete) {
        this.athlete = athlete;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_athlete", idClientHasTheme);
        response.put("client", client.toJsonWithoutRelations());
        response.put("athlete", athlete.toJson());
        return response;
    }

    public ObjectNode toJsonWithoutClient() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_athlete", idClientHasTheme);
        response.put("athlete", athlete.toJsonWithNetworks());
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_athlete", idClientHasTheme);
        response.put("client", client.toJsonWithoutRelations());
        return response;
    }
}
