package models.news;

import models.HecticusModel;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by sorcerer on 4/22/14.
 */
@Entity
@Table(name="banners")
public class Banner extends HecticusModel {

    //fields
    @Id
    private Long idBanner;
    private String name;
    private String description;
    private String link;
    private Integer status;

    //lista de archivos
    @OneToMany(cascade= CascadeType.ALL)
    private List<BannerFile> fileList;

    private static Model.Finder<Long,Banner> finder =
            new Model.Finder<Long, Banner>(Long.class, Banner.class);

    //constants
    public static final int STATUS_ACTIVE = 1;
    public static final int STATUS_INACTIVE = 0;

    public Banner(){
        //contructor por defecto
    }

    public Banner(String name, String description, String link, Integer status) {
        this.name = name;
        this.description = description;
        this.link = link;
        this.status = status;
    }

    public static Banner getBanner(long id){
        return finder.where().eq("id_banner", id).findUnique();
    }

    public static Banner getActiveBanner(){
        return finder.where().eq("status", STATUS_ACTIVE).setMaxRows(1).findUnique();
    }

    public static void activateBanner(){

    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("name", name);
        tr.put("descripcion", description);
        tr.put("link",link);
        tr.put("status", status);
        tr.put("files", Json.toJson((fileList)));
        return tr;
    }

    /**************** Getters and setters *********************/

    public Long getIdBanner() {
        return idBanner;
    }

    public void setIdBanner(Long idBanner) {
        this.idBanner = idBanner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public List<BannerFile> getFileList() {
        return fileList;
    }

    public void setFileList(List<BannerFile> fileList) {
        this.fileList = fileList;
    }
}
