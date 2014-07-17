package models.matches;

import models.HecticusModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 * Created by chrirod on 4/14/14.
 */
@Entity
@Table(name="match_results")
public class MatchResults extends HecticusModel{
    @Id
    private Integer idMatchResults;
    private Integer idMatch;
    private Integer scoreTeamA;
    private Integer scoreTeamB;
    private Integer penaltiesTeamA;
    private Integer penaltiesTeamB;

    public MatchResults(int idMatch, int scoreTeamA, int scoreTeamB, int penaltiesTeamA, int penaltiesTeamB){
        this.idMatch = idMatch;
        this.scoreTeamA = scoreTeamA;
        this.scoreTeamB = scoreTeamB;
        this.penaltiesTeamA = penaltiesTeamA;
        this.penaltiesTeamB = penaltiesTeamB;
    }

    public ObjectNode toJson(){
        ObjectNode tr = Json.newObject();
        tr.put("id_match", idMatch);
        tr.put("score_team_a", scoreTeamA);
        tr.put("score_team_b",scoreTeamB);
        tr.put("penalties_team_a",penaltiesTeamA);
        tr.put("penalties_team_b",penaltiesTeamB);
        return tr;
    }

    public Integer getIdMatch() {
        return idMatch;
    }

    public void setIdMatch(Integer idMatch) {
        this.idMatch = idMatch;
    }

    public Integer getScoreTeamA() {
        return scoreTeamA;
    }

    public void setScoreTeamA(Integer scoreTeamA) {
        this.scoreTeamA = scoreTeamA;
    }

    public Integer getScoreTeamB() {
        return scoreTeamB;
    }

    public void setScoreTeamB(Integer scoreTeamB) {
        this.scoreTeamB = scoreTeamB;
    }

    public Integer getPenaltiesTeamA() {
        return penaltiesTeamA;
    }

    public void setPenaltiesTeamA(Integer penaltiesTeamA) {
        this.penaltiesTeamA = penaltiesTeamA;
    }

    public Integer getPenaltiesTeamB() {
        return penaltiesTeamB;
    }

    public void setPenaltiesTeamB(Integer penaltiesTeamB) {
        this.penaltiesTeamB = penaltiesTeamB;
    }
}
