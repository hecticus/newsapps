package models.matches;

import com.avaje.ebean.Ebean;
import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;

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
        System.out.println("bet " + teamWinner.getAfpId() + "," + this.scoreWinner + "," + this.scoreLoser);
        if(scoreWinner.equals(scoreLoser) && this.scoreWinner.equals(this.scoreLoser)){
            points+=draw;
        }

        if(teamWinner.getAfpId().equals(afpIdWinner) && scoreWinner >= scoreLoser){

            points+=winner;
        }

        if(this.scoreWinner.equals(scoreWinner) && this.scoreLoser.equals(scoreLoser)){
            points+=goals;
        }

        return points;
    }

    public static List<ClientBet> getList(Integer idMatch){
        return finder.where().eq("id_match",idMatch).eq("calculated",0).findList();
    }

    public static void update(ClientBet cb){
        Ebean.update(cb);
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }
}
