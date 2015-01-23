package models.football;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by plesse on 1/20/15.
 */
@Entity
@Table(name="game_match_status", uniqueConstraints = @UniqueConstraint(columnNames = {"extId"}))
public class GameMatchStatus extends HecticusModel {

    @Id
    private Integer idGameMatchStatus;
    private String name;
    private Integer extId;

    @OneToMany(mappedBy = "status")
    private List<GameMatch> matches;

    private static Model.Finder<Integer,GameMatchStatus> finder = new Model.Finder<Integer,GameMatchStatus>(Integer.class,GameMatchStatus.class);

    public GameMatchStatus(String name, Integer extId) {
        this.name = name;
        this.extId = extId;
    }

    public Integer getIdGameMatchStatus() {
        return idGameMatchStatus;
    }

    public void setIdGameMatchStatus(Integer idGameMatchStatus) {
        this.idGameMatchStatus = idGameMatchStatus;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getExtId() {
        return extId;
    }

    public void setExtId(Integer extId) {
        this.extId = extId;
    }

    public List<GameMatch> getMatches() {
        return matches;
    }

    public void setMatches(List<GameMatch> matches) {
        this.matches = matches;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode node = Json.newObject();
        node.put("id_status", extId);
        node.put("name", name);
        return node;
    }

    public void validate() {
        GameMatchStatus tr = finder.where().eq("extId",extId).findUnique();
        if (tr != null) {
            //existe
            this.idGameMatchStatus = tr.idGameMatchStatus;
            this.name = tr.name;
            this.extId = tr.extId;
        } else {
            this.save();
        }
    }
}
