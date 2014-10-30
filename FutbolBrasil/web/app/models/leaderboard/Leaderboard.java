package models.leaderboard;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.Client;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.List;

/**
 * Created by chrirod on 10/30/14.
 */
public class Leaderboard extends HecticusModel{

    @Id
    private Long idLeaderboard;
    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;
    @Constraints.Required
    private Integer idTournament;

    private Integer score;

    public static Model.Finder<Integer, Leaderboard> finder = new Model.Finder<Integer, Leaderboard>(Integer.class, Leaderboard.class);

    public Leaderboard(Client client, Integer idTournament, Integer score) {
        this.client = client;
        this.idTournament = idTournament;
        this.score = score;
    }

    public static Leaderboard getLeaderboardByClientAndTournament(Integer idClient, Integer idTournament){
        return finder.where().eq("id_client", idClient).eq("id_tournament",idTournament).findUnique();
    }

    public static List<Leaderboard> getLeaderboardsByClient(Integer idClient){
        return finder.where().eq("id_client", idClient).orderBy("id_tournament").findList();
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode objNode = Json.newObject();
        objNode.put("id_leaderboard",idLeaderboard);
        objNode.put("client", client.toJsonWithoutRelations());
        objNode.put("id_tournament", idTournament);
        objNode.put("score", score);
        return objNode;
    }

    public ObjectNode toJsonClean() {
        ObjectNode objNode = Json.newObject();
        objNode.put("id_leaderboard",idLeaderboard);
        objNode.put("id_tournament", idTournament);
        objNode.put("score", score);
        return objNode;
    }
}
