package models.tvmaxfeeds;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.SqlRow;
import exceptions.TvmaxFeedException;
import models.HecticusModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.lang.reflect.Array;
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
    private String image;

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
        image = data.get("imagen_gol").asText();
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
        tr.put("imagen_gol", image);
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

    /**
     * Si, esta terriblemente feo, lo se. pero mientras se me ocurre algo mejor funcionara asi
     * @param field
     * @param limit
     * @return
     * @throws TvmaxFeedException
     */
    //public static ObjectNode getGoalSorted(String field, int limit) throws TvmaxFeedException {
    public static ArrayList getGoalSorted(String field, int limit) throws TvmaxFeedException {
        List<SqlRow> rows = null ,rows2 = null;
        //ObjectNode result = Json.newObject();
        ArrayList result = new ArrayList();
        try {
            if(field.equalsIgnoreCase("match_number")){
                ArrayList<JsonNode> toReturn = new ArrayList<>();
                String query1 = "SELECT match_number FROM tvmax_matches order by match_number" ;
                String query = "SELECT g.team, g.player,g.score_time, g.id_video_kaltura, m.match_number, m.match_date FROM tvmax_matches as m, tvmax_goals as g where m.match_number = g.id_game AND m.match_number = " ;
                EbeanServer server = Ebean.getServer("default");
                rows = server.createSqlQuery(query1).findList();
                if(!rows.isEmpty()){
                    int fieldIndex = rows.get(0).getInteger(field);
                    for(int i = 0; i < rows.size(); i++){
                        rows2 = server.createSqlQuery(query + rows.get(i).getInteger(field)).findList();
                        if(!rows2.isEmpty()){
                            ObjectNode obj = Json.newObject();
                            obj.put(""+rows.get(i).getInteger(field),Json.toJson(rows2));
                            result.add(obj);
                            //result.put(""+rows.get(i).getInteger(field), Json.toJson(rows2));
                        }
                    }
                }
            } else {
                String query1 = "SELECT " + field + ",id_goal FROM tvmax_goals order by " + field ;
                String query = "SELECT g.team, g.player,g.score_time, g.id_video_kaltura, m.match_number, m.match_date FROM tvmax_goals as g, tvmax_matches as m where m.match_number = g.id_game and g.id_goal in ";//order by " + field + " LIMIT " + limit;
                EbeanServer server = Ebean.getServer("default");
                rows = server.createSqlQuery(query1).findList();
                if(!rows.isEmpty()){
                    StringBuilder in = new StringBuilder();
                    String fieldIndex = rows.get(0).getString(field);
                    for(int i = 0; i <= rows.size(); i++){
                        in.append(",");
                        String actual = rows.get(i<rows.size()?i:(rows.size()-1)).getString(field);
                        if(actual.equalsIgnoreCase(fieldIndex)){
                            in.append(rows.get(i<rows.size()?i:(rows.size()-1)).getLong("id_goal"));
                        }
                        if(i == rows.size() -1 || !actual.equalsIgnoreCase(fieldIndex)){
                            if(in.charAt(in.length() - 1) == ','){
                                in.deleteCharAt(in.length() - 1);
                            }
                            if(in.charAt(0) == ','){
                                in.deleteCharAt(0);
                            }
                            rows2 = server.createSqlQuery(query + "(" + in + ")").findList();
                            ObjectNode obj = Json.newObject();
                            obj.put(fieldIndex, Json.toJson(rows2));
                            result.add(obj);
                            if(!actual.equalsIgnoreCase(fieldIndex)){
                                fieldIndex = rows.get(i).getString(field);
                                in.delete(0, in.length());
                                in.append(rows.get(i<rows.size()?i:(rows.size()-1)).getLong("id_goal"));
                            }
                        }
                    }
                }
            }
        } catch (Exception ex) {
            //error devolver que no existe
            System.out.println(ex.getMessage());
            throw new TvmaxFeedException("ocurrio un error ordenando los gol por el field:" + field   , ex);
        }
        return result;
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
