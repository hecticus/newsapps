package models.events;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.basic.Country;
import models.content.posts.Category;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.List;

/**
 * Created by sorcerer on 3/25/15.
 */
@Entity
@Table(name="events")
public class Event extends HecticusModel {

    @Id
    private Integer idEvent;
    //name
    private String name;
    //country
    private Country country;
    //status
    private Integer status;
    //date hour
    private String date;

    private List<Category> categoryList;

    private static Model.Finder<Integer, Event> finder = new Model.Finder<Integer, Event>(Integer.class, Event.class);

    public Integer getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(Integer idEvent) {
        this.idEvent = idEvent;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<Category> getCategoryList() {
        return categoryList;
    }

    public void setCategoryList(List<Category> categoryList) {
        this.categoryList = categoryList;
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }
}
