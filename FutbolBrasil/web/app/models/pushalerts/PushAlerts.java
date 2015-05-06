package models.pushalerts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by chrirod on 10/29/14.
 */
@Entity
@Table(name="push_alerts")
public class PushAlerts extends HecticusModel {

    @Id
    private Integer idPushAlert;
    @Constraints.Required
    private String name;

    @Constraints.Required
    private Integer idExt;

    @Constraints.Required
    private Boolean pushable;

    public static Model.Finder<Integer, PushAlerts> finder = new Model.Finder<Integer, PushAlerts>(Integer.class, PushAlerts.class);

    public PushAlerts(String name, Integer idExt, Boolean pushable) {
        this.name = name;
        this.idExt = idExt;
        this.pushable = pushable;
    }

    public Integer getIdPushAlert() {
        return idPushAlert;
    }

    public void setIdPushAlert(Integer idPushAlert) {
        this.idPushAlert = idPushAlert;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getIdExt() {
        return idExt;
    }

    public void setIdExt(Integer idExt) {
        this.idExt = idExt;
    }

    public Boolean getPushable() {
        return pushable;
    }

    public void setPushable(Boolean pushable) {
        this.pushable = pushable;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode objNode = Json.newObject();
        objNode.put("id_push_alert",idPushAlert);
        objNode.put("name", name);
        objNode.put("id_ext", idExt);
        objNode.put("pushable", pushable);
        return objNode;
    }

    public static PushAlerts getLastTeamAlert(){
        return finder.where().ne("idExt", -1).orderBy("idExt desc").setMaxRows(1).findUnique();
    }
}
