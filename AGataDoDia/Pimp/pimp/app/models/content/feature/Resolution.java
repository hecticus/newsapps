package models.content.feature;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.content.women.WomanHasCategory;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;
import scala.Tuple2;
import scala.collection.JavaConversions;
import scala.collection.mutable.Buffer;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by plesse on 11/11/14.
 */
@Entity
@Table(name="resolutions")
public class Resolution extends HecticusModel{
    @Id
    private Integer idResolution;
    @OneToMany(mappedBy="resolution", cascade = CascadeType.ALL)
    private List<FeaturedImageHasResolution> images;
    @Constraints.Required
    private Integer width;
    @Constraints.Required
    private Integer height;

    public static Model.Finder<Integer, Resolution> finder = new Model.Finder<>(Integer.class, Resolution.class);

    public Resolution(Integer width, Integer height) {
        this.width = width;
        this.height = height;
    }

    public Integer getIdResolution() {
        return idResolution;
    }

    public void setIdResolution(Integer idResolution) {
        this.idResolution = idResolution;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public String getName() {
        return width + "x" + height;
    }

    public List<FeaturedImageHasResolution> getImages() {
        return images;
    }

    public void setImages(List<FeaturedImageHasResolution> images) {
        this.images = images;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_resolution", idResolution);
        response.put("width", width);
        response.put("height", height);
        if(images != null && !images.isEmpty()){
            ArrayList<ObjectNode> imgs = new ArrayList<>();
            for(FeaturedImageHasResolution image : images){
                imgs.add(image.toJsonWithoutResolution());
            }
            response.put("images", Json.toJson(imgs));
        }
        return response;
    }

    public ObjectNode toJsonWithoutImages() {
        ObjectNode response = Json.newObject();
        response.put("id_resolution", idResolution);
        response.put("width", width);
        response.put("height", height);
        return response;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<Resolution> resolutions = Resolution.finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(Resolution resolution : resolutions) {
            Tuple2<String, String> t = new Tuple2<>(resolution.getIdResolution().toString(), resolution.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> resolutionBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> resolutionList = resolutionBuffer.toList();
        return resolutionList;
    }

    public static Page<Resolution> page(int page, int pageSize, String sortBy, String order, String filter) {
        try {
            return finder.where().eq("width", Integer.parseInt(filter)).orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
        } catch (NumberFormatException e) {
            return finder.where().orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
        }
    }
}
