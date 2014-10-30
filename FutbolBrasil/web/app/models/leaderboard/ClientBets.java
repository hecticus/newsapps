package models.leaderboard;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.clients.Client;
import play.data.validation.Constraints;
import play.libs.Json;

import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.List;

/**
 * Created by chrirod on 10/30/14.
 */
public class ClientBets extends HecticusModel{

    @Id
    private Long idClientBets;
    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;
    @Constraints.Required
    private Integer idTournament;
    @Constraints.Required
    private Integer idGameMatch;

    private Integer clientBet;
    private Integer status;

    public static Finder<Integer, ClientBets> finder = new Finder<Integer, ClientBets>(Integer.class, ClientBets.class);

    public ClientBets(Client client, Integer idTournament, Integer idGameMatch, Integer clientBet, Integer status) {
        this.client = client;
        this.idTournament = idTournament;
        this.idGameMatch = idGameMatch;
        this.clientBet = clientBet;
        this.status = status;
    }

    public static ClientBets getClientBetForMatch(Integer idClient, Integer idTournament, Integer idGameMatch){
        return finder.where().eq("id_client", idClient).eq("id_tournament", idTournament).eq("id_game_match", idGameMatch).findUnique();
    }

    public static List<ClientBets> getClientBetsForTournament(Integer idClient, Integer idTournament){
        return finder.where().eq("id_client", idClient).eq("id_tournament", idTournament).orderBy("id_tournament").findList();
    }

    public static List<ClientBets> getAllClientBets(Integer idClient){
        return finder.where().eq("id_client", idClient).orderBy("id_tournament").findList();
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode objNode = Json.newObject();
        objNode.put("id_client_bets",idClientBets);
        objNode.put("client", client.toJsonWithoutRelations());
        objNode.put("id_tournament", idTournament);
        objNode.put("id_game_match", idGameMatch);
        objNode.put("client_bet", clientBet);
        objNode.put("status", status);
        return objNode;
    }

    public ObjectNode toJsonNoClient() {
        ObjectNode objNode = Json.newObject();
        objNode.put("id_client_bets",idClientBets);
        objNode.put("id_tournament", idTournament);
        objNode.put("id_game_match", idGameMatch);
        objNode.put("client_bet", clientBet);
        objNode.put("status", status);
        return objNode;
    }
}
