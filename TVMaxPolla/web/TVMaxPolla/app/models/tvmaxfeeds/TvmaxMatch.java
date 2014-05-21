package models.tvmaxfeeds;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
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
@Table(name="tvmax_matches")
public class TvmaxMatch extends HecticusModel {

    @Id
    private Long idTvnMatch;
    private Long externalId;
    private Integer matchNumber;
    private String  matchDate;
    private String phase;
    private String stadium;
    private String localTeam;
    private String localTeamGoals;
    private String localTeamPenalties;
    private String localTeamScoringPlayers;
    private String awayTeam;
    private String awayTeamGoals;
    private String awayTeamPenalties;
    private String awayTeamScoringPlayers;
    private String matchStatus;
    private String matchDescription;
    private Boolean tvmaxBroadcast;

    private static Model.Finder<Long,TvmaxMatch> finder =
            new Model.Finder<Long, TvmaxMatch>(Long.class, TvmaxMatch.class);

    public TvmaxMatch() {
        //constructor por defecto
    }

    public TvmaxMatch(JsonNode data) {
        externalId= data.get("id_del_partido").asLong();
        matchNumber = data.get("numero_de_partido").asInt();
        matchDate = data.get("fecha_de_partido").asText();
        phase = data.get("fase").asText();
        stadium = data.get("sede").asText();
        localTeam = data.get("equipo_local").asText();
        localTeamGoals = data.get("goles_equipo_local").asText();
        localTeamPenalties= data.get("penales_equipo_local").asText();
        localTeamScoringPlayers= data.get("goleadores_equipo_local").asText();
        awayTeam = data.get("equipo_visitante").asText();
        awayTeamGoals= data.get("goles_equipo_visitante").asText();
        awayTeamPenalties= data.get("penales_equipo_visitante").asText();
        awayTeamScoringPlayers= data.get("goleadores_equipo_visitante").asText();
        matchStatus= data.get("estado_del_partido").asText();
        matchDescription= data.get("descripcion_del_partido").asText();
        tvmaxBroadcast= data.get("transmision_por_TVMAX").asText().equalsIgnoreCase("si");
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idTvnMatch", idTvnMatch); //local id
        tr.put("id_del_partido", externalId); //external id
        tr.put("numero_de_partido", matchNumber);
        tr.put("fecha_de_partido", matchDate);
        tr.put("fase", decode(phase));
        tr.put("sede", decode(stadium));
        tr.put("equipo_local", decode(localTeam));
        tr.put("goles_equipo_local", decode(localTeamGoals));
        tr.put("penales_equipo_local", decode(localTeamPenalties));
        tr.put("goleadores_equipo_local", decode(localTeamScoringPlayers));
        tr.put("equipo_visitante", decode(awayTeam));
        tr.put("goles_equipo_visitante", decode(awayTeamGoals));
        tr.put("penales_equipo_visitante", decode(awayTeamPenalties));
        tr.put("goleadores_equipo_visitante", decode(awayTeamScoringPlayers));
        tr.put("estado_del_partido", decode(matchStatus));
        tr.put("descripcion_del_partido", decode(matchDescription));
        tr.put("transmision_por_TVMAX", tvmaxBroadcast);

        return tr;
    }

    /********************** bd funtions*******************************/

    public static List<TvmaxMatch> getAllPaged(int pageSize, int page){
        return finder.orderBy("external_id desc").findPagingList(pageSize).getPage(page).getList();
    }

    public static List<TvmaxMatch> getAllLimited(){
        return finder.orderBy("external_id desc").setMaxRows(MAX_SIZE).findList();
    }

    public static List<TvmaxMatch> getAllLimited(int limit){
        return finder.orderBy("external_id desc").setMaxRows(limit).findList();
    }

    public TvmaxMatch matchExist() throws TvmaxFeedException {
        TvmaxMatch tr = null;
        try {
            TvmaxMatch tofind = finder.where().eq("external_id", externalId).findUnique();
            if (tofind != null) {
                tr = tofind;
            }
        } catch (Exception ex) {
            //error devolver que no existe
            throw new TvmaxFeedException("ocurrio un error revisando si existe esta controversia external_id:" + externalId + ", " + this.toJson(), ex);
        }
        return tr;
    }

    public static void batchInsertUpdate(ArrayList<TvmaxMatch> list) throws Exception {
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            for (int i =0; i < list.size(); i++){
                //if exist update or skip
                TvmaxMatch current = list.get(i);
                TvmaxMatch exist = current.matchExist();
                if (exist != null){
                    //update
                    current.setIdTvnMatch(exist.idTvnMatch);
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

    /********************** getters and setters **********************/

    public Long getIdTvnMatch() {
        return idTvnMatch;
    }

    public void setIdTvnMatch(Long idTvnMatch) {
        this.idTvnMatch = idTvnMatch;
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
    }

    public Integer getMatchNumber() {
        return matchNumber;
    }

    public void setMatchNumber(Integer matchNumber) {
        this.matchNumber = matchNumber;
    }

    public String getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(String matchDate) {
        this.matchDate = matchDate;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }

    public String getStadium() {
        return stadium;
    }

    public void setStadium(String stadium) {
        this.stadium = stadium;
    }

    public String getLocalTeam() {
        return localTeam;
    }

    public void setLocalTeam(String localTeam) {
        this.localTeam = localTeam;
    }

    public String getLocalTeamGoals() {
        return localTeamGoals;
    }

    public void setLocalTeamGoals(String localTeamGoals) {
        this.localTeamGoals = localTeamGoals;
    }

    public String getLocalTeamPenalties() {
        return localTeamPenalties;
    }

    public void setLocalTeamPenalties(String localTeamPenalties) {
        this.localTeamPenalties = localTeamPenalties;
    }

    public String getLocalTeamScoringPlayers() {
        return localTeamScoringPlayers;
    }

    public void setLocalTeamScoringPlayers(String localTeamScoringPlayers) {
        this.localTeamScoringPlayers = localTeamScoringPlayers;
    }

    public String getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(String awayTeam) {
        this.awayTeam = awayTeam;
    }

    public String getAwayTeamGoals() {
        return awayTeamGoals;
    }

    public void setAwayTeamGoals(String awayTeamGoals) {
        this.awayTeamGoals = awayTeamGoals;
    }

    public String getAwayTeamPenalties() {
        return awayTeamPenalties;
    }

    public void setAwayTeamPenalties(String awayTeamPenalties) {
        this.awayTeamPenalties = awayTeamPenalties;
    }

    public String getAwayTeamScoringPlayers() {
        return awayTeamScoringPlayers;
    }

    public void setAwayTeamScoringPlayers(String awayTeamScoringPlayers) {
        this.awayTeamScoringPlayers = awayTeamScoringPlayers;
    }

    public String getMatchStatus() {
        return matchStatus;
    }

    public void setMatchStatus(String matchStatus) {
        this.matchStatus = matchStatus;
    }

    public String getMatchDescription() {
        return matchDescription;
    }

    public void setMatchDescription(String matchDescription) {
        this.matchDescription = matchDescription;
    }

    public Boolean getTvmaxBroadcast() {
        return tvmaxBroadcast;
    }

    public void setTvmaxBroadcast(Boolean tvmaxBroadcast) {
        this.tvmaxBroadcast = tvmaxBroadcast;
    }
}
