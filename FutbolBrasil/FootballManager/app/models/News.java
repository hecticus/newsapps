package models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.SqlUpdate;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="news")
public class News extends HecticusModel {

    @Id
    private Long idNews;
    private Integer status;
    private String title;
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

    public News(){
        //por defecto
    }

    private static Model.Finder<Long,News> finder =
            new Model.Finder<Long, News>(Long.class, News.class);


    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idNews",idNews); //local id
        tr.put("status", status);
        tr.put("title", title);
        tr.put("summary", summary);
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

        return tr;
    }

    public static News getNews(long idNews){
        return finder.where().eq("id_news", idNews).findUnique();
    }

    public static News getNewsByExtID(long idNews){
        return finder.where().eq("external_id", idNews).findUnique();
    }

    public static List<News> getNewsByCategory(long idCategory){
        return getNewsByCategory(idCategory, MAX_SIZE);
    }

    public static List<News> getNewsByCategory(long idCategory, int limit){
        return finder.where().eq("id_category", idCategory).orderBy("pub_date_formated DESC").setMaxRows(limit).findList();
    }

    public static int getNewsByCategoriesAndGenerationDate(ArrayList<Long> idCategories, long generationDate){
        return finder.where().in("id_category", idCategories).eq("generationTime", generationDate).findRowCount();
    }

    public static List<News> getLatestNews(int idApp, int offset, int count){
        return finder.where().eq("id_app",idApp).findList();
    }

    /***
     *
     * @param idCategory
     * @return
     */
    public static List<News> getNewsByDateAndNotPushed(long idCategory){
        return finder.where().eq("id_category", idCategory).eq("generation_time", 0).orderBy("pub_date_formated").findList();
    }

    public static List<News> getTrendingNewsById(long id){
        return getTrendingNewsById(id, MAX_SIZE);
    }

    public static List<News> getTrendingNewsById(long id, int limit){
        return finder.where().eq("id_trending", id ).orderBy("pub_date_formated DESC").setMaxRows(limit).findList();
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

    //not needed
    public static void updateBatch(ArrayList<News> list){
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            for (int i =0; i < list.size(); i++){
                server.save(list.get(i));
            }
            server.commitTransaction();
        }catch (Exception ex){
            server.rollbackTransaction();
            throw ex;
        }finally {
            server.endTransaction();
        }
    }

    public static void cleanInsertedNews(long date) throws Exception {
        try {
            String tempSql = "DELETE FROM news where inserted_date < :time";
            EbeanServer server = Ebean.getServer("default");

            SqlUpdate query = server.createSqlUpdate(tempSql);
            query.setParameter("time", date);
            query.execute();
        }catch (Exception ex){

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

    public static News getNewsByDateAndNotPushed(){
        return finder.where().eq("push_notifications", true).eq("generation_time", 0).orderBy("pub_date_formated desc").setMaxRows(1).findUnique();
    }

    public static int getNewsByDateAndNotPushedCount(long generationDate){
        return finder.where().eq("push_notifications", true).eq("generation_time", generationDate).orderBy("pub_date_formated").setMaxRows(1).findRowCount();
    }

    public News getExistingNews()  {
        return finder.where().eq("external_id", externalId).findUnique();
    }

//    public static void batchInsertUpdate(ArrayList<News> list) throws Exception {
//        EbeanServer server = Ebean.getServer("default");
//        try {
//            server.beginTransaction();
//            for (int i = 0; i < list.size(); i++) {
//                //if exist update or skip
//                News current = list.get(i);
//                News exist = current.getExistingNews();
//                if (exist != null) {
//                    //update
//                    //remove resources? or update status 0
//                    //update News and insert new resources
//                    current.setIdNews(exist.getIdNews());
//                    current.setInsertedTime(exist.insertedTime);
//                    current.setGenerated(exist.generated);
//                    current.setGenerationTime(exist.generationTime);
//                    if (current.getIdCategory()!= null && current.getIdCategory() == 0){
//                        current.setIdCategory(exist.idCategory);
//                    }
//
//                    server.update(current);
//                }
//            }
//            server.commitTransaction();
//        } catch (Exception ex) {
//            server.rollbackTransaction();
//            throw ex;
//        } finally {
//            server.endTransaction();
//        }
//    }

    public static News getNewsByTitleAndApp(){
        return null;
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
}
