package models.news;

import models.HecticusModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.validation.annotation.Validated;
import com.avaje.ebean.Page;
import play.data.validation.Constraints;
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

    @Constraints.Required
	@Constraints.Pattern(value = "(@)?(href=')?(HREF=')?(HREF=\")?(href=\")?(http://)?[a-zA-Z_0-9\\-]+(\\.\\w[a-zA-Z_0-9\\-]+)+(/[#&\\n\\-=?\\+\\%/\\.\\w]+)?", message="Example: http://www.hecticus.com")
    private String link;
    private Integer status;
    private Integer sort;
    
    //lista de archivos
    @OneToMany(cascade= CascadeType.ALL)
    private List<BannerFile> fileList;

    public static Model.Finder<Long,Banner> finder =
            new Model.Finder<Long, Banner>(Long.class, Banner.class);
    
    //constants
    public static final int STATUS_ACTIVE = 1;
    public static final int STATUS_INACTIVE = 0;

    public Banner(){
        //contructor por defecto
    }

    public Banner(String name, String description, String link, Integer status, Integer sort) {
        this.name = name;
        this.description = description;
        this.link = link;
        this.status = status;
        this.sort = sort;
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
    
    public int getSort() {
        return sort;
    }

    public void setSort(int sort) {
        this.sort = sort;
    }
    
    
    /**
     * Return a page of computer
     *
     * @param page Page to display
     * @param pageSize Number of computers per page
     * @param sortBy Computer property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static Page<Banner> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                finder.where()
                        .ilike("name", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .findPagingList(pageSize)
                        .getPage(page);
    }
    
    
    public static List<Banner> getAllBanners(){
        return finder.all();
    }

    public static Banner getBanner(long id){
        return finder.where().eq("id_banner", id).findUnique();
    }

    public static Banner getActiveBanner(){
        return finder.where().eq("status", STATUS_ACTIVE).setMaxRows(1).findUnique();
    }
    
    public static List<Banner> getActiveBanners() {
        return finder.where()
        		.eq("status", STATUS_ACTIVE)
        		.orderBy("sort")        		
        		.findList();
    }
    
    public static Banner getBannersByName(String name){
        return finder.where().eq("name", name).findUnique();
    }
    
    
}
