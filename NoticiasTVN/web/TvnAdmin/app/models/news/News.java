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

import javax.persistence.*;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="news")
public class News extends HecticusModel{

    @Id
    private Long idNews;
    @Column(columnDefinition = "TEXT")
    private String body;
    private String categories; //external categories
    private String pubDate; //date
    private Boolean featured;
    private String firstVideo;
    //hit counter not used
    private Integer externalId; //id de la noticia externo
    private String image;
    private String portalImage;
    @Column(columnDefinition = "TEXT")
    private String portalImageDesc;
    private String pubTime;
    private Boolean pushNotifications;
    private String secondVideo;
    private int size;
    //private String startDate;
    private String title;
    private String url;
    private Long idTrending;

    //hecticus fields
    private Long idCategory; //local id category

    //auto generated
    private String crc;
    private Long insertedTime;
    private Boolean generated;
    private Long generationTime; //tiempo que se usa para saber cuando se genero el push de la noticia. Formato: YYYYMMDD
    private Long pubDateFormated; //es el mismo pubDate pero con un formato que se puede ordenar YYYYMMDDhhmmss

    //hecticus images resources
    @OneToMany (cascade=CascadeType.ALL)
    private List<Resource> resources;

    public News(JsonNode data) throws UnsupportedEncodingException, NewsException {
        //contruct obj from json
        if (data.has("Body")) {
            body = data.get("Body").asText();
        } else {
            throw new NewsException("body faltante");
        }

        if (data.has("Categories")) {
            categories = data.get("Categories").asText();
        } else {
            throw new NewsException("categories faltante");
        }

        if (data.has("Date")) {
            pubDate = data.get("Date").asText();
            pubDateFormated = Utils.formatDateLongFromStringNew(pubDate);
        } else {
            throw new NewsException("Date faltante");
        }

        if (data.has("Destacada")) {
            featured = data.get("Destacada").asBoolean();
        } else {
            throw new NewsException("Destacada faltante");
        }

        if (data.has("FirstVideo")) {
            firstVideo = data.get("FirstVideo").asText();
        } else {
            throw new NewsException("FirstVideo faltante");
        }

        //hitCounter not used

        if (data.has("ID")) {
            externalId = data.get("ID").asInt();
        } else {
            throw new NewsException("externalId faltante");
        }

        if (data.has("Image")) {
            image = data.get("Image").asText();
        } else {
            throw new NewsException("image faltante");
        }

        if (data.has("PortalImage")) {
            portalImage = data.get("PortalImage").asText();
        } else {
            throw new NewsException("PortalImage faltante");
        }

        if (data.has("PortalImageDescription")) {
            portalImageDesc = data.get("PortalImageDescription").asText();
        } else {
            throw new NewsException("PortalImageDescription faltante");
        }

        if (data.has("PublishingDateTime")) {
            pubTime = data.get("PublishingDateTime").asText();
        } else {
            throw new NewsException("PublishingDateTime faltante");
        }

        if (data.has("PushNotifications")) {
            pushNotifications = data.get("PushNotifications").asBoolean();
        } else {
            throw new NewsException("PushNotifications faltante");
        }

        if (data.has("SecondVideo")) {
            secondVideo = data.get("SecondVideo").asText();
        } else {
            throw new NewsException("secondVideo faltante");
        }

        //size
        //startDate

        if (data.has("Title")) {
            title = data.get("Title").asText();
        } else {
            throw new NewsException("Title faltante");
        }

        if (data.has("URL")) {
            url = data.get("URL").asText();
        } else {
            throw new NewsException("URL faltante");
        }

        if (data.has("idCategory")) {
            idCategory = data.get("idCategory").asLong();
        }

        if (data.has("resources")){

        }

        if (data.has("idTrending")){
            idTrending = data.get("idTrending").asLong();
        }

        //auto generated values
        generated = false;
        crc = Utils.createMd5(title);
        insertedTime = Utils.currentTimeStamp(Utils.APP_TIMEZONE);
        //0 nunca se ha generado
        generationTime = 0l;
    }

    public News(){
        //por defecto
    }

