package models.matches;

import models.HecticusModel;

import org.codehaus.jackson.node.ObjectNode;

import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chrirod on 3/27/14.
 */
@Entity
@Table(name="game_match")
public class GameMatch extends HecticusModel{
    @Id
    private Integer idMatch;
    private Integer idGroup;
    private Integer idTeamA;
    private Integer idTeamB;
    private Integer idPhase;
    private Long date;
    private Integer idVenue;
    
    public Team objTeamA;
    public Team objTeamB;    
    public Venue objVenue;

    @OneToOne
    @JoinColumn(name = "id_match")
    public MatchResults results;
    
    
    public GameMatch(){
        //por defecto
    }

    public Integer getIdMatch() {
        return idMatch;
    }

    public void setIdMatch(Integer idMatch) {
        this.idMatch = idMatch;
    }

    public Integer getIdGroup() {
        return idGroup;
    }

    public void setIdGroup(Integer idGroup) {
        this.idGroup = idGroup;
    }

    public Integer getIdTeamA() {
        return idTeamA;
    }

    public void setIdTeamA(Integer idTeamA) {
        this.idTeamA = idTeamA;
    }

    public Integer getIdTeamB() {
        return idTeamB;
    }

    public void setIdTeamB(Integer idTeamB) {
        this.idTeamB = idTeamB;
    }

    public Integer getIdPhase() {
        return idPhase;
    }

    public void setIdPhase(Integer idPhase) {
        this.idPhase = idPhase;
    }

    public Long getDate() {
        return date;
    }

    public void setDate(Long date) {
        this.date = date;
    }

    public Integer getIdVenue() {
        return idVenue;
    }

    public void setIdVenue(Integer idVenue) {
        this.idVenue = idVenue;
    }
    
    public Team getTeamA() {
        return objTeamA;
    }

    public void setTeamA(Team objTeamA) {
        this.objTeamA = objTeamA;
    }

    public Team getTeamB() {
        return objTeamB;
    }

    public void setTeamB(Team objTeamB) {
        this.objTeamB = objTeamB;
    }
    
    public Venue getVenue() {
        return objVenue;
    }

    public void setResults(MatchResults objResults) {
        this.results = objResults;
    }

    public MatchResults getResults() {
        return results;
    }

    public void setVenue(Venue objVenue) {
        this.objVenue = objVenue;
    }
    
    public static Model.Finder<Integer,GameMatch> finder =
            new Model.Finder<Integer, GameMatch>(Integer.class, GameMatch.class);

    public ObjectNode toJson(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idMatch);
        tr.put("id_group", idGroup);
        tr.put("id_team_a",idTeamA);
        tr.put("id_team_b",idTeamB);
        tr.put("id_phase",idPhase);
        tr.put("date",date);
        tr.put("id_venue",idVenue);
        return tr;
    }

    public ObjectNode toJsonSimple(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idMatch);
        tr.put("id_team_a",idTeamA);
        tr.put("id_team_b",idTeamB);
        tr.put("date",date);
        tr.put("id_venue",idVenue);
        return tr;
    }

    public ObjectNode toJsonOnlyDate(){
        ObjectNode tr = Json.newObject();
        tr.put("id", idMatch);
        tr.put("date",date);
        return tr;
    }
    
    public static GameMatch getMatch(int idMatch){
        return finder.where().eq("id_match", idMatch).findUnique();
    }

    public static GameMatch getMatchIfActiveForBet(int idMatch){
        GameMatch match = finder.where().eq("id_match", idMatch).findUnique();
        List<Phase> activePhases = Phase.getAllActivePhases();
        boolean found = false;
        for(int i=0;i<activePhases.size();i++){
            if(match.getIdPhase() == activePhases.get(i).getIdPhase()){
                found = true;
                break;
            }
        }
        if(!found){
            match = null;
        }
        return match;
    }

    public static List<GameMatch> getMatchesWithIDs(ArrayList<Integer> idMatches){
        return finder.where().idIn(idMatches).findList();
    }

    public static List<GameMatch> getMatchesForGroupAndPhase(int idGroup, int idPhase){
        return finder.where().eq("id_group", idGroup).eq("id_phase", idPhase).findList();
    }
}
