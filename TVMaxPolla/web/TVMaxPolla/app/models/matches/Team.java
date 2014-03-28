package models.matches;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chrirod on 3/27/14.
 */
@Entity
@Table(name="team")
public class Team extends HecticusModel{

    @Id
    private Integer idTeam;
    private String name;
    private String shortname;
    private String flagFile;

    public Team(){
        //por defecto
    }

    public static Model.Finder<Integer,Team> finder =
            new Model.Finder<Integer, Team>(Integer.class, Team.class);

    public ObjectNode toJson(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idTeam);
        tr.put("name",name);
        tr.put("shortName",shortname);
        tr.put("flag_file",flagFile);
        return tr;
    }

    public static Team getTeam(int idTeam){
        return finder.where().eq("id_team", idTeam).findUnique();
    }

    public static List<Team> getAllTeams(){
        return finder.all();
    }
}
