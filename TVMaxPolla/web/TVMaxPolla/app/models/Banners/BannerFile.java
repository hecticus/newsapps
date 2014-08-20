package models.Banners;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.List;

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
    
    public static Model.Finder<Long,BannerFile> finder =
            new Model.Finder<Long, BannerFile>(Long.class, BannerFile.class);
    
    
    
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

    /****************************GETTERS AND SETTERS***********************************************/

    public Long getIdBannerFile() {
        return idBannerFile;
    }

    public void setIdBannerFile(Long idBannerFile) {
        this.idBannerFile = idBannerFile;
    }

    
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
        
    /**
     * Return a page of computer
     *
     * @param page Page to display
     * @param pageSize Number of computers per page
     * @param sortBy Computer property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static Page<BannerFile> page(Long parent, int page, int pageSize, String sortBy, String order, String filter) {
        return
                finder.where()
                		.eq("banner_id_banner", parent)
                        .ilike("name", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .findPagingList(pageSize)
                        .getPage(page);
    }
        
    public static List<BannerFile> getAllFiles(){
        return finder.all();
    }

    public static BannerFile getFile(long id){
        return finder.where().eq("id_banner_file", id).findUnique();
    }
    
    public static BannerFile getFileByName(String name){
        return finder.where().eq("name", name).findUnique();
    }
  
}
