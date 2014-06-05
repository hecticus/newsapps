package models.tvmaxfeeds;

import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by sorcerer on 6/2/14.
 */
@Entity
@Table(name="category_event")
public class CategoryEvent extends HecticusModel {

    @Id
    private Integer idCategoryEvente;
    private Integer idCategory;
    private Integer idEvent;

    public CategoryEvent() {
        //default
    }

    public CategoryEvent(Integer idCategory, Integer idEvent) {
        this.idCategory = idCategory;
        this.idEvent = idEvent;
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }

    /********************** bd funtions*******************************/


    /**************************** GETTERS AND SETTERS ****************************************************/

    public Integer getIdCategoryEvente() {
        return idCategoryEvente;
    }

    public void setIdCategoryEvente(Integer idCategoryEvente) {
        this.idCategoryEvente = idCategoryEvente;
    }

    public Integer getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Integer idCategory) {
        this.idCategory = idCategory;
    }

    public Integer getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(Integer idEvent) {
        this.idEvent = idEvent;
    }
}
