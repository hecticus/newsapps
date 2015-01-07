package models.content.feature;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.io.File;

/**
 * Created by plesse on 11/11/14.
 */
@Entity
@Table(name="featured_image_has_resolution")
public class FeaturedImageHasResolution extends HecticusModel {

    @Id
    private Integer idFeaturedImageHasResolution;

    @ManyToOne
    @JoinColumn(name = "id_featured_image")
    private FeaturedImage featuredImage;

    @ManyToOne
    @JoinColumn(name = "id_resolution")
    private Resolution resolution;

    @Constraints.Required
    private String link;

    @Transient
    public File file;
    @Transient
    public String extension;

    public static Model.Finder<Integer, FeaturedImageHasResolution> finder = new Model.Finder<>(Integer.class, FeaturedImageHasResolution.class);

    public FeaturedImageHasResolution(Resolution resolution, File file, String extension) {
        this.resolution = resolution;
        this.file = file;
        this.extension = extension;
    }

    public FeaturedImageHasResolution(FeaturedImage featuredImage, Resolution resolution, String link) {
        this.featuredImage = featuredImage;
        this.resolution = resolution;
        this.link = link;
    }

    public Integer getIdFeaturedImageHasResolution() {
        return idFeaturedImageHasResolution;
    }

    public void setIdFeaturedImageHasResolution(Integer idFeaturedImageHasResolution) {
        this.idFeaturedImageHasResolution = idFeaturedImageHasResolution;
    }

    public FeaturedImage getFeaturedImage() {
        return featuredImage;
    }

    public void setFeaturedImage(FeaturedImage featuredImage) {
        this.featuredImage = featuredImage;
    }

    public Resolution getResolution() {
        return resolution;
    }

    public void setResolution(Resolution resolution) {
        this.resolution = resolution;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_featured_image_has_resolution", idFeaturedImageHasResolution);
        response.put("featuredImage", featuredImage.getName());
        response.put("resolution", resolution.toJsonWithoutImages());
        response.put("link", link);
        return response;
    }

    public ObjectNode toJsonWithoutResolution() {
        ObjectNode response = Json.newObject();
        response.put("id_featured_image_has_resolution", idFeaturedImageHasResolution);
        response.put("featuredImage", featuredImage.getName());
        response.put("link", link);
        return response;
    }

    public ObjectNode toJsonWithoutFeaturedImage() {
        ObjectNode response = Json.newObject();
        response.put("id_featured_image_has_resolution", idFeaturedImageHasResolution);
        response.put("resolution", resolution.toJsonWithoutImages());
        response.put("link", link);
        return response;
    }
}
