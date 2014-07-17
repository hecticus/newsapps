package models.matches;

import models.HecticusModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.List;

/**
 * Created by chrirod on 3/27/14.
 */
@Entity
@Table(name="group_has_team")
public class GroupHasTeam extends HecticusModel{
    @Id
    private Integer idGroupHasTeam;
    private Integer idGroup;
    private Integer idTeam;

    public GroupHasTeam(){
        //por defecto
    }

    public static Model.Finder<Integer,GroupHasTeam> finder =
            new Model.Finder<Integer, GroupHasTeam>(Integer.class, GroupHasTeam.class);

    public ObjectNode toJson(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idGroupHasTeam);
        tr.put("id_group", idGroup);
        tr.put("id_team", idTeam);
        return tr;
    }

    public static List<GroupHasTeam> getTeamsForGroup(int idGroup){
        return finder.where().eq("id_group", idGroup).findList();
    }

    public static List<GroupHasTeam> getAllGroupsHasTeams(){
        return finder.all();
    }
}
