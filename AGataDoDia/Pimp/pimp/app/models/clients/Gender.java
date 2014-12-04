package models.clients;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.content.posts.Post;
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
 * Created by plesse on 12/4/14.
 */
@Entity
@Table(name="genders")
public class Gender extends HecticusModel {

    @Id
    private Integer idGender;
    @Constraints.Required
    private String name;

    @OneToMany(mappedBy="gender", cascade = CascadeType.ALL)
    private List<Post> posts;

    @OneToMany(mappedBy="gender")
    private List<Client> clients;

    public static Model.Finder<Integer, Gender> finder = new Model.Finder<Integer, Gender>(Integer.class, Gender.class);

    public Gender(String name) {
        this.name = name;
    }

    public Integer getIdGender() {
        return idGender;
    }

    public void setIdGender(Integer idGender) {
        this.idGender = idGender;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public List<Client> getClients() {
        return clients;
    }

    public void setClients(List<Client> clients) {
        this.clients = clients;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_gender", idGender);
        response.put("name", name);
        return response;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<Gender> genders = finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(Gender gender : genders) {
            Tuple2<String, String> t = new Tuple2<>(gender.getIdGender().toString(), gender.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> genderBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> genderList = genderBuffer.toList();
        return genderList;
    }
}
