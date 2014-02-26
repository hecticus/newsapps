package models.news;

import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.List;

@Entity
@Table(name="news")
public class News extends HecticusModel{

    @Id
    private long idNews;
    private int externalId;
    private String author;
    private String pubDate;
    private String category;
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

    public static Model.Finder<Long,News> find =
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

    public static List<News> getNews(){
        return find.all();
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("id",idNews);
        tr.put("externalId", externalId);
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

        return tr;
    }
}
