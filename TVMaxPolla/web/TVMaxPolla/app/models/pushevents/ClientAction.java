package models.pushevents;

import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 6/3/14.
 */

@Entity
@Table(name="client_action")
public class ClientAction extends HecticusModel {

    @Id
    private Long idClientAction;
    @Constraints.Required
    private Long idClient;

    @ManyToOne
    @JoinColumn(name="id_action")
    private Action action;


    public ClientAction(Long idClient, Action action) {
        this.idClient = idClient;
        this.action = action;
    }

    public static Model.Finder<Long, ClientAction> finder = new
            Model.Finder<Long, ClientAction>(Long.class, ClientAction.class);

    public Long getIdClientAction() {
        return idClientAction;
    }

    public Long getIdClient() {
        return idClient;
    }

    public Action getAction() {
        return action;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode responseNode = Json.newObject();
        responseNode.put("idClientAction", idClientAction);
        responseNode.put("idClient", idClient);
        return responseNode;
    }
}
