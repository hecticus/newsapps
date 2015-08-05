package models.news;

import exceptions.NewsException;
import models.HecticusModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import javax.persistence.*;

/**
 * Created by sorcerer on 3/20/14.
 */
@Entity
@Table(name="resources")
public class Resource extends HecticusModel {

    @Id
    private long idResource;
    private String name;
    private String filename;
    private String genericName;
    private String description;
    private String res;
    private Integer type; //1 principal, 2 principal reducido, 3 secundaria
    private Integer status;
    @ManyToOne
    @JoinColumn(name="news_id_news")
    private News parent;

    public Resource(JsonNode data) throws NewsException {

        if (data.has("filename")) {
            filename = data.get("filename").asText();
        }

        if (data.has("type")){
            type = data.get("type").asInt();
        }

        status = 1;
    }

    public Resource(String filename, Integer type, News parent) {
        this.filename = filename;
        this.type = type;
        this.parent = parent;
        this.status = 1;
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

    public long getIdResource() {
        return idResource;
    }

    public void setIdResource(long idResource) {
        this.idResource = idResource;
    }
}
