package models.content.themes;

import com.avaje.ebean.Page;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="categories")
public class Category extends HecticusModel {

    @Id
    private Integer idCategory;
    @Constraints.Required
    private String name;

    @OneToMany(mappedBy="category", cascade = CascadeType.ALL)
    private List<ThemeHasCategory> women;

    public static Model.Finder<Integer, Category> finder = new Model.Finder<Integer, Category>(Integer.class, Category.class);

    public Category(String name) {
        this.name = name;
    }

    public Integer getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Integer idCategory) {
        this.idCategory = idCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ThemeHasCategory> getWomen() {
        return women;
    }

    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_category", idCategory);
        response.put("name", name);
        if(women != null && !women.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(ThemeHasCategory ad : women){
                apps.add(ad.toJsonWithoutCategory());
            }
            response.put("themes", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_category", idCategory);
        response.put("name", name);
        return response;
    }

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        List<Category> categories = finder.where().findList();
        for(Category c: categories) {
            options.put(c.getIdCategory().toString(), c.getName());
        }
        return options;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<Category> categories = Category.finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(Category category : categories) {
            Tuple2<String, String> t = new Tuple2<>(category.getIdCategory().toString(), category.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> categoryBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> categoryList = categoryBuffer.toList();
        return categoryList;
    }

    public static Page<Category> page(int page, int pageSize, String sortBy, String order, String filter) {
        return finder.where().ilike("name", "%" + filter + "%").orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
    }
}
