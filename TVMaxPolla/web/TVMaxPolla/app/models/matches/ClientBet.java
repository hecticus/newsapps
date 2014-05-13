package models.matches;

import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.UnsupportedEncodingException;
import java.util.List;

/**
 * Created by chrirod on 5/12/14.
 */
@Entity
@Table(name="client_bet")
public class ClientBet extends HecticusModel {
    @Id
    private Long idClientBet;
    private Long idClient;
    private Integer idMatch;
    private Integer idTeamWinner;
    private Integer idTeamLoser;
    private Integer scoreWinner;
    private Integer scoreLoser;
    private Boolean draw;
    private Long idLeaderboard;

    public ClientBet(long idClient, long idLeaderboard, ObjectNode prediction){
        this.idClient = idClient;
        this.idMatch = prediction.get("id_match").asInt();
        this.idLeaderboard = idLeaderboard;
        if(prediction.has("score_team_a") && prediction.has("score_team_b")){
            int score_a = prediction.get("score_team_a").asInt();
            int score_b = prediction.get("score_team_b").asInt();
            GameMatch match = GameMatch.getMatch(this.idMatch);
            int team_a =  match.getIdTeamA();
            int team_b =  match.getIdTeamB();
            if(score_a > score_b){
                this.idTeamWinner = team_a;
                this.idTeamLoser = team_b;
                this.scoreWinner = score_a;
                this.scoreLoser = score_b;
            }else{
                this.idTeamWinner = team_b;
                this.idTeamLoser = team_a;
                this.scoreWinner = score_b;
                this.scoreLoser = score_a;
            }
            draw = false;
        }else{
            if(prediction.has("id_team_winner") && prediction.has("id_team_loser")){
                this.idTeamWinner = prediction.get("id_team_winner").asInt();
                this.idTeamLoser = prediction.get("id_team_loser").asInt();
                this.scoreWinner = prediction.get("score_winner").asInt();
                this.scoreLoser = prediction.get("score_loser").asInt();
                this.draw = prediction.get("draw").asBoolean();
            }
        }
    }

    public static Finder<Long,ClientBet> finder =
            new Finder<Long, ClientBet>(Long.class, ClientBet.class);


    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("id_client_bet",idClientBet);
        tr.put("id_client",idClient);
        tr.put("id_match",idMatch);
        tr.put("id_team_winner",idTeamWinner);
        tr.put("id_team_loser",idTeamLoser);
        tr.put("score_winner",scoreWinner);
        tr.put("score_loser",scoreLoser);
        tr.put("draw",draw?1:0);

        return tr;
    }

    public static List<ClientBet> getClientBets(long idClient){
        return finder.where().eq("id_client", idClient).findList();
    }
}
