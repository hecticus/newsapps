package models.news;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import models.HecticusModel;
import play.db.ebean.Model;

import java.util.List;

@Entity
@Table(name="category")
public class Category extends HecticusModel{

	@Id
	public Long idCategory;
	public String name;
    public String shortName;
	public String feedUrl;
    public String internalUrl; //este valor tiene que ser autogenerado
    public int sort;
    public boolean pushable;
    public boolean trending;
	
	public static Model.Finder<Long,Category> finder =
			  new Model.Finder<Long, Category>(Long.class, Category.class);

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

    public boolean isPushable() {
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
}
