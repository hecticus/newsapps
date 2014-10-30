package models.news;

import java.util.List;

import com.fasterxml.jackson.databind.node.ObjectNode;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;


@Entity
@Table(name="resource")
public class Resource extends HecticusModel {
	
	@Id
	private Long id;	
	private String url;
	private String tags;
	private String metaData;	
	private String date;
		
	public static Model.Finder<Long,Resource> finder = new Model.Finder<Long, Resource>(Long.class, Resource.class);
		 
	public Resource(){
		//contructor por defecto
	}
	
	public Resource(String url, String tags, String metaData, String date) {
		this.url = url;
		this.tags = tags;
		this.metaData = metaData;
		this.date = date;
	}	 

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
	
	public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMetaData() {
        return metaData;
    }

    public void setMetaData(String metaData) {
        this.metaData = metaData;
    }
    
	public String getKeywords() {
        return tags;
    }

    public void setKeywords(String keywords) {
        this.tags = keywords;
    }    
    
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    
    public ObjectNode toJson() {
        ObjectNode objNode = Json.newObject();
        objNode.put("id",id);
        objNode.put("url", url);
        objNode.put("tags", tags);
        objNode.put("metaData", metaData);
        objNode.put("date", date);
        return objNode;
    }
    
    
    public static List<Resource> getAllResource(){    	    	
        return finder.all();
    }

    public static List<Resource> getAllResourcesAvailable(){    	
    	com.avaje.ebean.Query<Resource>  query  = com.avaje.ebean.Ebean.createQuery(Resource.class);
        return query.where("NOT EXISTS (SELECT * FROM news_resource  WHERE news_resource.resource_id = id)").findList();
    }
    
    public static Resource getResource(long id){
        return finder.where().eq("id", id).findUnique();
    }
    
    
       
}