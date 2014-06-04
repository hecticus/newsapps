package models.tvmaxfeeds;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.Expr;
import models.HecticusModel;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;
import utils.Utils;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by sorcerer on 5/14/14.
 */
@Entity
@Table(name="tvmax_news")
public class TvmaxNews extends HecticusModel {

    @Id
    private Long idNews;
    private Long externalId; //received_id
    private String title;
    private Boolean main;
    private String receivedDate;
    private String categoryName;
    private String category;
    private String category2;
    private String category3;
    private String category4;
    private String autorName;
    private String image;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String idCronicas;
    private String video;
    private String videoThumb;
    private Boolean statusTrending;
    private String trendingName;
    @Column(columnDefinition = "TEXT")
    private String fullstory;

    //resources
    @OneToMany(cascade= CascadeType.ALL)
    private List<Resource> resources;

    //autogenerated
    private String crc;
    private Long insertedTime;
    private Boolean generated;
    private Long generationTime; //tiempo que se usa para saber cuando se genero el push de la noticia. Formato: YYYYMMDD
    private Long pubDateFormated; //es el mismo pubDate pero con un formato que se puede ordenar YYYYMMDDhhmmss

    private static Model.Finder<Long,TvmaxNews> finder =
           new Model.Finder<Long, TvmaxNews>(Long.class, TvmaxNews.class);

    public TvmaxNews(){
        //contructor por defecto
    }

    public TvmaxNews(JsonNode data){
        //constructor con json
        if (data.has("id")) {
            externalId = Long.parseLong(data.get("id").asText());
        }
        title = data.get("titulo").asText();
        main = data.get("principal").asText().equalsIgnoreCase("si");
        receivedDate = data.get("fecha").asText();
        categoryName = data.get("categorianame").asText();
        category = data.get("categoria").asText();
        category2 = data.get("categoria2").asText();
        category3 = data.get("categoria3").asText();
        category4 = data.get("categoria4").asText();
        autorName = data.get("autorname").asText();
        image = data.get("imagen").asText();
        description = data.get("descripcion").asText();
        idCronicas = data.get("id_cronicas").asText();
        video = data.get("video").asText();
        videoThumb = data.get("video_thumb").asText();
        statusTrending = data.get("status_trending").asText().equalsIgnoreCase("si");
        trendingName = data.get("nombre_trending").asText();
        fullstory = data.get("fullstory").asText();

        //resources

        generated = false;
        crc = Utils.createMd5(title);
        insertedTime = Utils.currentTimeStamp(Utils.APP_TIMEZONE);
        generationTime = 0l;
        //pubDateFormated = Utils.formatDateLongFromStringNew("");

    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idNews",idNews); //local id
        tr.put("id", externalId);
        tr.put("titulo", decode(title));
        tr.put("principal", main);
        tr.put("fecha", receivedDate);
        tr.put("categoria", decode(category));
        tr.put("categoria2", decode(category2));
        tr.put("categoria3", decode(category3));
        tr.put("categoria4", decode(category4));
        tr.put("categorianame", decode(categoryName));
        tr.put("autorname", decode(autorName));
        tr.put("imagen", image);
        tr.put("descripcion", decode(description));
        tr.put("id_cronicas", idCronicas);
        tr.put("video", video);
        tr.put("video_thumb", videoThumb);
        tr.put("status_trending", statusTrending);
        tr.put("nombre_trending", trendingName);
        tr.put("fullstory", decode(fullstory));

//        if (resources.size()> 0){
//            ObjectNode hec = Json.newObject();
//            ArrayList<String> resized = new ArrayList<>();
//            ArrayList<String> extra = new ArrayList<>();
//            for (int i = 0; i < resources.size(); i++){
//                Resource temp = resources.get(i);
//                if (temp.getType() != null){
//                    if (temp.getType() == 1){
//                        //noting
//                        hec.put("originalimage", resources.get(i).generateUrl());
//                    }else if (temp.getType() == 2){
//                        resized.add(resources.get(i).generateUrl());
//                    }else{
//                        extra.add(resources.get(i).generateUrl());
//                    }
//                }
//            }
//
//            hec.put("resizedimage", Json.toJson((resized)));
//            hec.put("extraimages", Json.toJson((extra)));
//            tr.put("hecticus_img", hec);
//        }

        return tr;
    }

    /********************** bd funtions*******************************/

    public TvmaxNews getExistingNews(){
        return finder.where().eq("external_id", externalId).findUnique();
    }

