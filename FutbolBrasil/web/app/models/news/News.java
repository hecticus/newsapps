package models.news;

import java.util.List;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import play.db.ebean.Model;
import play.libs.Json;

@Entity
@Table(name="news")
public class News extends Model  {
	
	@Id
	private Long id;
	private String headLine;
	private String summary;
	private String xml;
	private String date;	
	private Integer sort;
	
	@ManyToMany(cascade= CascadeType.ALL)
	private List<Resource> resources;
	
	public static Model.Finder<Long,News> finder = new Model.Finder<Long, News>(Long.class, News.class);
		
	public News(){
		//contructor por defecto
	}
	
	public News(String headLine, String summary, String xml, String date, Integer sort) {
		this.headLine = headLine;
		this.summary = summary;
		this.xml = xml;
		this.date = date;
		this.sort = sort;
	}	 

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
	
	public String getHeadLine() {
        return headLine;
    }

    public void setHeadLine(String headLine) {
        this.headLine = headLine;
    }

    public String getSummary() {
        return headLine;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

	public String getXml() {
        return xml;
    }

    public void setXml(String xml) {
        this.xml = xml;
    }
    
	 public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }       
    
    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }
    
    public ObjectNode toJson() {
        ObjectNode objNode = Json.newObject();
        objNode.put("id",id);        
        objNode.put("headLine", headLine);
        objNode.put("summary", summary);
        objNode.put("xml", xml);
        objNode.put("date", date);
        objNode.put("resources", Json.toJson((resources)));
        return objNode;
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
    public static Page<News> page(int page, int pageSize, String sortBy, String order, String filter) {
        return
                finder.where()
                        .ilike("headLine", "%" + filter + "%")
                        .orderBy(sortBy + " " + order)
                        .findPagingList(pageSize)
                        .getPage(page);
    }
    
    
    public static List<News> getAllNews(){
        return finder.all();
    }

    public static News getNewsById(long id){
        return finder.where().eq("id", id).findUnique();
    }
   
}