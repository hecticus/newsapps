package models.content.themes;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="theme_has_social_network")
public class ThemeHasSocialNetwork extends HecticusModel {

    @Id
    private Integer idThemeHasSocialNetwork;

    @ManyToOne
    @JoinColumn(name = "id_theme")
    private Theme theme;

    @ManyToOne
    @JoinColumn(name = "id_social_network")
    private SocialNetwork socialNetwork;

    @Constraints.Required
    private String link;

    public static Model.Finder<Integer, ThemeHasSocialNetwork> finder = new Model.Finder<Integer, ThemeHasSocialNetwork>(Integer.class, ThemeHasSocialNetwork.class);

    public ThemeHasSocialNetwork(Theme theme, SocialNetwork socialNetwork, String link) {
        this.theme = theme;
        this.socialNetwork = socialNetwork;
        this.link = link;
    }

    public Integer getIdThemeHasSocialNetwork() {
        return idThemeHasSocialNetwork;
    }

    public void setIdThemeHasSocialNetwork(Integer idThemeHasSocialNetwork) {
        this.idThemeHasSocialNetwork = idThemeHasSocialNetwork;
    }

    public Theme getTheme() {
        return theme;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    public SocialNetwork getSocialNetwork() {
        return socialNetwork;
    }

    public void setSocialNetwork(SocialNetwork socialNetwork) {
        this.socialNetwork = socialNetwork;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_theme_has_social_network", idThemeHasSocialNetwork);
        response.put("theme", theme.toJsonWithoutRelations());
        response.put("social_network", socialNetwork.toJson());
        response.put("link", link);
        return response;
    }

    public ObjectNode toJsonWithoutWoman() {
        ObjectNode response = Json.newObject();
        response.put("id_theme_has_social_network", idThemeHasSocialNetwork);
        response.put("social_network", socialNetwork.toJson());
        response.put("link", link);
        return response;
    }

    public ObjectNode toJsonWithoutSocialNetwork() {
        ObjectNode response = Json.newObject();
        response.put("id_theme_has_social_network", idThemeHasSocialNetwork);
        response.put("theme", theme.toJsonWithoutRelations());
        response.put("link", link);
        return response;
    }
}
