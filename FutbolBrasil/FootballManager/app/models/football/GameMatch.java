package models.football;

import com.avaje.ebean.ExpressionList;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by karina on 5/20/14.
 */
@Entity
@Table(name="game_matches")
public class GameMatch extends HecticusModel {

    public static final short NONE = 0;
    public static final short STARTED = 1;
    public static final short LIVE = 2;
    public static final short FINISHED = 3;
    public static final short SUSPENDED = 4;
    public static final short NOSTARTED = 5;


    @Id
    private Long idGameMatches;
    @ManyToOne
    @JoinColumn(name="id_phases")
    private Phase phase;
    @ManyToOne
    @JoinColumn(name="id_home_team")
    private Team homeTeam;
    @ManyToOne
    @JoinColumn(name="id_away_team")
    private Team awayTeam;
    @ManyToOne
    @JoinColumn(name="id_venue")
    private Venue venue;
    private Long fifaMatchNumber;
    private String homeTeamName;
    private String awayTeamName;
    private Integer homeTeamGoals;
    private Integer awayTeamGoals;
    @javax.persistence.Column(length=14)
    private String date;
    private String status;
    private Integer started;
    private Integer live;
    private Integer finished;
    private Integer suspended;
    private Long extId;

    @ManyToOne
    @JoinColumn(name="id_competition")
    private Competition competition;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "gameMatch")
    private GameMatchResult result;

    @OneToMany(mappedBy = "gameMatch")
    @OrderBy("idGameMatchEvents desc")
    private List<GameMatchEvent> events;

    private static Model.Finder<Long,GameMatch> finder = new
                   Model.Finder<Long,GameMatch>(Long.class, GameMatch.class);

    public GameMatch(){}

    public GameMatch(Phase phase, Team homeTeam, Team awayTeam, Venue venue, String homeTeamName,
                     String awayTeamName, Integer homeTeamGoals, Integer awayTeamGoals, String date,
                     String status, Long extId, Competition competition) {
        this.phase = phase;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.venue = venue;
        this.homeTeamName = homeTeamName;
        this.awayTeamName = awayTeamName;
        this.homeTeamGoals = homeTeamGoals;
        this.awayTeamGoals = awayTeamGoals;
        this.date = date;
        this.status = status;
        this.extId = extId;
        this.competition = competition;
    }

    public Long getIdGameMatches() {
        return idGameMatches;
    }

    public void setIdGameMatches(Long idGameMatches) {
        this.idGameMatches = idGameMatches;
    }

    public Phase getPhase() {
        return phase;
    }

    public void setPhase(Phase phase) {
        this.phase = phase;
    }

    public Team getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(Team homeTeam) {
        this.homeTeam = homeTeam;
    }

    public Team getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(Team awayTeam) {
        this.awayTeam = awayTeam;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public Long getFifaMatchNumber() {
        return fifaMatchNumber;
    }

    public void setFifaMatchNumber(Long fifa_match_number) {
        this.fifaMatchNumber = fifa_match_number;
    }

    public String getHomeTeamName() {
        return homeTeamName;
    }

    public void setHomeTeamName(String homeTeamName) {
        this.homeTeamName = homeTeamName;
    }

    public String getAwayTeamName() {
        return awayTeamName;
    }

    public void setAwayTeamName(String awayTeamName) {
        this.awayTeamName = awayTeamName;
    }

    public Integer getHomeTeamGoals() {
        return homeTeamGoals;
    }

    public void setHomeTeamGoals(Integer homeTeamGoals) {
        this.homeTeamGoals = homeTeamGoals;
    }

    public Integer getAwayTeamGoals() {
        return awayTeamGoals;
    }

    public void setAwayTeamGoals(Integer awayTeamGoals) {
        this.awayTeamGoals = awayTeamGoals;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getLive() {
        return live;
    }

    public void setLive(Integer live) {
        this.live = live;
    }

    public Integer getFinished() {
        return finished;
    }

    public void setFinished(Integer finished) {
        this.finished = finished;
    }

    public Integer getSuspended() {
        return suspended;
    }

    public void setSuspended(Integer suspended) {
        this.suspended = suspended;
    }

    public Long getExtId() {
        return extId;
    }

    public void setExtId(Long extId) {
        this.extId = extId;
    }

    public GameMatchResult getResult() {
        return result;
    }

    public void setResult(GameMatchResult result) {
        this.result = result;
    }

    public Integer getStarted() {
        return started;
    }

    public void setStarted(Integer started) {
        this.started = started;
    }

    public List<GameMatchEvent> getEvents() {
        return events;
    }

    public void setEvents(List<GameMatchEvent> events) {
        this.events = events;
    }

    public static List<GameMatch> getList(Long idPhase, String startd, String endd, short status){
        if(idPhase == 0 && startd.isEmpty() && status == NONE) return finder.all();
        ExpressionList<GameMatch> expr = null;
        if(idPhase > 0){
            expr = finder.where().eq("id_phases",idPhase);
        }

        if(!endd.isEmpty()){
           expr = (expr==null)?finder.where().ge("date", startd).le("date", endd):expr.ge("date",startd).le("date", endd);
        }else{
            expr = (expr==null)?finder.where().ge("date", startd):expr.ge("date", startd);
        }

        switch (status){
            case STARTED: expr = expr.eq("started",1);break;
            case LIVE: expr = expr.eq("live",1);break;
            case FINISHED: expr = expr.eq("finished",1);break;
            case SUSPENDED: expr = expr.eq("suspended",1);break;
            case NOSTARTED: expr = expr.eq("started",0).eq("live", 0).eq("finished", 0).eq("suspended", 0);
            default:break;
        }

        return expr.findList();
    }

    public static GameMatch findById(Long idGameMatch){
        return finder.byId(idGameMatch);
    }

    public static GameMatch findByIdExternal(Long idExt){
        return finder.where().eq("extId",idExt).findUnique();
    }

    public static GameMatch findByIdFifa(Long idFifa){
        return finder.where().eq("fifaMatchNumber",idFifa).findUnique();
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode json = Json.newObject();
        json.put("id_game_matches",idGameMatches);
        json.put("date",date);
        if(phase != null) {
            json.put("phase",phase.getIdPhases());
        }
        json.put("homeTeam",homeTeam.toJson());
        json.put("awayTeam",awayTeam.toJson());
        json.put("home_team_goals",homeTeamGoals);
        json.put("away_team_goals",awayTeamGoals);
        json.put("fifa_match_number",fifaMatchNumber);
        json.put("status",status);
        json.put("ext_id",extId);
        if(result != null) {
            json.put("results", result.toJson());
        }

        return json;
    }

    public ObjectNode toJsonWithEvents(){
        ObjectNode json = toJson();
        ArrayList<ObjectNode> list = new ArrayList<ObjectNode>();
        Iterator<GameMatchEvent> e = events.iterator();
        while(e.hasNext()){
            list.add(e.next().toJson());
        }
        json.put("events", Json.toJson(list));

        return  json;
    }

    public Competition getCompetition() {
        return competition;
    }

    public void setCompetition(Competition competition) {
        this.competition = competition;
    }

    public static List<GameMatch> getGamematchByDate(Long idCompetition, String date){
        return finder.where().eq("date", date).eq("competition.idCompetitions", idCompetition).findList();
    }

    public ObjectNode fixtureJson(){
        ObjectNode json = Json.newObject();
        json.put("id_game_matches",idGameMatches);//id del juego
        int value = 0;
        if (homeTeamGoals > awayTeamGoals){
            value = 1;
        }else if (homeTeamGoals < awayTeamGoals){
            value = 3;
        }else { //iguales
            value = 2;
        }
        json.put("game_result", value);
        return json;
    }

    public void validateGame(){

    }
}
