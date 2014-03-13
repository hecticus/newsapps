package models.news;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.Expr;
import com.avaje.ebean.SqlUpdate;
import exceptions.NewsException;
import models.HecticusModel;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;
import utils.Utils;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="news")
public class News extends HecticusModel{

    @Id
    private long idNews;
    private int externalId; //id de la noticia externo
    private String author;
    private String pubDate;
    private String category; //external category
    private long idCategory; //local id category
    private String image;
    private String imageCaption;
    private String videoUrl;
    private String title;
    private boolean topNews;
    private String uploadedVideo;
    private String description;
    private int visits;
    private String crc;
    private String insertedTime;
    private boolean generated;
    private long generationTime; //tiempo que se usa para saber cuando se genero el push de la noticia. Formato: YYYYMMDD
    private String pubDateFormated; //es el mismo pubDate pero con un formato que se puede ordenar YYYYMMDDhhmmss

    //videos
    private  String categoryName;
    private String videoTime;

    //trending
    private String idTrending;

    public News(JsonNode data) throws NewsException {
        //contruct obj from json
        if (data.has("id")) {
            externalId = data.get("id").asInt();
        } else {
            throw new NewsException("externalId faltante");
        }

        if (data.has("author")) {
            author = data.get("author").asText();
        } else {
            throw new NewsException("author faltante");
        }

        if (data.has("pubDate")) {
            pubDate = data.get("pubDate").asText();
            pubDateFormated = Utils.formatDateStringForSorting(pubDate);
        } else {
            throw new NewsException("pubdate faltante");
        }

        if (data.has("category")) {
            category = data.get("category").asText();
        } else {
            throw new NewsException("category faltante");
        }

        if (data.has("idCategory")) {
            idCategory = data.get("idCategory").asLong();
        }

        if (data.has("image")) {
            image = data.get("image").asText();
        } else {
            throw new NewsException("image faltante");
        }

        if (data.has("imageCaption")) {
            imageCaption = data.get("imageCaption").asText();
        } else {
            throw new NewsException("imageCaption faltante");
        }

        if (data.has("videoUrl")) {
            videoUrl = data.get("videoUrl").asText();
        }

        if (data.has("title")) {
            title = data.get("title").asText();
        } else {
            throw new NewsException("title faltante");
        }
        topNews = false;
        if (data.has("topNews")) {
            topNews = data.get("topNews").asBoolean();
        } else {
            throw new NewsException("topNews faltante");
        }

        if (data.has("uploadedVideo")) {
            uploadedVideo = data.get("uploadedVideo").asText();
        } else {
            throw new NewsException("uploadedVideo faltante");
        }

        if (data.has("description")) {
            description = data.get("description").asText();
        } else {
            throw new NewsException("description faltante");
        }

        if (data.has("visits")) {
            visits = data.get("visits").asInt();
        } else {
            throw new NewsException("visits faltante");
        }
        //auto generated values
        generated = false;
        crc = Utils.createMd5(title);
        //videos
        categoryName ="";
        videoTime = "";
        //trending
        idTrending = "";
        //0 nunca se ha generado
        generationTime = 0;
    }


    public News(){
        //por defecto
    }


    public static Model.Finder<Long,News> finder =
            new Model.Finder<Long, News>(Long.class, News.class);

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getPubDate() {
        return pubDate;
    }

    public void setPubDate(String pubDate) {
        this.pubDate = pubDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getImageCaption() {
        return imageCaption;
    }

    public void setImageCaption(String imageCaption) {
        this.imageCaption = imageCaption;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isTopNews() {
        return topNews;
    }

    public void setTopNews(boolean topNews) {
        this.topNews = topNews;
    }

    public String getUploadedVideo() {
        return uploadedVideo;
    }

    public void setUploadedVideo(String uploadedVideo) {
        this.uploadedVideo = uploadedVideo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getVisits() {
        return visits;
    }

    public void setVisits(int visits) {
        this.visits = visits;
    }

    public String getCrc() {
        return crc;
    }

    public void setCrc(String crc) {
        this.crc = crc;
    }

    public String getInsertedTime() {
        return insertedTime;
    }

    public void setInsertedTime(String insertedTime) {
        this.insertedTime = insertedTime;
    }

    public long getIdNews() {
        return idNews;
    }

    public void setIdNews(long idNews) {
        this.idNews = idNews;
    }

    public int getExternalId() {
        return externalId;
    }

    public void setExternalId(int externalId) {
        this.externalId = externalId;
    }

    public boolean isGenerated() {
        return generated;
    }

    public void setGenerated(boolean generated) {
        this.generated = generated;
    }

    public long getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(long idCategory) {
        this.idCategory = idCategory;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getVideoTime() {
        return videoTime;
    }

    public void setVideoTime(String videoTime) {
        this.videoTime = videoTime;
    }

    public String getIdTrending() {
        return idTrending;
    }

    public void setIdTrending(String idTrending) {
        this.idTrending = idTrending;
    }

    public long getGenerationTime() { return generationTime; }

    public void setGenerationTime(long generationTime) { this.generationTime = generationTime; }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("id",idNews);
        tr.put("externalId", externalId);
        tr.put("idCategory",idCategory);
        tr.put("author", author);
        tr.put("pubDate", pubDate);
        tr.put("category", category);
        tr.put("image",image);
        tr.put("imageCaption",imageCaption);
        tr.put("videoUrl",videoUrl);
        tr.put("title", title);
        tr.put("topNews", topNews);
        tr.put("uploadedVideo", uploadedVideo);
        tr.put("description", description);
        tr.put("visits", visits);
        tr.put("crc", crc);
        tr.put("insertedTime", insertedTime);
        tr.put("generated", generated);
        //new fields
        tr.put("categoryName",categoryName);
        tr.put("videoTime",videoTime);
        tr.put("idTrending", idTrending);
        tr.put("generationTime", generationTime);
        tr.put("pubDateFormated", pubDateFormated);

        return tr;
    }

    public ObjectNode idToJson(){
        ObjectNode tr = Json.newObject();
        tr.put("id", externalId);
        return tr;
    }

    public static News getNews(long idNews){
        return finder.where().eq("id_news", idNews).findUnique();
    }

    public static List<News> getNewsByCategory(long idCategory){
        return finder.where().eq("id_category", idCategory).findList();
    }

    public static News getNewsByExtId(String id){
        return finder.where().eq("external_id", id).findUnique();
    }

    public static News getByCrc(String crc){
        return finder.where().eq("crc", crc).findUnique();
    }

    public static List<News> getNewsListById(ArrayList ids){
        //get news by ids, return existing
        return finder.all();
    }

    public static List<News> getNewsByCategoryAndGenerationDate(long idCategory, long generationDate){
        return finder.where().eq("id_category", idCategory).eq("generationTime", generationDate).findList();
    }

    public static List<News> getNewsByCategoriesAndGenerationDate(ArrayList<Long> idCategories, long generationDate){
        return finder.where().in("id_category", idCategories).eq("generationTime", generationDate).findList();
    }

    public static List<News> getNewsByDateAndNotPushed(long idCategory){
        return finder.where().eq("id_category", idCategory).eq("generationTime", 0).orderBy("pubDateFormated").findList();
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
        //check with externalId and crc
        News result = finder.where().or(
                Expr.eq("externalId", externalId),
                Expr.eq("crc", crc)
        ).findUnique();
        if (result != null){
            return true;
        }
        return false;
    }
}
