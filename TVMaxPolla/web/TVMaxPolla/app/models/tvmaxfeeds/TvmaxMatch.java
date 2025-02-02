package models.tvmaxfeeds;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.Expr;
import exceptions.TvmaxFeedException;
import models.HecticusModel;
import models.matches.GameMatch;
import models.matches.Team;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;
import utils.Utils;
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
    private String formatedDate;

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
        formatedDate = Utils.formatCalendarDate(matchDate, "America/Panama");
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idTvnMatch", idTvnMatch); //local id
        tr.put("id_del_partido", matchNumber); //external id
        tr.put("id_del_partido_tvmax", externalId); //external id
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

        //goles dependiendo del estado del partido
        if (decode(matchStatus).equalsIgnoreCase("Próximo")){
            tr.put("goles_equipo_local", "-");
            tr.put("goles_equipo_visitante", "-");
        }

        //obtenemos data adicional como los id_ext de los equipos
        GameMatch match = GameMatch.getMatch(matchNumber);
        if (match != null){
            Team teamLocal = Team.getTeam(match.getIdTeamA());
            Team teamVisitante = Team.getTeam(match.getIdTeamB());
            if (teamLocal!= null){
                tr.put("equipo_local_ext_id",teamLocal.getAfpId());
                tr.put("equipo_local_short_name", teamLocal.getShortName());
            }
            if (teamVisitante != null){
                tr.put("equipo_visitante_ext_id",teamVisitante.getAfpId());
                tr.put("equipo_visitante_short_name", teamVisitante.getShortName());
            }
        }

        tr.put("currentlyLive", decode(matchStatus).equalsIgnoreCase("activo"));
        tr.put("fecha_de_partido_ve", Utils.fanaticos412Date(matchDate, "America/Caracas"));

        return tr;
    }

    /********************** bd funtions*******************************/

    public static List<TvmaxMatch> getAllPaged(int pageSize, int page){
        return finder.orderBy("external_id desc").findPagingList(pageSize).getPage(page).getList();
    }

    public static List<TvmaxMatch> getAll(){
        return finder.orderBy("formated_date asc").findList();
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

    public static List<TvmaxMatch> getMatchesByDate(String date){
        return finder.where()
                .like("match_date", date)
                .or(Expr.eq("match_status","activo"), Expr.eq("match_status",encode("Próximo")))
                .orderBy("formated_date asc")
                .findList();
    }

    public static List<TvmaxMatch> getActiveMatchesByDate(String date){
        return finder.where()
                .eq("match_status", "activo")
                .like("match_date", date)
                .orderBy("external_id desc")
                .findList();
    }

    public static List<TvmaxMatch> getFinisedMatchesByDate(String date){
        return finder.where().or(
                    Expr.eq("match_status", "Finalizado"),
                    Expr.eq("match_status", encode("Finalizado en penales")))
                .like("match_date", date)
                .orderBy("external_id desc")
                .findList();
    }

    public static List<TvmaxMatch> getFinisedMatchesByDate(String beginDate, String endDate){
        return finder.where().disjunction()
                .eq("match_status", "Finalizado")
                .eq("match_status", encode("Finalizado en penales"))
                .eq("match_description", "Finalizado")
                .eq("match_description", encode("Finalizado en penales"))
                .endJunction()
                .between("formated_date", beginDate, endDate)
                .orderBy("external_id desc")
                .setMaxRows(10)
                .findList();
    }

    public static List<TvmaxMatch> getBroadcastableMatchesByDate(String date){
        return finder.where()
                .eq("tvmax_broadcast", 1)
                .like("formated_date", date)
                .orderBy("external_id desc")
                .findList();
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

    public String getFormatedDate() {
        return formatedDate;
    }

    public void setFormatedDate(String formatedDate) {
        this.formatedDate = formatedDate;
    }
}
