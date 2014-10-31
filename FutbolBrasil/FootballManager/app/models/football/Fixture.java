package models.football;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
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
@Table(name="fixtures")
public class Fixture extends HecticusModel {

    @Id
    private Long idFixture;
    private Long externalId;
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
    private String formatedDate;
    private String media;
    private GameMatch gamedata;

    private static Model.Finder<Long,Fixture> finder =
            new Model.Finder<Long, Fixture>(Long.class, Fixture.class);

    public Fixture() {
        //constructor por defecto
    }

    public Fixture(JsonNode data) {
        externalId= data.get("id_del_partido").asLong();

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

        //formatedDate = Utils.formatCalendarDate(matchDate, "America/Panama");
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idFixture", idFixture); //local id

        tr.put("id_del_partido_tvmax", externalId); //external id

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


        //goles dependiendo del estado del partido
        if (decode(matchStatus).equalsIgnoreCase("Próximo")){
            tr.put("goles_equipo_local", "-");
            tr.put("goles_equipo_visitante", "-");
        }

        //obtenemos data adicional como los id_ext de los equipos
//        GameMatch match = GameMatch.getMatch(matchNumber);
//        if (match != null){
//            Team teamLocal = Team.getTeam(match.getIdTeamA());
//            Team teamVisitante = Team.getTeam(match.getIdTeamB());
//            if (teamLocal!= null){
//                tr.put("equipo_local_ext_id",teamLocal.getAfpId());
//                tr.put("equipo_local_short_name", teamLocal.getShortName());
//            }
//            if (teamVisitante != null){
//                tr.put("equipo_visitante_ext_id",teamVisitante.getAfpId());
//                tr.put("equipo_visitante_short_name", teamVisitante.getShortName());
//            }
//        }
//
//        tr.put("currentlyLive", decode(matchStatus).equalsIgnoreCase("activo"));
//        tr.put("fecha_de_partido_ve", Utils.fanaticos412Date(matchDate, "America/Caracas"));

        return tr;
    }

    /********************** bd funtions*******************************/

    public static List<Fixture> getAllPaged(int pageSize, int page){
        return finder.orderBy("external_id desc").findPagingList(pageSize).getPage(page).getList();
    }

    public static List<Fixture> getAll(){
        return finder.orderBy("formated_date asc").findList();
    }

    public static List<Fixture> getAllLimited(){
        return finder.orderBy("external_id desc").setMaxRows(MAX_SIZE).findList();
    }

    public static List<Fixture> getAllLimited(int limit){
        return finder.orderBy("external_id desc").setMaxRows(limit).findList();
    }

    public Fixture matchExist() /*throws TvmaxFeedException*/ {
        Fixture tr = null;
        try {
            Fixture tofind = finder.where().eq("external_id", externalId).findUnique();
            if (tofind != null) {
                tr = tofind;
            }
        } catch (Exception ex) {
            //error devolver que no existe
            //throw new TvmaxFeedException("ocurrio un error revisando si existe esta controversia external_id:" + externalId + ", " + this.toJson(), ex);
        }
        return tr;
    }

    public static void batchInsertUpdate(ArrayList<Fixture> list) throws Exception {
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            for (int i =0; i < list.size(); i++){
                //if exist update or skip
                Fixture current = list.get(i);
                Fixture exist = current.matchExist();
                if (exist != null){
                    //update
                    current.setIdFixture(exist.idFixture);
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

    public static List<Fixture> getMatchesByDate(String date){
        return finder.where()
                .like("match_date", date)
                //.or(Expr.eq("match_status","activo"), Expr.eq("match_status",encode("Próximo")))
                .orderBy("formated_date asc")
                .findList();
    }

    public static List<Fixture> getActiveMatchesByDate(String date){
        return finder.where()
                .eq("match_status", "activo")
                .like("match_date", date)
                .orderBy("external_id desc")
                .findList();
    }

//    public static List<Fixture> getFinisedMatchesByDate(String date){
//        return finder.where().or(
//                    Expr.eq("match_status", "Finalizado"),
//                    Expr.eq("match_status", encode("Finalizado en penales")))
//                .like("match_date", date)
//                .orderBy("external_id desc")
//                .findList();
//    }

//    public static List<Fixture> getFinisedMatchesByDate(String beginDate, String endDate){
//        return finder.where().disjunction()
//                .eq("match_status", "Finalizado")
//                .eq("match_status", encode("Finalizado en penales"))
//                .eq("match_description", "Finalizado")
//                .eq("match_description", encode("Finalizado en penales"))
//                .endJunction()
//                .between("formated_date", beginDate, endDate)
//                .orderBy("external_id desc")
//                .setMaxRows(10)
//                .findList();
//    }

    public static List<Fixture> getBroadcastableMatchesByDate(String date){
        return finder.where()
                .eq("tvmax_broadcast", 1)
                .like("formated_date", date)
                .orderBy("external_id desc")
                .findList();
    }

    /********************** getters and setters **********************/

    public Long getIdFixture() {
        return idFixture;
    }

    public void setIdFixture(Long idFixture) {
        this.idFixture = idFixture;
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
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

    public String getFormatedDate() {
        return formatedDate;
    }

    public void setFormatedDate(String formatedDate) {
        this.formatedDate = formatedDate;
    }
}
