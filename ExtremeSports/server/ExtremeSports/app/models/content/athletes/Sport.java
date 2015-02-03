package models.content.athletes;

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
@Table(name="sports")
public class Sport extends HecticusModel {

    @Id
    private Integer idSport;
    @Constraints.Required
    private String name;

    @OneToMany(mappedBy="sport", cascade = CascadeType.ALL)
    private List<AthleteHasSport> athletes;

    public static Model.Finder<Integer, Sport> finder = new Model.Finder<Integer, Sport>(Integer.class, Sport.class);

    public Sport(String name) {
        this.name = name;
    }

    public Integer getIdSport() {
        return idSport;
    }

    public void setIdSport(Integer idSport) {
        this.idSport = idSport;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<AthleteHasSport> getAthletes() {
        return athletes;
    }

    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_sport", idSport);
        response.put("name", name);
        if(athletes != null && !athletes.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(AthleteHasSport ad : athletes){
                apps.add(ad.toJsonWithoutCategory());
            }
            response.put("athletes", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_sport", idSport);
        response.put("name", name);
        return response;
    }

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        List<Sport> sports = finder.where().findList();
        for(Sport c: sports) {
            options.put(c.getIdSport().toString(), c.getName());
        }
        return options;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<Sport> sports = Sport.finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(Sport sport : sports) {
            Tuple2<String, String> t = new Tuple2<>(sport.getIdSport().toString(), sport.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> sportBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> sportList = sportBuffer.toList();
        return sportList;
    }

    public static Page<Sport> page(int page, int pageSize, String sortBy, String order, String filter) {
        return finder.where().ilike("name", "%" + filter + "%").orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
    }
}
