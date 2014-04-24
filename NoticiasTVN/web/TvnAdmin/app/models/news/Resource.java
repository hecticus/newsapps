package models.news;

import exceptions.NewsException;
import models.HecticusModel;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Created by sorcerer on 3/20/14.
 */
@Entity
@Table(name="resources")
public class Resource extends HecticusModel {

    private String name;
    private String filename;
    private String genericName;
    private String description;
    private String res;
    private Integer type;
    private Integer status;

    public Resource(JsonNode data) throws NewsException {
        /*
        if (data.has("id")) {
            //externalId = data.get("id").asInt();
        } else {
            throw new NewsException("externalId faltante");
        }
        */
    }

    public String generateUrl(){
        //config url + filename
        return CDN_URL + filename;
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }

    /**************************** GETTERS AND SETTERS ****************************************************/

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRes() {
        return res;
    }

    public void setRes(String res) {
        this.res = res;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

}
