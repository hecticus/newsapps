package models.football;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by karina on 5/20/14.
 */
@Entity
@Table(name="actions", uniqueConstraints = @UniqueConstraint(columnNames = {"extId"}))
public class Action extends HecticusModel {

    @Id
    private Integer idActions;
    private String mnemonic;
    private String description;
    private Integer extId;
    //private Integer ext_id;
    @OneToMany(mappedBy = "action")
    private List<GameMatchEvent> events;

    private static Model.Finder<Integer,Action> finder = new Model.Finder<Integer,Action>(Integer.class,Action.class);

    public Action(){}

    public Action(String mnemonic, String description, Integer extId) {
        this.mnemonic = mnemonic;
        this.description = description;
        this.extId = extId;
    }

    public Integer getIdActions() {
        return idActions;
    }

    public void setIdActions(Integer idActions) {
        this.idActions = idActions;
    }

    public String getMnemonic() {
        return mnemonic;
    }

    public void setMnemonic(String mnemonic) {
        this.mnemonic = mnemonic;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public static Action findById(Integer id){
        return finder.byId(id);
    }

    public Integer getExtId() {
        return extId;
    }

    public void setExtId(Integer extId) {
        this.extId = extId;
    }

    public List<GameMatchEvent> getEvents() {
        return events;
    }

    public void setEvents(List<GameMatchEvent> events) {
        this.events = events;
    }

    public static Action findByMnemonic(String mnemonic){
        return  finder.where().eq("mnemonic",mnemonic).findUnique();
    }

    public static Action findByExtId(int extId){
        return  finder.where().eq("extId",extId).findUnique();
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode node = Json.newObject();
        node.put("id_action",idActions);
        node.put("mnemonic",mnemonic);
        node.put("description",description);
        return node;
    }

    public void validate() {
        Action tr = findByExtId(this.extId);
        if (tr != null) {
            //existe
            this.idActions = tr.idActions;
            this.description = tr.description;
            this.mnemonic = tr.mnemonic;
            this.extId = tr.extId;
        } else {
            this.save();
        }
    }

}
