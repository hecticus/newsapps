package models.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.ClientHasWoman;
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
@Table(name="file_types")
public class FileType extends HecticusModel {

    @Id
    private Integer idFileType;

    @Constraints.Required
    private String name;

    @Constraints.Required
    private String mimeType;

    @OneToMany(mappedBy="fileType", cascade = CascadeType.ALL)
    private List<PostHasMedia> media;

    public static Model.Finder<Integer, FileType> finder = new Model.Finder<Integer, FileType>(Integer.class, FileType.class);

    public FileType(String name, String mimeType) {
        this.name = name;
        this.mimeType = mimeType;
    }

    public Integer getIdFileType() {
        return idFileType;
    }

    public void setIdFileType(Integer idFileType) {
        this.idFileType = idFileType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_file_type", idFileType);
        response.put("name", name);
        response.put("mime_type", mimeType);
        if(media != null && !media.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(PostHasMedia ad : media){
                apps.add(ad.toJsonWithoutRelations());
            }
            response.put("files", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_file_type", idFileType);
        response.put("name", name);
        response.put("mime_type", mimeType);
        return response;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<FileType> fileTypes = finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(FileType fileType : fileTypes) {
            Tuple2<String, String> t = new Tuple2<>(fileType.getIdFileType().toString(), fileType.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> fileTypeBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> fileTypeList = fileTypeBuffer.toList();
        return fileTypeList;
    }
}
