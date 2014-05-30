package models.tvmaxfeeds;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.SqlRow;
import exceptions.TvmaxFeedException;
import models.HecticusModel;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by sorcerer on 5/14/14.
 */
@Entity
@Table(name="tvmax_goals")
public class TvmaxGoal extends HecticusModel {

    @Id
    private Long idGoal;
    private Long externalId;
    private Long idGame;
    private String team;
    private String player;
    private String phase;
    private String scoringPeriod;
    private String scoreTime;
    private String ronda_penales;
    private Boolean penalty; //not sure about this one
    private String idVideoKaltura;
    private Boolean active;

    private static Model.Finder<Long,TvmaxGoal> finder =
            new Model.Finder<Long, TvmaxGoal>(Long.class, TvmaxGoal.class);

    public TvmaxGoal(){

    }

    public TvmaxGoal(JsonNode data){
        externalId = Long.parseLong(data.get("id_gol").asText());
        idGame = Long.parseLong(data.get("numero_partido").asText());
        team = data.get("equipo").asText();
        player = data.get("goleador").asText();
        phase = data.get("fase").asText();
        scoringPeriod = data.get("tiempo_anotacion").asText();
        scoreTime = data.get("minuto_anotacion").asText();
        ronda_penales = data.get("ronda_penales").asText();
        idVideoKaltura = data.get("id_video_kaltura").asText();
        active = data.get("activo").asText().equalsIgnoreCase("si");
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idGoal",idGoal); //local id
        tr.put("id_gol", externalId);
        tr.put("numero_partido", idGame);
        tr.put("equipo", decode(team));
        tr.put("goleador", decode(player));
        tr.put("fase", decode(phase));
        tr.put("tiempo_anotacion",decode(scoringPeriod));
        tr.put("minuto_anotacion", decode(scoreTime));
        tr.put("ronda_penales", decode(ronda_penales));
        //tr.put("penalty", penalty);
        tr.put("id_video_kaltura", decode(idVideoKaltura));
        tr.put("activo", active);
        return tr;
    }

    /********************** bd funtions*******************************/

    public static List<TvmaxGoal> getAllPaged(int pageSize, int page){
        return finder.orderBy("external_id desc").findPagingList(pageSize).getPage(page).getList();
    }

    public static List<TvmaxGoal> getAllLimited(){
        return finder.orderBy("external_id desc").setMaxRows(MAX_SIZE).findList();
    }

    public static List<TvmaxGoal> getAllLimited(int limit){
        return finder.orderBy("external_id desc").setMaxRows(limit).findList();
    }

    public TvmaxGoal goalExist() throws TvmaxFeedException {
        TvmaxGoal tr = null;
        try {
            TvmaxGoal tofind = finder.where().eq("external_id", externalId).findUnique();
            if (tofind != null) {
                tr = tofind;
            }
        } catch (Exception ex) {
            //error devolver que no existe
            throw new TvmaxFeedException("ocurrio un error revisando si existe esta gol external_id:" + externalId + ", " + this.toJson(), ex);
        }
        return tr;
    }

    public static void batchInsertUpdate(ArrayList<TvmaxGoal> list) throws Exception {
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            for (int i =0; i < list.size(); i++){
                //if exist update or skip
                TvmaxGoal current = list.get(i);
                TvmaxGoal exist = current.goalExist();
                if (exist != null){
                    //update
                    current.setIdGoal(exist.idGoal);
                    server.update(current);
                }else {
                    server.insert(current);
                }
            }
            server.commitTransaction();
        }catch (Exception ex){
            server.rollbackTransaction();
            throw ex;
        }finally {
            server.endTransaction();
        }

    }

    public static List<SqlRow> getGoalSorted(String field, int limit) throws TvmaxFeedException {
        List<SqlRow> rows = null;
        try {

            String query = "SELECT g.team, g.player,g.score_time, g.id_video_kaltura, m.match_number, m.match_date FROM tvmax_goals as g, tvmax_matches as m where m.match_number = g.id_game order by " + field + " LIMIT " + limit;
            EbeanServer server = Ebean.getServer("default");
            rows = server.createSqlQuery(query).findList();
        } catch (Exception ex) {
            //error devolver que no existe
            throw new TvmaxFeedException("ocurrio un error ordenando los gol por el field:" + field   , ex);
        }
        return rows;
    }
    /********************** getters and setters **********************/

    public Long getIdGoal() {
        return idGoal;
    }

    public void setIdGoal(Long idGoal) {
        this.idGoal = idGoal;
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
    }

    public Long getIdGame() {
        return idGame;
    }

    public void setIdGame(Long idGame) {
        this.idGame = idGame;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getPlayer() {
        return player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public String getScoringPeriod() {
        return scoringPeriod;
    }

    public void setScoringPeriod(String scoringPeriod) {
        this.scoringPeriod = scoringPeriod;
    }

    public String getScoreTime() {
        return scoreTime;
    }

    public void setScoreTime(String scoreTime) {
        this.scoreTime = scoreTime;
    }

    public String getRonda_penales() {
        return ronda_penales;
    }

    public void setRonda_penales(String ronda_penales) {
        this.ronda_penales = ronda_penales;
    }

    public Boolean getPenalty() {
        return penalty;
    }

    public void setPenalty(Boolean penalty) {
        this.penalty = penalty;
    }

    public String getIdVideoKaltura() {
        return idVideoKaltura;
    }

    public void setIdVideoKaltura(String idVideoKaltura) {
        this.idVideoKaltura = idVideoKaltura;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
