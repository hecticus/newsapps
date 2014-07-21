package models.news;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import models.HecticusModel;

import org.codehaus.jackson.node.ObjectNode;

import com.avaje.ebean.Page;

import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="categories")
public class Category extends HecticusModel{

	@Id
	public Long idCategory;
	
	@Constraints.Required(message ="Requerido")
	public String name;
       
    @Constraints.Required(message ="Requerido")
	@Constraints.Pattern(value = "(@)?(href=')?(HREF=')?(HREF=\")?(href=\")?(http://)?[a-zA-Z_0-9\\-]+(\\.\\w[a-zA-Z_0-9\\-]+)+(/[#&\\n\\-=?\\+\\%/\\.\\w]+)?", message="Example: http://www.hecticus.com")
    public String feedUrl;
    
    @Constraints.Required(message ="Requerido")
    public boolean pushable;
    
    public int sort;

    private String shortName;
    private String internalUrl; //este valor tiene que ser autogenerado
    private boolean trending;
    private boolean video; //indica que es una categoria de videos nada mas

    @Constraints.Required
    private int status;

    //type
    private Boolean hidden;

    private String iconClass;
	
	public static Model.Finder<Long,Category> finder =
			  new Model.Finder<Long, Category>(Long.class, Category.class);

	public Category() {}
	
	public Category(String name, String feedUrl, Boolean pushable, Integer sort) {
		this.name = name;
		this.feedUrl = feedUrl;
		this.pushable = pushable;
		this.sort = sort;
	}

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("id", idCategory);
        tr.put("name",name);
        tr.put("shortName",shortName);
        tr.put("feedUrl", feedUrl);
        tr.put("internalUrl", internalUrl);
        tr.put("pushable", pushable);
        tr.put("trending", trending);
        tr.put("video", video);
        tr.put("sort",sort);
        tr.put("status",status);
        tr.put("hidden",hidden);
        if (iconClass != null && !iconClass.isEmpty()){
            tr.put("iconClass", iconClass);
        }else {
            tr.put("iconClass", "icon-default");
        }

        return tr;
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
    public static Page<Category> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                finder.where()
                        .ilike("name", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .findPagingList(pageSize)
                        .getPage(page);
    }

    public static List<Category> getAllCategories(){
        return finder.all();
    }

    public static List<Category> getActiveCategories(int status){
        return finder.where().eq("status", status).setOrderBy("sort").findList();
    }

    public static List<Category> getActivePushableCategories(int status){
        return finder.where().eq("status", status).eq("pushable", true).findList();
    }

    public static Category getCategoriesByName(String name){
        return finder.where().eq("name", name).findUnique();
    }

    public static Category getCategoriesByShortName(String shortName){
        return finder.where().eq("short_name", shortName).findUnique();
    }

    public static Category getCategory(long idCategory){
        return finder.where().eq("id_category", idCategory).findUnique();
    }

    /**************** Getters and setters *********************/
	
    public Long getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Long idCategory) {
        this.idCategory = idCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFeedUrl() {
        return feedUrl;
    }

    public void setFeedUrl(String feedUrl) {
        this.feedUrl = feedUrl;
    }

    public int getSort() {
        return sort;
    }

    public void setSort(int sort) {
        this.sort = sort;
    }

    public boolean getPushable() {
        return pushable;
    }

    public void setPushable(boolean pushable) {
        this.pushable = pushable;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getInternalUrl() {
        return internalUrl;
    }

    public void setInternalUrl(String internalUrl) {
        this.internalUrl = internalUrl;
    }

    public boolean isTrending() {
        return trending;
    }

    public void setTrending(boolean trending) {
        this.trending = trending;
    }

    public boolean isVideo() {
        return video;
    }

    public void setVideo(boolean video) {
        this.video = video;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Boolean getHidden() {
        return hidden;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public String getIconClass() {
        return iconClass;
    }

    public void setIconClass(String iconClass) {
        this.iconClass = iconClass;
    }
}
