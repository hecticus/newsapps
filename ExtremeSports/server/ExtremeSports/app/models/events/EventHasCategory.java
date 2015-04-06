package models.events;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.content.posts.Category;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 3/31/15.
 */
@Entity
@Table(name="event_has_category")
public class EventHasCategory extends HecticusModel {

    @Id
    private Integer idEventHasAthlete;

    @ManyToOne
    @JoinColumn(name = "id_event")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    public static Model.Finder<Integer, EventHasCategory> finder = new Model.Finder<Integer, EventHasCategory>(Integer.class, EventHasCategory.class);

    public EventHasCategory(Event event, Category category) {
        this.event = event;
        this.category = category;
    }

    public Integer getIdEventHasAthlete() {
        return idEventHasAthlete;
    }

    public void setIdEventHasAthlete(Integer idEventHasAthlete) {
        this.idEventHasAthlete = idEventHasAthlete;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_event", event.getIdEvent());
        return response;
    }
}
