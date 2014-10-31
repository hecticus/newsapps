package models.football;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.List;

/**
 * Created by sorcerer on 10/27/14.
 */
@Entity
@Table(name="scorers")
public class Scorer extends HecticusModel {

    @Id
    private Integer idScorer;
    private String name;
    private String fullName;
    private String nickname;
    @ManyToOne
    @JoinColumn(name = "id_teams")
    private Team team;
    private Integer goals;
    private Integer byplay;
    private Integer header;
    private Integer freeKick;
    private Integer penalty;
    @ManyToOne
    @JoinColumn(name = "id_country")
    private Countries country;

    private String externalId;

    private Integer idRound;
    private Long idCompetition;
    private String date;

    private static Model.Finder<Long,Scorer> finder =
            new Model.Finder<Long, Scorer>(Long.class, Scorer.class);


    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idScorer", idScorer);
        tr.put("name",name);
        tr.put("fullName",fullName);
        tr.put("nickname",nickname);
        //tr.put("idTeam",idTeam); //team info
        tr.put("goals",goals);
        tr.put("byplay",byplay);
        tr.put("header",header);
        tr.put("freeKick",freeKick);
        tr.put("penalty",penalty);
        //tr.put("idCountry",idCountry); //country info
        tr.put("idCompetition", idCompetition);
        tr.put("externalId",externalId);
        return tr;
    }

    public static List<Scorer> getTournamentScorers(Long idCompetition, String date){
        return  finder.where().eq("id_competition", idCompetition).eq("date",date).orderBy("").findList();
    }

    public static Scorer getScorer(long idCompetition, String externalId){
        return null;
    }


    /**************************** GETTERS AND SETTERS ****************************************************/


    public Integer getIdScorer() {
        return idScorer;
    }

    public void setIdScorer(Integer idScorer) {
        this.idScorer = idScorer;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Integer getGoals() {
        return goals;
    }

    public void setGoals(Integer goals) {
        this.goals = goals;
    }

    public Integer getByplay() {
        return byplay;
    }

    public void setByplay(Integer byplay) {
        this.byplay = byplay;
    }

    public Integer getHeader() {
        return header;
    }

    public void setHeader(Integer header) {
        this.header = header;
    }

    public Integer getFreeKick() {
        return freeKick;
    }

    public void setFreeKick(Integer freeKick) {
        this.freeKick = freeKick;
    }

    public Integer getPenalty() {
        return penalty;
    }

    public void setPenalty(Integer penalty) {
        this.penalty = penalty;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public Integer getIdRound() {
        return idRound;
    }

    public void setIdRound(Integer idRound) {
        this.idRound = idRound;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Long getIdCompetition() {
        return idCompetition;
    }

    public void setIdCompetition(Long idCompetition) {
        this.idCompetition = idCompetition;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Countries getCountry() {
        return country;
    }

    public void setCountry(Countries country) {
        this.country = country;
    }
}
