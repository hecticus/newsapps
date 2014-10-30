package models.leaderboard;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.Client;
import play.data.validation.Constraints;
import play.libs.Json;

import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * Created by chrirod on 10/30/14.
 */
public class LeaderboardGlobal extends HecticusModel{

    @Id
    private Long idLeaderboardGlobal;
    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    private Integer score;

    public static Finder<Integer, LeaderboardGlobal> finder = new Finder<Integer, LeaderboardGlobal>(Integer.class, LeaderboardGlobal.class);

    public LeaderboardGlobal(Client client, Integer score) {
        this.client = client;
        this.score = score;
    }

    public static LeaderboardGlobal getLeaderboardByClient(Integer idClient){
        return finder.where().eq("id_client", idClient).findUnique();
    }


    @Override
    public ObjectNode toJson() {
        ObjectNode objNode = Json.newObject();
        objNode.put("id_leaderboard_global",idLeaderboardGlobal);
        objNode.put("client", client.toJsonWithoutRelations());
        objNode.put("score", score);
        return objNode;
    }
}
