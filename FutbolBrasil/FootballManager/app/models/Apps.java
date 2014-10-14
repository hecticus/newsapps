package models;

import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by sorcerer on 9/24/14.
 */


@Entity
@Table(name="apps")
public class Apps extends HecticusModel {

    @Id
    private Integer idApp;
    private String name;
    private Integer status;
    private Boolean debug;
    private Integer type;
    private Integer idLanguage;

    private static Model.Finder<Integer, Apps> finder =
            new Model.Finder<Integer, Apps>(Integer.class, Apps.class);

    public Apps() {
        //default
    }

    public Apps(Integer idApp, String name, Integer status, Boolean debug, Integer type, Integer idLanguage) {
        this.idApp = idApp;
        this.name = name;
        this.status = status;
        this.debug = debug;
        this.type = type;
        this.idLanguage = idLanguage;
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }

    /**************************** GETTERS AND SETTERS ****************************************************/

    public Integer getIdApp() {
        return idApp;
    }

    public void setIdApp(Integer idApp) {
        this.idApp = idApp;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Boolean getDebug() {
        return debug;
    }

    public void setDebug(Boolean debug) {
        this.debug = debug;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getIdLanguage() {
        return idLanguage;
    }

    public void setIdLanguage(Integer idLanguage) {
        this.idLanguage = idLanguage;
    }
}