    public static Model.Finder<Long,News> finder =
            new Model.Finder<Long, News>(Long.class, News.class);


    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("id",idNews); //local id
        tr.put("Body", body);
        tr.put("Categories",categories);
        tr.put("Date" , pubDate);
        tr.put("Destacada", featured);
        tr.put("FirstVideo", firstVideo);
        //hit counter
        tr.put("ID", externalId);
        tr.put("Image", image);
        tr.put("PortalImage", portalImage);
        tr.put("PortalImageDescription", portalImageDesc);
        tr.put("PublishingDateTime", pubTime);
        tr.put("PushNotifications", pushNotifications);
        tr.put("SecondVideo", secondVideo);
        tr.put("Size", size);
        //tr.put("StartDate", null);
        tr.put("Title", title);
        tr.put("URL", url);

        tr.put("idCategory",idCategory); //local id
        tr.put("crc", crc);
        tr.put("insertedTime", insertedTime);
        tr.put("generated", generated);

        //images

        //tr.put("hecticus_img",CDN_URL + justImageName());

        return tr;
    }

    public ObjectNode toJsonTVN() {
        ObjectNode tr = Json.newObject();
        tr.put("id",idNews); //local id
        tr.put("Body", decode(body));
        tr.put("Categories",decode(categories));
        tr.put("Date" , pubDate);
        tr.put("Destacada", featured);
        tr.put("FirstVideo", firstVideo);
        //hit counter
        tr.put("ID", externalId);
        tr.put("Image", decode(image));
        tr.put("PortalImage", decode(portalImage));
        tr.put("PortalImageDescription", decode(portalImageDesc));
        tr.put("PublishingDateTime", pubTime);
        tr.put("PushNotifications", pushNotifications);
        tr.put("SecondVideo", secondVideo);
        tr.put("Size", size);
        //tr.put("StartDate", null);
        tr.put("Title", decode(title));
        tr.put("URL", decode(url));
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

    public static List<News> getNewsByCategoryAndGenerationDate(long idCategory, long generationDate){
        return finder.where().eq("id_category", idCategory).eq("generation_time", generationDate).findList();
    }

    public static int getNewsByCategoriesAndGenerationDate(ArrayList<Long> idCategories, long generationDate){
        return finder.where().in("id_category", idCategories).eq("generationTime", generationDate).findRowCount();
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
        return finder.where().eq("id_trending", id ).findList();
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



    /**************************** GETTERS AND SETTERS ****************************************************/

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getCategories() {
        return categories;
    }

    public void setCategories(String categories) {
        this.categories = categories;
    }

    public String getPubDate() {
        return pubDate;
    }

    public void setPubDate(String pubDate) {
        this.pubDate = pubDate;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public String getFirstVideo() {
        return firstVideo;
    }

    public void setFirstVideo(String firstVideo) {
        this.firstVideo = firstVideo;
    }

    public Integer getExternalId() {
        return externalId;
    }

    public void setExternalId(Integer externalId) {
        this.externalId = externalId;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getPortalImage() {
        return portalImage;
    }

    public void setPortalImage(String portalImage) {
        this.portalImage = portalImage;
    }

    public String getPortalImageDesc() {
        return portalImageDesc;
    }

    public void setPortalImageDesc(String portalImageDesc) {
        this.portalImageDesc = portalImageDesc;
    }

    public String getPubTime() {
        return pubTime;
    }

    public void setPubTime(String pubTime) {
        this.pubTime = pubTime;
    }

    public Boolean getPushNotifications() {
        return pushNotifications;
    }

    public void setPushNotifications(Boolean pushNotifications) {
        this.pushNotifications = pushNotifications;
    }

    public String getSecondVideo() {
        return secondVideo;
    }

    public void setSecondVideo(String secondVideo) {
        this.secondVideo = secondVideo;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Long getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Long idCategory) {
        this.idCategory = idCategory;
    }

    public String getCrc() {
        return crc;
    }

    public void setCrc(String crc) {
        this.crc = crc;
    }

    public Long getInsertedTime() {
        return insertedTime;
    }

    public void setInsertedTime(Long insertedTime) {
        this.insertedTime = insertedTime;
    }

    public Boolean getGenerated() {
        return generated;
    }

    public void setGenerated(Boolean generated) {
        this.generated = generated;
    }

    public Long getGenerationTime() {
        return generationTime;
    }

    public void setGenerationTime(Long generationTime) {
        this.generationTime = generationTime;
    }

    public Long getPubDateFormated() {
        return pubDateFormated;
    }

    public void setPubDateFormated(Long pubDateFormated) {
        this.pubDateFormated = pubDateFormated;
    }

    public Long getIdNews() {
        return idNews;
    }

    public void setIdNews(Long idNews) {
        this.idNews = idNews;
    }
}
