package models.football;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.Resource;
import play.db.ebean.Model;
import play.libs.Json;
import utils.Utils;

import javax.persistence.*;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.TimeZone;

@Entity
@Table(name="news")
public class News extends HecticusModel {

    @Id
    private Long idNews;
    private Integer status;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String summary;
    private String categories; //category o list of categories
    private String keyword;
    private String author;

    @Column(columnDefinition = "TEXT")
    private String newsBody;

    @javax.persistence.Column(length=14)
    private String publicationDate; //date

    @javax.persistence.Column(length=14)
    private String insertedDate;

    @javax.persistence.Column(length=14)
    private String updatedDate;

    private Integer language;
    private String source;

    private Boolean featured;

    private Integer externalId; //id de la noticia externo

    private Integer pushStatus;
    private Long pushDate;

    //hecticus fields
    private Long idCategory; //local id category
    private Integer idApp; //id de la aplicacion
    private Integer idLanguage; //id de idioma

    //auto generated
    @javax.persistence.Column(length=32)
    private String crc;

    //hecticus images resources
    @OneToMany (mappedBy = "parent" , cascade=CascadeType.ALL)
    private List<Resource> resources;

    /***
     * constructor para lance news
     * @param title
     * @param summary
     * @param categories
     * @param keyword
     * @param author
     * @param newsBody
     * @param publicationDate
     * @param source
     * @param updatedDate
     * @param idApp
     */
    public News(String title, String summary, String categories, String keyword, String author, String newsBody,
                String publicationDate, String source, String updatedDate, Integer idApp) {
        this.title = encode(title);
        this.summary = encode(summary);
        this.categories = encode(categories);
        this.keyword = keyword;
        this.author = author;
        this.newsBody = encode(newsBody);
        this.publicationDate = publicationDate;
        this.source = source;
        this.updatedDate = updatedDate;
        this.idApp = idApp;
        //automatic values
        this.status = 0;
        this.featured = false;
        this.crc = createMd5(title);
        this.pushStatus = 0;
        this.insertedDate = ""+Utils.currentTimeStamp(TimeZone.getTimeZone("America/Caracas"));

    }

    private static Model.Finder<Long,News> finder =
            new Model.Finder<Long, News>(Long.class, News.class);


    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idNews",idNews); //local id
        tr.put("status", status);
        tr.put("title", decode(title));
        tr.put("summary", decode(summary));
        tr.put("body", decode(newsBody));
        tr.put("categories",decode(categories));
        tr.put("date" , publicationDate);
        tr.put("featured", featured);
        tr.put("keyword", keyword);
        tr.put("author", author);
        tr.put("publicationDate", publicationDate);
        if (resources.size()> 0){
            tr.put("resorces", Json.toJson((resources)));
        }
        //hecticus data??

        return tr;
    }

    public boolean isNewsEmpty(){
        boolean tr = false;
        if (title.isEmpty() && summary.isEmpty() && newsBody.isEmpty()){
            tr = true;
        }
        return  tr;
    }

    public static News getNews(long idNews){
        return finder.where().eq("id_news", idNews).findUnique();
    }

    public static List<News> getLatestNews(int idApp, int offset, int count){
        return finder.where().eq("id_app",idApp).setFirstRow(offset).setMaxRows(count).orderBy("publication_date desc").findList();
    }

    public static News getNewsByTitleAndApp(int idApp, String newsTitle){
        return finder.where().eq("id_app",idApp).eq("title",newsTitle).findUnique();
    }

    public static News getNewsToPush(){
        return null;
    }

    public static void insertBatch(ArrayList<News> list){
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            for (int i =0; i < list.size(); i++){
                server.insert(list.get(i));
            }
            server.commitTransaction();
        }catch (Exception ex){
            server.rollbackTransaction();
            throw ex;
        }finally {
            server.endTransaction();
        }

    }

    public boolean existInBd(){
        //check with externalId
        News result = finder.where().eq("externalId", externalId)
        .findUnique();
        if (result != null){
            return true;
        }
        return false;
    }

    /**
     * not in use
     * @param list
     * @throws Exception
     */
    public static void batchInsertUpdate(ArrayList<News> list) throws Exception {
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            for (int i = 0; i < list.size(); i++) {
                //if exist update or skip
                News current = list.get(i);
                News exist = null; //current.getExistingNews();
                if (exist != null) {
                    //update
                    //remove resources? or update status 0
                    //update News and insert new resources
//                    current.setIdNews(exist.getIdNews());
//                    current.setInsertedTime(exist.insertedTime);
//                    current.setGenerated(exist.generated);
//                    current.setGenerationTime(exist.generationTime);
                    if (current.getIdCategory()!= null && current.getIdCategory() == 0){
                        current.setIdCategory(exist.idCategory);
                    }

                    server.update(current);
                }
            }
            server.commitTransaction();
        } catch (Exception ex) {
            server.rollbackTransaction();
            throw ex;
        } finally {
            server.endTransaction();
        }
    }

    public static Page<News> page(int page, int pageSize, String sortBy, String order, String filter) {
        return finder.where().ilike("title", "%" + filter + "%").orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
    }

    /**************************** GETTERS AND SETTERS ****************************************************/

    public Long getIdNews() {
        return idNews;
    }

    public void setIdNews(Long idNews) {
        this.idNews = idNews;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getCategories() {
        return categories;
    }

    public void setCategories(String categories) {
        this.categories = categories;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getNewsBody() {
        return newsBody;
    }

    public void setNewsBody(String newsBody) {
        this.newsBody = newsBody;
    }

    public String getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(String publicationDate) {
        this.publicationDate = publicationDate;
    }

    public String getInsertedDate() {
        return insertedDate;
    }

    public void setInsertedDate(String insertedDate) {
        this.insertedDate = insertedDate;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Integer getLanguage() {
        return language;
    }

    public void setLanguage(Integer language) {
        this.language = language;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Integer getExternalId() {
        return externalId;
    }

    public void setExternalId(Integer externalId) {
        this.externalId = externalId;
    }

    public Long getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Long idCategory) {
        this.idCategory = idCategory;
    }

    public Integer getIdApp() {
        return idApp;
    }

    public void setIdApp(Integer idApp) {
        this.idApp = idApp;
    }

    public Integer getIdLanguage() {
        return idLanguage;
    }

    public void setIdLanguage(Integer idLanguage) {
        this.idLanguage = idLanguage;
    }

    public String getCrc() {
        return crc;
    }

    public void setCrc(String crc) {
        this.crc = crc;
    }

    public Integer getPushStatus() {
        return pushStatus;
    }

    public void setPushStatus(Integer pushStatus) {
        this.pushStatus = pushStatus;
    }

    public Long getPushDate() {
        return pushDate;
    }

    public void setPushDate(Long pushDate) {
        this.pushDate = pushDate;
    }

    public List<Resource> getResources() {
        return resources;
    }

    public void setResources(List<Resource> resources) {
        this.resources = resources;
    }

    public String getDecodedTitle() {
        try {
            return URLDecoder.decode(title, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return title;
    }

    public String getDecodedSummary() {
        try {
            return URLDecoder.decode(summary, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return summary;
    }
}
