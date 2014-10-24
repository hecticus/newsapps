package models.afpfutbol;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by jose on 5/28/14.
 */
@Entity
@Table(name="ranking")
public class Rank  extends HecticusModel {

    @Id
    private long idRanking;

    @ManyToOne
    @JoinColumn(name = "id_phases")
    private Phase phase;

    @ManyToOne
    @JoinColumn(name = "id_teams")
    private Team team;

    private long matches;
    private long matchesWon;
    private long matchesDrawn;
    private long matchesLost;
    private long points;
    private long goalsFor;
    private long goalAgainst;
    private long ranking;

    private static Model.Finder<Long,Rank> finder = new
            Model.Finder<Long,Rank>("afp_futbol",Long.class,Rank.class);


    @Override
    public ObjectNode toJson() {
        ObjectNode node = Json.newObject();
        node.put("id_ranking",idRanking);
        node.put("phase",phase.toJson());
        node.put("team",team.toJson());
        node.put("matches",matches);
        node.put("matches_won",matchesWon);
        node.put("matches_drawn",matchesDrawn);
        node.put("matches_lost",matchesLost);
        node.put("points",points);
        node.put("goals_for",goalsFor);
        node.put("goal_against",goalAgainst);
        node.put("ranking",ranking);
        return node;
    }

    public long getIdRanking() {
        return idRanking;
    }

    public void setIdRanking(long idRanking) {
        this.idRanking = idRanking;
    }

    public Phase getPhase() {
        return phase;
    }

    public void setPhase(Phase phase) {
        this.phase = phase;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public long getMatches() {
        return matches;
    }

    public void setMatches(long matches) {
        this.matches = matches;
    }

    public long getMatchesWon() {
        return matchesWon;
    }

    public void setMatchesWon(long matchesWon) {
        this.matchesWon = matchesWon;
    }

    public long getMatchesDrawn() {
        return matchesDrawn;
    }

    public void setMatchesDrawn(long matchesDrawn) {
        this.matchesDrawn = matchesDrawn;
    }

    public long getMatchesLost() {
        return matchesLost;
    }

    public void setMatchesLost(long matchesLost) {
        this.matchesLost = matchesLost;
    }

    public long getPoints() {
        return points;
    }

    public void setPoints(long points) {
        this.points = points;
    }

    public long getGoalsFor() {
        return goalsFor;
    }

    public void setGoalsFor(long goalsFor) {
        this.goalsFor = goalsFor;
    }

    public long getGoalAgainst() {
        return goalAgainst;
    }

    public void setGoalAgainst(long goalAgainst) {
        this.goalAgainst = goalAgainst;
    }

    public long getRanking() {
        return ranking;
    }

    public void setRanking(long ranking) {
        this.ranking = ranking;
    }

    public static List<Rank> getListByIdPhase(long idPhase){
        return finder.where().eq("id_phases", idPhase).orderBy("ranking asc").findList();
    }

    public static List<Rank> getListByExtIdPhase(long idExtPhase){
        Phase _phase = Phase.findByExtId(idExtPhase);
        if(_phase == null)
            return null;

        return finder.where().eq("id_phases", _phase.getIdPhases()).orderBy("ranking asc").findList();
    }
}
