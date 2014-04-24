package models.news;

import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by sorcerer on 4/22/14.
 */
@Entity
@Table(name="banner_files")
public class BannerFile extends HecticusModel {

    @Id
    private Long idBannerFile;
    private String name;
    private String location;
    private int width;
    private int height;

    public BannerFile() {
        //contructor por defecto
    }

    public BannerFile(String name, String location, int width, int height) {
        this.name = name;
        this.location = location;
        this.width = width;
        this.height = height;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        return tr;
    }

    public Long getIdBannerFile() {
        return idBannerFile;
    }

    public void setIdBannerFile(Long idBannerFile) {
        this.idBannerFile = idBannerFile;
    }

    /****************************GETTERS AND SETTERS***********************************************/


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }
}
