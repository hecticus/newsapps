package models.content.feature;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by plesse on 11/11/14.
 */
@Entity
@Table(name="featured_images")
public class FeaturedImage extends HecticusModel {

    @Id
    private Integer idFeaturedImages;
    @Constraints.Required
    private String name;

    @OneToMany(mappedBy="featuredImage", cascade = CascadeType.ALL)
    private List<FeaturedImageHasResolution> resolutions;

    public static Model.Finder<Integer, FeaturedImage> finder = new Model.Finder<>(Integer.class, FeaturedImage.class);

    public FeaturedImage(String name, List<FeaturedImageHasResolution> resolutions) {
        this.name = name;
        this.resolutions = resolutions;
    }

    public FeaturedImage(String name) {
        this.name = name;
    }

    public Integer getIdFeaturedImages() {
        return idFeaturedImages;
    }

    public void setIdFeaturedImages(Integer idFeaturedImages) {
        this.idFeaturedImages = idFeaturedImages;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<FeaturedImageHasResolution> getResolutions() {
        return resolutions;
    }

    public void setResolutions(List<FeaturedImageHasResolution> resolutions) {
        this.resolutions = resolutions;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_featured_image", idFeaturedImages);
        response.put("name", name);
        if(resolutions != null && !resolutions.isEmpty()){
            ArrayList<ObjectNode> res = new ArrayList<>();
            for(FeaturedImageHasResolution resolution : resolutions){
                res.add(resolution.toJsonWithoutFeaturedImage());
            }
            response.put("resolutions", Json.toJson(res));
        }
        return response;
    }

    public static Page<FeaturedImage> page(int page, int pageSize, String sortBy, String order, String filter) {
        return finder.where().ilike("name", "%" + filter + "%").orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
    }
}
