package models.news;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import models.HecticusModel;

import org.codehaus.jackson.node.ObjectNode;

import com.avaje.ebean.Page;

import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import java.util.List;

@Entity
@Table(name="category")
public class Category extends HecticusModel{

	@Id
	public Long idCategory;
	
	@Constraints.Required
	public String name;
       
    @Constraints.Required
	@Constraints.Pattern(value = "(@)?(href=')?(HREF=')?(HREF=\")?(href=\")?(http://)?[a-zA-Z_0-9\\-]+(\\.\\w[a-zA-Z_0-9\\-]+)+(/[#&\\n\\-=?\\+\\%/\\.\\w]+)?", message="Example: http://www.hecticus.com")
    public String feedUrl;
    
    @Constraints.Required
    public boolean pushable;
    
    public int sort;
    
    
    
    private String shortName;
    private String internalUrl; //este valor tiene que ser autogenerado
    private boolean trending;
	
	public static Model.Finder<Long,Category> finder =
			  new Model.Finder<Long, Category>(Long.class, Category.class);

	public Category() {}
	
	public Category(String name, String feedUrl, Boolean pushable, Integer sort) {
		this.name = name;
		this.feedUrl = feedUrl;
		this.pushable = pushable;
		this.sort = sort;
	}
	
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

    public static List<Category> getCategories(String catName){
        return finder.where().eq("name", catName).findList();
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

    public static List<Category> getAllCategories(){
        return finder.all();
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
        tr.put("sort",sort);
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
    
}
