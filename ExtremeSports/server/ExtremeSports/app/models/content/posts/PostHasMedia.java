package models.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.Wistia;
import models.HecticusModel;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.content.athletes.Athlete;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;
import scala.Tuple2;
import scala.collection.JavaConversions;
import scala.collection.mutable.Buffer;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="post_has_media")
public class PostHasMedia extends HecticusModel {

    @Id
    private Integer idPostHasMedia;

    @ManyToOne
    @JoinColumn(name = "id_post")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "id_file_type")
    private FileType fileType;

    @Constraints.Required
    private String md5;

    @Constraints.Required
    private String link;

    private Integer width;

    private Integer height;

    private String wistiaId;

    @Column(columnDefinition = "TEXT")
    private String wistiaPlayer;

    public static Model.Finder<Integer, PostHasMedia> finder = new Model.Finder<Integer, PostHasMedia>(Integer.class, PostHasMedia.class);

    public PostHasMedia(Post post, FileType fileType, String md5, String link, Integer mainScreen, Integer width, Integer height) {
        this.post = post;
        this.fileType = fileType;
        this.md5 = md5;
        this.link = link;
        this.width = width;
        this.height = height;
    }

    public PostHasMedia(Post post, FileType fileType) {
        this.post = post;
        this.fileType = fileType;
    }

    public void setIdPostHasMedia(Integer idPostHasMedia) {
        this.idPostHasMedia = idPostHasMedia;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public FileType getFileType() {
        return fileType;
    }

    public void setFileType(FileType fileType) {
        this.fileType = fileType;
    }

    public Integer getIdPostHasMedia() {
        return idPostHasMedia;
    }

    public String getMd5() {
        return md5;
    }

    public void setMd5(String md5) {
        this.md5 = md5;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public String getWistiaId() {
        return wistiaId;
    }

    public void setWistiaId(String wistiaId) {
        this.wistiaId = wistiaId;
    }

    public String getWistiaPlayer() {
        return wistiaPlayer;
    }

    public void setWistiaPlayer(String wistiaPlayer) {
        this.wistiaPlayer = wistiaPlayer;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_media", idPostHasMedia);
        response.put("post", post.toJsonWithoutRelations());
        response.put("file_type", fileType.toJsonWithoutRelations());
        response.put("md5", md5);
        response.put("link", link);
        response.put("width", width);
        response.put("height", height);
        updateWistiaPlayer();
        response.put("wistia_player", wistiaPlayer);
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_media", idPostHasMedia);
        response.put("md5", md5);
        response.put("link", link);
        response.put("width", width);
        response.put("height", height);
        updateWistiaPlayer();
        response.put("wistia_player", wistiaPlayer);
        return response;
    }

    public ObjectNode toJsonWithoutPost() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_media", idPostHasMedia);
        response.put("file_type", fileType.toJsonWithoutRelations());
        response.put("md5", md5);
        response.put("link", link);
        response.put("width", width);
        response.put("height", height);
        updateWistiaPlayer();
        response.put("wistia_player", wistiaPlayer);
        return response;
    }

    public void updateWistiaPlayer(){
        if(!(wistiaPlayer != null && !wistiaPlayer.isEmpty()) && (wistiaId != null && !wistiaId.isEmpty())){
            ObjectNode videoData = Wistia.getVideo(wistiaId);
            if(videoData != null && videoData.has("embedCode")) {
                wistiaPlayer = videoData.get("embedCode").asText();
                this.update();
            }
        }
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<PostHasMedia> postHasMedias = PostHasMedia.finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(PostHasMedia postHasMedia : postHasMedias) {
            Tuple2<String, String> t = new Tuple2<>(postHasMedia.getIdPostHasMedia().toString(), postHasMedia.getLink());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> postHasMediaBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> postHasMediaList = postHasMediaBuffer.toList();
        return postHasMediaList;
    }


    public static Iterator<PostHasMedia> getMedia(Athlete athlete, Category category, Country country, Language language, int postId, boolean onlyMedia, boolean newest){
        Iterator<PostHasMedia> iterator = null;
        ArrayList<Athlete> athletesToCompare = null;
        if(athlete != null){
            athletesToCompare = new ArrayList<>();
            athletesToCompare.add(athlete);
        }
        int maxRows = Config.getInt("media-to-deliver");
        if(onlyMedia){
            maxRows = 1;
        }
        if(postId > 0) {
            if(athlete != null) {
                if (newest) {
                    iterator = finder.fetch("post.countries").fetch("post.localizations").fetch("post.athletes").where().gt("post.idPost", postId).eq("post.athletes.athlete", athlete).eq("post.countries.country", country).eq("post.localizations.language", language).setMaxRows(maxRows).orderBy("rand()").findList().iterator();
                } else {
                    iterator = finder.fetch("post.countries").fetch("post.localizations").fetch("post.athletes").where().lt("post.idPost", postId).eq("post.athletes.athlete", athlete).eq("post.countries.country", country).eq("post.localizations.language", language).setMaxRows(maxRows).orderBy("rand()").findList().iterator();
                }
            } else if (category != null){
                if (newest) {
                    iterator = finder.fetch("post.countries").fetch("post.localizations").fetch("post.categories").where().gt("post.idPost", postId).eq("post.categories.category", category).eq("post.countries.country", country).eq("post.localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("rand()").findList().iterator();
                } else {
                    iterator = finder.fetch("post.countries").fetch("post.localizations").fetch("post.categories").where().lt("post.idPost", postId).eq("post.categories.category", category).eq("post.countries.country", country).eq("post.localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("rand()").findList().iterator();
                }
            } else {
                if (newest) {
                    iterator = finder.fetch("post.countries").fetch("post.localizations").where().gt("post.idPost", postId).eq("post.countries.country", country).eq("post.localizations.language", language).setMaxRows(maxRows).orderBy("rand()").findList().iterator();
                } else {
                    iterator = finder.fetch("post.countries").fetch("post.localizations").where().lt("post.idPost", postId).eq("post.countries.country", country).eq("post.localizations.language", language).setMaxRows(maxRows).orderBy("rand()").findList().iterator();
                }
            }
        } else {
            if(athlete != null) {
                iterator = finder.fetch("post.countries").fetch("post.localizations").fetch("post.athletes").where().eq("post.athletes.athlete", athlete).eq("post.countries.country", country).eq("post.localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("rand()").findList().iterator();
            } else if (category != null){
                iterator = finder.fetch("post.countries").fetch("post.localizations").fetch("post.categories").where().eq("post.categories.category", category).eq("post.countries.country", country).eq("post.localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("rand()").findList().iterator();
            } else {
                iterator = finder.fetch("post.countries").fetch("post.localizations").where().eq("post.countries.country", country).eq("post.localizations.language", language).setFirstRow(0).setMaxRows(maxRows).orderBy("rand()").findList().iterator();
            }
        }

        return iterator;
    }
}
