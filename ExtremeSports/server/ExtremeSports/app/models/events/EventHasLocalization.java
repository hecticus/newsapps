package models.events;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.basic.Language;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 4/1/15.
 */
@Entity
@Table(name="event_has_localization")
public class EventHasLocalization extends HecticusModel {

    @Id
    private Integer idEventHasLocalization;

    @ManyToOne
    @JoinColumn(name = "id_event")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "id_language")
    private Language language;

    @Constraints.Required
    private String name;

    @Constraints.Required
    @Column(columnDefinition = "TEXT")
    private String description;

    public static Model.Finder<Integer, EventHasLocalization> finder = new Model.Finder<Integer, EventHasLocalization>(Integer.class, EventHasLocalization.class);

    public EventHasLocalization(Event event, Language language, String name, String content) {
        this.event = event;
        this.language = language;
        this.name = name;
        this.description = content;
    }

    public Integer getIdEventHasLocalization() {
        return idEventHasLocalization;
    }

    public void setIdEventHasLocalization(Integer idEventHasLocalization) {
        this.idEventHasLocalization = idEventHasLocalization;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_event_has_localization", idEventHasLocalization);
        response.put("event", event.toJsonWithoutRelations());
        response.put("language", language.toJson());
        response.put("name", name);
        response.put("content", description);
        return response;
    }

    public ObjectNode toJsonWithoutEvent() {
        ObjectNode response = Json.newObject();
        response.put("id_event_has_localization", idEventHasLocalization);
        response.put("language", language.toJson());
        response.put("name", name);
        response.put("content", description);
        return response;
    }
}
