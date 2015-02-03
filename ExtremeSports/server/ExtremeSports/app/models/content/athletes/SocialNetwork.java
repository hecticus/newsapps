package models.content.athletes;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;
import scala.Tuple2;
import scala.collection.JavaConversions;
import scala.collection.mutable.Buffer;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="social_networks")
public class SocialNetwork extends HecticusModel{

    @Id
    private Integer idSocialNetwork;

    @Constraints.Required
    private String name;

    @Constraints.Required
    private String home;

    @OneToMany(mappedBy="socialNetwork")
    private List<AthleteHasSocialNetwork> theme;

    public static Model.Finder<Integer, SocialNetwork> finder = new Model.Finder<Integer, SocialNetwork>(Integer.class, SocialNetwork.class);

    public SocialNetwork(String name, String home) {
        this.name = name;
        this.home = home;
    }

    public void setIdSocialNetwork(Integer idSocialNetwork) {
        this.idSocialNetwork = idSocialNetwork;
    }

    public Integer getIdSocialNetwork() {
        return idSocialNetwork;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHome() {
        return home;
    }

    public void setHome(String home) {
        this.home = home;
    }

    public List<AthleteHasSocialNetwork> getTheme() {
        return theme;
    }

    public void setThemes(List<AthleteHasSocialNetwork> theme) {
        this.theme = theme;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_social_network", idSocialNetwork);
        response.put("name", name);
        response.put("home", home);
        return response;
    }

    public ObjectNode toJsonWithWomen() {
        ObjectNode response = Json.newObject();
        response.put("id_social_network", idSocialNetwork);
        response.put("name", name);
        response.put("home", home);
        if(theme != null && !theme.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(AthleteHasSocialNetwork ad : theme){
                apps.add(ad.toJsonWithoutSocialNetwork());
            }
            response.put("devices", Json.toJson(apps));
        }
        return response;
    }

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<>();
        List<SocialNetwork> socialNetworks = SocialNetwork.finder.all();
        for(SocialNetwork sn: socialNetworks) {
            options.put(sn.getIdSocialNetwork().toString(), sn.getName());
        }
        return options;
    }

    public static scala.collection.immutable.List<Tuple2<String, String>> toSeq() {
        List<SocialNetwork> socialNetworks = SocialNetwork.finder.all();
        ArrayList<Tuple2<String, String>> proxy = new ArrayList<>();
        for(SocialNetwork socialNetwork : socialNetworks) {
            Tuple2<String, String> t = new Tuple2<>(socialNetwork.getIdSocialNetwork().toString(), socialNetwork.getName());
            proxy.add(t);
        }
        Buffer<Tuple2<String, String>> socialNetworkBuffer = JavaConversions.asScalaBuffer(proxy);
        scala.collection.immutable.List<Tuple2<String, String>> socialNetworkList = socialNetworkBuffer.toList();
        return socialNetworkList;
    }

//    public static List<SocialNetwork> options() {
//        List<SocialNetwork> socialNetworks = SocialNetwork.finder.all();
//        return socialNetworks;
//    }
}
