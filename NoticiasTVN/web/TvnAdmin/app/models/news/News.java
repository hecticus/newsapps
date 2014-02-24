package models.news;

import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="news")
public class News extends Model{

    @Id
    public long idNews;
    public String author;
    public String pubDate;
    public String category;
    //category
    public String image;
    public String imageCaption;
    public String videoUrl;
    public String title;
    public boolean topNews;
    public String uploadedVideo;
    public String description;
    public int visits;
    public String crc;
    public String insertedTime;

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
}
