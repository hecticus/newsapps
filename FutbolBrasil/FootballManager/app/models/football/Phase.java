package models.football;

import com.avaje.ebean.ExpressionList;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.TimeZone;

/**
 * Created by karina on 5/13/14.
 */
@Entity
@Table(name="phases")
public class Phase extends HecticusModel {

    @Id
    private Long idPhases;
    @ManyToOne
    @JoinColumn(name = "id_competitions")
    private Competition comp;
    @Constraints.Required
    private String globalName;
    @Constraints.Required
    private String name;
    @Constraints.Required
    @Constraints.MaxLength(8)
    private String startDate;
    @Constraints.Required
    @Constraints.MaxLength(8)
    private String endDate;
    private Long extId;

    private Integer orden;
    private Integer nivel;
    private Integer fn;

    @OneToMany(mappedBy = "phase")
    private List<GameMatch> matches;

    private static Model.Finder<Long,Phase> finder = new Model.Finder<Long,Phase>(Long.class,Phase.class);

    public Phase(){

    }

    public Phase(Competition comp, String globalName, String name, String startDate, String endDate, Long extId, Integer order, Integer nivel, Integer fn) {
        this.comp = comp;
        this.globalName = globalName;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.extId = extId;
        this.orden = order;
        this.nivel = nivel;
        this.fn = fn;
    }

    public Long getIdPhases() {
        return idPhases;
    }

    public void setIdPhases(Long idPhases) {
        this.idPhases = idPhases;
    }

    public Competition getComp() {
        return comp;
    }

    public void setComp(Competition comp) {
        this.comp = comp;
    }

    public String getGlobalName() {
        return globalName;
    }

    public void setGlobalName(String globalName) {
        this.globalName = globalName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Long getExtId() {
        return extId;
    }

    public void setExtId(Long extId) {
        this.extId = extId;
    }

    public Integer getOrder() {
        return orden;
    }

    public void setOrder(Integer order) {
        this.orden = order;
    }

    public Integer getNivel() {
        return nivel;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }

    public Integer getFn() {
        return fn;
    }

    public void setFn(Integer fn) {
        this.fn = fn;
    }

    public List<GameMatch> getMatches() {
        return matches;
    }

    public void setMatches(List<GameMatch> matches) {
        this.matches = matches;
    }

    public static Phase findById(Long id){
        return finder.byId(id);
    }

    public static Phase findByExtId(Long idExt){
        return finder.where().eq("extId",idExt).findUnique();
    }

    public static List<Phase> findByNivel(Competition competition, int nivel){
        return finder.where().eq("comp", competition).eq("nivel", nivel).findList();
    }

    public static List<Phase> findByGlobalName(Competition competition, String globalName){
        return finder.where().eq("comp", competition).eq("globalName", globalName).findList();
    }

    public static List<Phase> getList(Long idCompetition,String sd, String end){
        //System.out.println("Phase idCompetition:"+idCompetition);
        //if(sd.isEmpty() && end.isEmpty()) return finder.all();
        ExpressionList<Phase> phases = finder.where().eq("id_competitions",idCompetition);
        if(!sd.isEmpty()){
            if(sd.contains("-")){
                String[] range = sd.split("-");
                phases.ge("startDate", range[0]);
                phases.le("startDate", range[1]);
            }else{
                phases.eq("startDate", sd);
            }
        }

        if(!end.isEmpty()){
            if(end.contains("-")){
                String[] range = end.split("-");
                phases.ge("endDate", range[0]);
                phases.le("endDate", range[1]);
            }else{
                phases.eq("endDate", end);
            }
        }

        return phases.findList();
    }

    public static List<Phase> getAllPhases(Long idCompetition){
        return finder.where().eq("id_competitions",idCompetition).findList();
    }

    public static List<Phase> getTodayPhases(Long idCompetition){
        Calendar today = new GregorianCalendar(TimeZone.getDefault());
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
        String formattedToday = simpleDateFormat.format(today.getTime());

        return finder.where().eq("id_competitions",idCompetition).le("startDate", formattedToday).ge("endDate", formattedToday).findList();
    }

    public static List<Phase> getPhaseByDate(Long idCompetition, String formattedToday){
        return finder.where().eq("id_competitions",idCompetition).le("startDate", formattedToday).ge("endDate", formattedToday).findList();
    }

    public static Phase getUniquePhaseByDate(Competition competition, String formattedToday){
        return finder.where().eq("comp", competition).le("startDate", formattedToday).ge("endDate", formattedToday).findUnique();
    }

    public static List<Phase> getPhasesFromDate(Competition competition, String date){
        return finder.where().eq("comp", competition).ge("start_date", date).findList();
    }

    public static List<Phase> getLatestPhasesPaged(Competition competition, int index, int size) {
        return finder.where().eq("comp", competition).orderBy("start_date desc").setFirstRow(index).setMaxRows(size).findList();
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode obj = Json.newObject();
        obj.put("id_phases",idPhases);
        obj.put("global_name",globalName);
        obj.put("name",name);
        obj.put("start_date",startDate);
        obj.put("end_date",endDate);
        obj.put("ext_id",extId);

        return obj;
    }



    public ObjectNode toJsonSimple() {
        ObjectNode obj = Json.newObject();
        obj.put("id_initial_phases",idPhases);
        obj.put("competition", comp.toJsonSimple());
        obj.put("global_name",globalName);
        obj.put("name",name);
        obj.put("start_date",startDate);
        obj.put("end_date",endDate);
        obj.put("ext_id",extId);
        return obj;
    }


    public void validatePhase(){
        Phase toValidate = findByExtId(this.extId);
        if (toValidate != null){
            this.idPhases = toValidate.idPhases;
            this.comp = toValidate.comp;
            this.globalName = toValidate.globalName;
            this.name = toValidate.name;
            this.startDate = toValidate.startDate;
            this.endDate = toValidate.endDate;
            this.extId = toValidate.extId;
        }else {
            this.save();
        }
    }

    public static Phase getPhaseByFn(long idCompetition, int fn){
        if (fn == 0){
            return finder.where().eq("id_competitions",idCompetition).orderBy("fn asc").setMaxRows(1).findUnique();
        }else {
            return finder.where().eq("id_competitions",idCompetition).eq("fn",fn).setMaxRows(1).findUnique();
        }

    }


}
