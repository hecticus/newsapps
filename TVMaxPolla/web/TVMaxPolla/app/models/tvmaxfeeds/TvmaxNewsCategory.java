package models.tvmaxfeeds;

import models.HecticusModel;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
    private String displayName;
    @Column(columnDefinition = "TEXT")
    private String keywords;
    private Integer status;
    private Integer idCategory;
    private Boolean main;

    private static Finder<Integer,TvmaxNewsCategory> finder =
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
        tr.put("main", main);
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

}
