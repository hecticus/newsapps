package models.events;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by sorcerer on 3/25/15.
 */
@Entity
@Table(name="events")
public class Location extends HecticusModel {

    @Id
    private Integer idLocation;

    private String name;

    private Event event;

    //location data

    public Integer getIdLocation() {
        return idLocation;
    }

    public void setIdLocation(Integer idLocation) {
        this.idLocation = idLocation;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }
}
