package models.tvmaxfeeds;

import models.Config;
import models.HecticusModel;
import models.Banners.Banner;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;

import play.data.validation.Constraints;
import play.libs.Json;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import java.util.List;

/**
 * Created by chrirod on 7/25/14.
 */
@Entity
@Table(name="news_category")
public class TvmaxNewsCategory extends HecticusModel {

    @Id
    private Integer idNewsCategory;
    
    @Constraints.Required(message ="Requerido")
    private String displayName;
    @Column(columnDefinition = "TEXT")
    @Constraints.Required(message ="Requerido")
    private String keywords;
    @Constraints.Required(message ="Requerido")
    private Integer status;
    private Integer idCategory;   
    private Integer idAction;
    private Integer sort;
    private Boolean main;
    
    @Column(name = "cssClass")    
    private String cssClass;
    
    public static Finder<Integer,TvmaxNewsCategory> finder =
            new Finder<Integer, TvmaxNewsCategory>(Integer.class, TvmaxNewsCategory.class);

    public TvmaxNewsCategory() {
        //default
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("id_news_category",idNewsCategory); //local id
        tr.put("display_name", displayName);
        tr.put("keywords", keywords);
        tr.put("status", status);
        tr.put("id_category", idCategory);
        tr.put("id_action", idAction);
        tr.put("main", main);
        tr.put("sort", sort);
        tr.put("cssClass", cssClass);
        
        String domainPolla = Config.getPollaDomain();
        
        if (main) {        	
        	tr.put("stream", domainPolla + "tvmaxfeeds/simplenews/latest/");
        } else {
        	tr.put("stream", domainPolla + "tvmaxfeeds/simplenews/get/" + keywords);
        }
        
        return tr;
    }

    /********************** bd funtions*******************************/
    public static List<TvmaxNewsCategory> getNewsCategories(){
        return finder.where().eq("status", 1).orderBy("sort").findList();
    }




    /******************** Getters Setters ***************************/
    public Integer getIdNewsCategory() {
        return idNewsCategory;
    }

    public void setIdNewsCategory(Integer idNewsCategory) {
        this.idNewsCategory = idNewsCategory;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Integer idCategory) {
        this.idCategory = idCategory;
    }

    public Boolean getMain() {
        return main;
    }

    public void setMain(Boolean main) {
        this.main = main;
    }

    public Integer getIdAction() {
        return idAction;
    }

    public void setIdAction(Integer idAction) {
        this.idAction = idAction;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }
    
    public String getCssClass() {
        return cssClass;
    }

    public void setCssClass(String cssClass) {
        this.cssClass = cssClass;
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
    public static Page<TvmaxNewsCategory> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                finder.where()
                        .ilike("display_name", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .findPagingList(pageSize)
                        .getPage(page);
    }
    
    public static TvmaxNewsCategory getTvmaxNewsCategory(long id){
        return finder.where().eq("id_news_category", id).findUnique();
    }
    
}
