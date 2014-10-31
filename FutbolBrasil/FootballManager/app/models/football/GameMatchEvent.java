package models.football;

import com.avaje.ebean.ExpressionList;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by karina on 5/20/14.
 */
@Entity
@Table(name="game_match_events")
public class GameMatchEvent extends HecticusModel {

    @Id
    private Long idGameMatchEvents;
    @ManyToOne
    @JoinColumn(name = "id_game_matches")
    private GameMatch gameMatch;
    @ManyToOne
    @JoinColumn(name = "id_periods")
    private Period period;
    @ManyToOne
    @JoinColumn(name="id_actions")
    private Action action;
    @ManyToOne
    @JoinColumn(name="id_teams")
    private Team team;
    private String playerA;
    private String playerB;
    private Integer actionMinute;
    @Constraints.MaxLength(14)
    private String date;
    private Integer _sort;

    private static Model.Finder<Long,GameMatchEvent> finder = new
                   Model.Finder<Long,GameMatchEvent>("afp_futbol",Long.class,GameMatchEvent.class);

    public Long getIdGameMatchEvents() {
        return idGameMatchEvents;
    }

    public void setIdGameMatchEvents(Long idGameMatchEvents) {
        this.idGameMatchEvents = idGameMatchEvents;
    }

    public GameMatch getGameMatch() {
        return gameMatch;
    }

    public void setGameMatch(GameMatch gameMatch) {
        this.gameMatch = gameMatch;
    }

    public Period getPeriod() {
        return period;
    }

    public void setPeriod(Period period) {
        this.period = period;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public String getPlayerA() {
        return playerA;
    }

    public void setPlayerA(String playerA) {
        this.playerA = playerA;
    }

    public String getPlayerB() {
        return playerB;
    }

    public void setPlayerB(String playerB) {
        this.playerB = playerB;
    }

    public Integer getActionMinute() {
        return actionMinute;
    }

    public void setActionMinute(Integer actionMinute) {
        this.actionMinute = actionMinute;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer get_sort() {
        return _sort;
    }

    public void set_sort(Integer _sort) {
        this._sort = _sort;
    }

    public static List<GameMatchEvent> getList(GameMatch match,String action,
                                               String period,String tstart, String tend, int lastMinute){

        ExpressionList<GameMatchEvent> expr = finder.where().eq("gameMatch", match);
        if(!action.isEmpty()){
            expr = expr.eq("action", Action.findByMnemonic(action));
        }
        if(!period.isEmpty()){
            expr = expr.eq("period", Period.findByShotName(period));
        }

        String day = match.getDate().substring(0,8);
        if(!tstart.isEmpty()){
           expr = (tend.isEmpty())?expr.eq("date",day+tstart):expr.ge("date",day+tstart).le("date",day+tend);
        }

        if(lastMinute > -1){
            expr = expr.ge("action_minute",lastMinute);
        }

        return expr.orderBy("id_game_match_events desc").findList();
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode json = Json.newObject();
        json.put("id_game_matc_events",idGameMatchEvents);
        json.put("id_game_matches",gameMatch.getIdGameMatches());
        json.put("period",period.toJson());
        json.put("action",action.toJson());
        json.put("id_teams",team.getIdTeams());
        json.put("player_a",playerA);
        json.put("player_b",playerB);
        json.put("action_minute",actionMinute);
        json.put("date",date);
        json.put("_sort",_sort);
        return json;
    }
}
