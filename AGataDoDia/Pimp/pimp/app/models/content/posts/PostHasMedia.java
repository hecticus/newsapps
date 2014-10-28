package models.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;
import scala.Tuple2;
import scala.collection.JavaConversions;
import scala.collection.mutable.Buffer;

import javax.persistence.*;
import java.util.ArrayList;
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

    @Constraints.Required
    private Integer mainScreen;

    public static Model.Finder<Integer, PostHasMedia> finder = new Model.Finder<Integer, PostHasMedia>(Integer.class, PostHasMedia.class);

    public PostHasMedia(Post post, FileType fileType, String md5, String link, int mainScreen) {
        this.post = post;
        this.fileType = fileType;
        this.md5 = md5;
        this.link = link;
        this.mainScreen = mainScreen;
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

    public Integer getMainScreen() {
        return mainScreen;
    }

    public void setMainScreen(Integer mainScreen) {
        this.mainScreen = mainScreen;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_media", idPostHasMedia);
        response.put("post", post.toJsonWithoutRelations());
        response.put("file_type", fileType.toJsonWithoutRelations());
        response.put("md5", md5);
        response.put("link", link);
        response.put("main_screen", mainScreen);
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_media", idPostHasMedia);
        response.put("md5", md5);
        response.put("link", link);
        response.put("main_screen", mainScreen);
        return response;
    }

    public ObjectNode toJsonWithoutPost() {
        ObjectNode response = Json.newObject();
        response.put("id_post_has_media", idPostHasMedia);
        response.put("file_type", fileType.toJsonWithoutRelations());
        response.put("md5", md5);
        response.put("link", link);
        response.put("main_screen", mainScreen);
        return response;
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
}
