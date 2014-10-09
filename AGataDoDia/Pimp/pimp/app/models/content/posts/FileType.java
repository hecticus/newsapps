package models.content.posts;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.ClientHasWoman;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

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
}
