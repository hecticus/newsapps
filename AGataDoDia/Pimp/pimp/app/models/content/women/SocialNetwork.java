package models.content.women;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.ClientHasDevices;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

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
    private List<WomanHasSocialNetwork> women;

    public static Model.Finder<Integer, SocialNetwork> finder = new Model.Finder<Integer, SocialNetwork>(Integer.class, SocialNetwork.class);

    public SocialNetwork(String name, String home) {
        this.name = name;
        this.home = home;
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
        if(women != null && !women.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(WomanHasSocialNetwork ad : women){
                apps.add(ad.toJsonWithoutSocialNetwork());
            }
            response.put("devices", Json.toJson(apps));
        }
        return response;
    }

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        List<SocialNetwork> socialNetworks = SocialNetwork.finder.all();
        for(SocialNetwork sn: socialNetworks) {
            options.put(sn.getIdSocialNetwork().toString(), sn.getName());
        }
        return options;
    }
}
