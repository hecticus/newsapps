package models.matches;

import com.avaje.ebean.Ebean;
import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by karina on 5/19/14.
 */
@Entity
public class ClientBet  extends HecticusModel {

    public final static short CALCULATED = 1;

    @Id
    private Long idClientBet;
    //is social client
    private Long idClient;
    @ManyToOne
    @JoinColumn(name="id_match")
    private GameMatch gameMatch;
    @ManyToOne
    @JoinColumn(name="id_team_winner")
    private Team teamWinner;
    @ManyToOne
    @JoinColumn(name="id_team_loser")
    private Team teamLoser;
    private Integer scoreWinner;
    private Integer scoreLoser;
    private Integer draw;
    private Long idLeaderboard;
    private short calculated;

    private static Model.Finder<Long,ClientBet> finder = new Model.Finder<Long, ClientBet>(Long.class,ClientBet.class);

    public ClientBet(){

    }

    public ClientBet(long idClient, long idLeaderboard, ObjectNode prediction){
        initClientBetData(idClient, idLeaderboard, prediction);
    }

    public void initClientBetData(long idClient, long idLeaderboard, ObjectNode prediction){
        this.idClient = idClient;
        gameMatch = GameMatch.getMatch(prediction.get("id_match").asInt());
        this.idLeaderboard = idLeaderboard;
        //GameMatch match = GameMatch.getMatch(this.idMatch);
        //si el match no esta activo para apostar no podemos salvar la apuesta sin importar que pase
        GameMatch match = GameMatch.getMatchIfActiveForBet(this.gameMatch.getIdMatch());
        if(match!=null){
            if(prediction.has("score_team_a") && prediction.has("score_team_b")){
                int score_a = prediction.get("score_team_a").asInt();
                int score_b = prediction.get("score_team_b").asInt();

                int team_a =  match.getIdTeamA();
                int team_b =  match.getIdTeamB();
                if(score_a > score_b){
                    this.teamWinner =  Team.getTeam(team_a);
                    this.teamLoser = Team.getTeam(team_b);
                    this.scoreWinner = score_a;
                    this.scoreLoser = score_b;
                }else{
                    this.teamWinner = Team.getTeam(team_b);
                    this.teamLoser = Team.getTeam(team_a);
                    this.scoreWinner = score_b;
                    this.scoreLoser = score_a;
                }
                draw = 0;
            }else{
                if(prediction.has("id_team_winner") && prediction.has("id_team_loser")){
                    this.teamWinner = Team.getTeam(prediction.get("id_team_winner").asInt());
                    this.teamLoser = Team.getTeam(prediction.get("id_team_loser").asInt());
                    this.scoreWinner = prediction.get("score_winner").asInt();
                    this.scoreLoser = prediction.get("score_loser").asInt();
                    this.draw = (prediction.get("draw").asBoolean())?1:0;
                }
            }
        }
    }

    public Long getIdClientBet() {
        return idClientBet;
    }

    public void setIdClientBet(Long idClientBet) {
        this.idClientBet = idClientBet;
    }

    public Long getIdClient() {
        return idClient;
    }

    public void setIdClient(Long idClient) {
        this.idClient = idClient;
    }

    public GameMatch getGameMatch() {
        return gameMatch;
    }

    public void setGameMatch(GameMatch gameMatch) {
        this.gameMatch = gameMatch;
    }

    public Team getTeamWinner() {
        return teamWinner;
    }

    public void setTeamWinner(Team teamWinner) {
        this.teamWinner = teamWinner;
    }

    public Team getTeamLoser() {
        return teamLoser;
    }

    public void setTeamLoser(Team teamLoser) {
        this.teamLoser = teamLoser;
    }

    public Integer getScoreWinner() {
        return scoreWinner;
    }

    public void setScoreWinner(Integer scoreWinner) {
        this.scoreWinner = scoreWinner;
    }

    public Integer getScoreLoser() {
        return scoreLoser;
    }

    public void setScoreLoser(Integer scoreLoser) {
        this.scoreLoser = scoreLoser;
    }

    public Integer getDraw() {
        return draw;
    }

    public void setDraw(Integer draw) {
        this.draw = draw;
    }

    public Long getIdLeaderboard() {
        return idLeaderboard;
    }

    public void setIdLeaderboard(Long idLeaderboard) {
        this.idLeaderboard = idLeaderboard;
    }

    public short getCalculated() {
        return calculated;
    }

    public void setCalculated(short calculated) {
        this.calculated = calculated;
    }

    public static  ClientBet findById(Long id){
        return finder.byId(id);
    }

    public int resultBet(Long afpIdWinner, Integer scoreWinner, Integer scoreLoser){
        int points = 0;
        int draw=0, goals=0, winner = 0;
        Integer idPhase = this.gameMatch.getIdPhase();
        switch (idPhase){
            case 1:  draw = 1; winner = scoreWinner.equals(scoreLoser)?0:1; break;
            case 2:  winner = 4; goals = 4; break;
            case 3:  winner = 8; goals = 8; break;
            case 4:  winner = 12; goals = 12; break;
            case 5:  winner = 12; goals = 12; break;
            case 6: winner = 12; goals = 12; break;
            default: break;
        }
       // System.out.println("bet " + teamWinner.getAfpId() + "," + this.scoreWinner + "," + this.scoreLoser);
        if(scoreWinner.equals(scoreLoser) && this.scoreWinner.equals(this.scoreLoser)){
            points+=draw;
        }
        teamWinner = Team.getTeam(teamWinner.getIdTeam());
        if(teamWinner!=null){
            if(teamWinner.getAfpId().equals(afpIdWinner) && scoreWinner >= scoreLoser){

                points+=winner;
            }

            if(this.scoreWinner.equals(scoreWinner) && this.scoreLoser.equals(scoreLoser)){
                points+=goals;
            }
        }

        return points;
    }

    public static List<ClientBet> getList(Integer idMatch){
        return finder.where().eq("id_match",idMatch).eq("calculated",0).findList();
    }

    public static List<ClientBet> getListLimited(Integer idMatch, Integer pageSize, Integer page){
        return finder.where().eq("id_match",idMatch).eq("calculated",0).orderBy("id_client_bet").findPagingList(pageSize).getPage(page).getList();
    }

    public static void update(ClientBet cb){
        Ebean.update(cb);
    }

    @Override
    public ObjectNode toJson() {
         ObjectNode tr = Json.newObject();
        tr.put("id_client_bet",idClientBet);
        tr.put("id_client",idClient);
        tr.put("id_match",gameMatch.getIdMatch());
        tr.put("id_team_winner",teamWinner.getIdTeam());
        tr.put("id_team_loser",teamLoser.getIdTeam());
        tr.put("score_winner",scoreWinner);
        tr.put("score_loser",scoreLoser);
        tr.put("draw",draw);

        return tr;
    }

    public static List<ClientBet> getClientBets(long idClient){
        return finder.where().eq("id_client", idClient).findList();
    }

    public static ClientBet getClientBetForMatch(long idClient, int idMatch){
        return finder.where().eq("id_client", idClient).eq("id_match", idMatch).findUnique();
    }
}