    public static List<TvmaxNews> getNewsByCategory(String category, int page , int pageSize){
        return finder.where().eq("category", category)
                .orderBy("")
                .findPagingList(pageSize).getPage(page).getList();
    }

    public static List<TvmaxNews> getAllLimitedByCategory(String category){
        return finder.where().or(
                Expr.or(
                        Expr.eq("category",category),
                        Expr.eq("category2",category)
                ),
                Expr.or(
                        Expr.eq("category3",category),
                        Expr.eq("category4",category)
                )
                ).setMaxRows(MAX_SIZE).findList();
    }

    public static List<TvmaxNews> getAllLimitedByCategoryV2(String category){
        return finder.where().disjunction()
                .eq("category",category)
                .eq("category2",category)
                .eq("category3",category)
                .eq("category4",category)
                .eq("category",encode(category))
                .eq("category2",encode(category))
                .eq("category3",encode(category))
                .eq("category4",encode(category))
                .endJunction().orderBy("received_date desc").setMaxRows(MAX_SIZE).findList();
    }

    public static TvmaxNews getNewsById(String id){
        return finder.where()
                .eq("externalId",id)
               .orderBy("received_date desc").setMaxRows(1).findUnique();
    }

    public static List<TvmaxNews> getLatestLimited(){
        List<TvmaxNews> top = finder.where().eq("main", 1).orderBy("received_date desc").setMaxRows(MAIN_MAX_SIZE).findList();
        List<TvmaxNews> bottom = finder.where().eq("main", 0).orderBy("received_date desc").setMaxRows(OTHERS_MAX_SIZE).findList();
        top.addAll(bottom);
        bottom.clear();
        return top;
//        return finder.orderBy("received_date desc").setMaxRows(MAX_SIZE).findList();
    }

    public static void insertBatch(ArrayList<TvmaxNews> list) throws Exception {
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            for (int i =0; i < list.size(); i++){
                //if exist update or skip
                TvmaxNews current = list.get(i);
                TvmaxNews exist = current.getExistingNews();
                if (exist != null){
                    //set values
                    current.setIdNews(exist.idNews);
                    current.setGenerated(exist.getGenerated());
                    current.setInsertedTime(exist.getInsertedTime());
                    current.setGenerationTime(exist.getGenerationTime());
                    server.update(current);
                }else {
                    server.insert(current);
                    //also insert events
                }
            }
            server.commitTransaction();
        }catch (Exception ex){
            server.rollbackTransaction();
            throw ex;
        }finally {
            server.endTransaction();
        }

    }

    public static List<TvmaxNews> getAwesome(){
        return finder.orderBy("received_date desc").setMaxRows(MAX_SIZE).findList();
    }


    /********************** getters and setters **********************/

    public Long getIdNews() {
        return idNews;
    }

    public void setIdNews(Long idNews) {
        this.idNews = idNews;
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getMain() {
        return main;
    }

    public void setMain(Boolean main) {
        this.main = main;
    }

    public String getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(String receivedDate) {
        this.receivedDate = receivedDate;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategory2() {
        return category2;
    }

    public void setCategory2(String category2) {
        this.category2 = category2;
    }

    public String getCategory3() {
        return category3;
    }

    public void setCategory3(String category3) {
        this.category3 = category3;
    }

    public String getCategory4() {
        return category4;
    }

    public void setCategory4(String category4) {
        this.category4 = category4;
    }

    public String getAutorName() {
        return autorName;
    }

    public void setAutorName(String autorName) {
        this.autorName = autorName;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIdCronicas() {
        return idCronicas;
    }

    public void setIdCronicas(String idCronicas) {
        this.idCronicas = idCronicas;
    }

    public String getVideo() {
        return video;
    }

    public void setVideo(String video) {
        this.video = video;
    }

    public String getVideoThumb() {
        return videoThumb;
    }

    public void setVideoThumb(String videoThumb) {
        this.videoThumb = videoThumb;
    }

    public Boolean getStatusTrending() {
        return statusTrending;
    }

    public void setStatusTrending(Boolean statusTrending) {
        this.statusTrending = statusTrending;
    }

    public String getTrendingName() {
        return trendingName;
    }

    public void setTrendingName(String trendingName) {
        this.trendingName = trendingName;
    }

    public String getFullstory() {
        return fullstory;
    }

    public void setFullstory(String fullstory) {
        this.fullstory = fullstory;
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
}
