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
@Table(name="event_queue")
public class EventQueue extends HecticusModel{

    @Id
    private Integer idEvent;
    private String content;
    private String action;
    private Integer fifaMatch;
    private Integer status;
    private Integer externalId;
    private Long generationTime;

    //contructor
    public EventQueue(){
        //default
    }

    public EventQueue(String content, String action, Long externalId) {
        if (content.length() > 100){
            content = content.substring(0,100);
        }
        this.content = content;
        this.action = action;
        this.externalId = externalId.intValue();
        //constantes
        this.fifaMatch = 0;
        this.status = 1;
        this.generationTime = System.currentTimeMillis();
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }

    /********************** bd funtions*******************************/


    /**************************** GETTERS AND SETTERS ****************************************************/

    public Integer getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(Integer idEvent) {
        this.idEvent = idEvent;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Integer getFifaMatch() {
        return fifaMatch;
    }

    public void setFifaMatch(Integer fifaMatch) {
        this.fifaMatch = fifaMatch;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getExternalId() {
        return externalId;
    }

    public void setExternalId(Integer externalId) {
        this.externalId = externalId;
    }

    public Long getGenerationTime() {
        return generationTime;
    }

    public void setGenerationTime(Long generationTime) {
        this.generationTime = generationTime;
    }
}
