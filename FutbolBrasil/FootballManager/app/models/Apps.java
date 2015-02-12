package models;

import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.TimeZone;

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


    @ManyToOne
    @JoinColumn(name = "id_language")
    private Language language;

    @OneToOne
    @JoinColumn(name = "id_timezone")
    private Timezone timezone;

    private static Model.Finder<Integer, Apps> finder = new Model.Finder<Integer, Apps>(Integer.class, Apps.class);

    public Apps() {
        //default
    }

    public Apps(Integer idApp, String name, Integer status, Boolean debug, Integer type, Language language) {
        this.idApp = idApp;
        this.name = name;
        this.status = status;
        this.debug = debug;
        this.type = type;
        this.language = language;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode obj = Json.newObject();
        obj.put("id_app", idApp);
        obj.put("name",name);
        obj.put("status", status);
        obj.put("language", language.toJson());
        return obj;
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

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Timezone getTimezone() {
        return timezone;
    }

    public void setTimezone(Timezone timezone) {
        this.timezone = timezone;
    }

    public static TimeZone getTimezone(int idApp){
        Apps app = finder.byId(idApp);
        if(app != null){
            return app.getTimezone().getTimezone();
        }
        return TimeZone.getDefault();
    }


    public static Apps findId(int id){
        return finder.byId(id);
    }
}
