package models.clients;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.content.themes.Theme;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="client_has_theme")
public class ClientHasTheme extends HecticusModel {

    @Id
    private Integer idClientHasTheme;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "id_theme")
    private Theme theme;

    public static Model.Finder<Integer, ClientHasTheme> finder = new Model.Finder<Integer, ClientHasTheme>(Integer.class, ClientHasTheme.class);

    public ClientHasTheme(Client client, Theme theme) {
        this.client = client;
        this.theme = theme;
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

    public Theme getTheme() {
        return theme;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_theme", idClientHasTheme);
        response.put("client", client.toJsonWithoutRelations());
        response.put("theme", theme.toJson());
        return response;
    }

    public ObjectNode toJsonWithoutClient() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_theme", idClientHasTheme);
        response.put("theme", theme.toJsonWithNetworks());
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_woman", idClientHasTheme);
        response.put("client", client.toJsonWithoutRelations());
        return response;
    }
}
