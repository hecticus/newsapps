package models.pushevents;

import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by plesse on 6/3/14.
 */
@Entity
@Table(name="actions")
public class Action extends HecticusModel {
    @Override
    public ObjectNode toJson() {
        ObjectNode responseNode = Json.newObject();
        responseNode.put("id_action", idAction);
        responseNode.put("name", name);
//        responseNode.put("template", template);
//        responseNode.put("pushable", pushable);
//        List<ObjectNode> clients = new ArrayList<ObjectNode>(this.clients.size());
//        for(int i = 0; i < clients.size(); i++){
//            clients.add(this.clients.get(i).toJson());
//        }
//        responseNode.put("clients", Json.toJson(clients));
        return responseNode;
    }

    @Id
    private Long idAction;
    @Constraints.Required
    private String name;
    @Constraints.Required
    private String template;
    @Constraints.Required
    private Integer pushable;

    @OneToMany(mappedBy = "action")
    private List<ClientAction> clients;

    public static Model.Finder<Long, Action> finder = new
            Model.Finder<Long, Action>(Long.class, Action.class);


    public Long getIdAction() {
        return idAction;
    }

    public String getName() {
        return name;
    }

    public String getTemplate() {
        return template;
    }

    public Integer getPushable() {
        return pushable;
    }
}
