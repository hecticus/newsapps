package models.football;

import com.avaje.ebean.Expr;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.Apps;
import models.HecticusModel;
import models.Language;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by karina on 5/13/14.
 */
@Entity
@Table(name="competitions")
public class Competition  extends HecticusModel {
    @Id
    private Long idCompetitions;
    @Constraints.Required
    private String name;
    @Constraints.Required
    private Long extId;

//    @ManyToOne
//    @JoinColumn(name = "id_app")
//    private Apps app;

    private Integer idApp;
    private Integer status;

    @ManyToOne
    @JoinColumn(name = "id_comp_type")
    private CompetitionType type;

    @OneToMany(mappedBy="comp")
    public List<Phase> phases;

    @OneToMany(mappedBy="competition")
    private List<TeamHasCompetition> teams;

    @OneToMany(mappedBy="competition")
    private List<GameMatch> matches;

    @OneToMany(mappedBy = "competition")
    private List<CompetitionHasLocalization> localizations;

    public Competition(String name, Long extId, Integer idApp, CompetitionType type) {
        this.name = name;
        this.extId = extId;
        this.idApp = idApp;
        this.status = 0;
        this.type = type;
    }

    private static Model.Finder<Long,Competition> finder = new Model.Finder<Long, Competition>(Long.class, Competition.class);

    public Long getIdCompetitions() {
        return idCompetitions;
    }

    public void setIdCompetitions(Long idCompetitions) {
        this.idCompetitions = idCompetitions;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getExtId() {
        return extId;
    }

    public void setExtId(Long extId) {
        this.extId = extId;
    }

    public Integer getIdApp() {
        return idApp;
    }

    public void setIdApp(Integer idApp) {
        this.idApp = idApp;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public CompetitionType getType() {
        return type;
    }

    public void setType(CompetitionType type) {
        this.type = type;
    }

    public static Competition findById(Long id){
        return finder.byId(id);
    }

    public List<Phase> getPhases() {
        return phases;
    }

    public void setPhases(List<Phase> phases) {
        this.phases = phases;
    }

    public List<TeamHasCompetition> getTeams() {
        return teams;
    }

    public void setTeams(List<TeamHasCompetition> teams) {
        this.teams = teams;
    }

    public List<GameMatch> getMatches() {
        return matches;
    }

    public void setMatches(List<GameMatch> matches) {
        this.matches = matches;
    }

    public static List<Competition> getCompetitionsByApp(int idApp){
        return finder.where().eq("id_app", idApp).eq("status", 1).findList();
    }

    public static List<Competition> getCompetitionsByAppNotIn(int idApp, ArrayList<Long> competitionsIDs){
        return finder.where().eq("id_app", idApp).eq("status", 1).not(Expr.in("idCompetitions", competitionsIDs)).findList();
    }

    public static List<Competition> getActiveCompetitionsByApp(int idApp){
        return finder.where().eq("id_app", idApp).eq("status", 1).findList();
    }

    public static Competition findByExtId(long id){
        return finder.where().eq("ext_id", id).findUnique();
    }

    public static Competition findByCompExt(int idApp, long extId ){
        return finder.where().eq("id_app", idApp).eq("ext_id", extId).findUnique();
    }

    public static Competition getCompetitionByApp(int idApp, int idCompetition){
        return finder.where().eq("id_app", idApp).eq("idCompetitions", idCompetition).eq("status", 1).findUnique();
    }

    public static List<Competition> getCompetitionsPage(int idApp, int page, int pageSize, String date){
        return finder.fetch("matches").where().eq("id_app", idApp).eq("status", 1).ilike("matches.date", date+"%").setFirstRow(page).setMaxRows(pageSize).findList();
    }

    public void validate(Language language){
        //check if exist
        Competition fromDb = findByCompExt(this.idApp, this.extId);
        if ( fromDb != null){
            //existe
            this.name = fromDb.name;
            this.extId = fromDb.extId;
            this.status = fromDb.status;
            this.idApp = fromDb.idApp;
            this.idCompetitions = fromDb.idCompetitions;
            this.type = fromDb.type;
            this.localizations = fromDb.localizations;
        }else {
            //insertar
            this.save();
        }
        CompetitionHasLocalization competitionHasLocalization = new CompetitionHasLocalization(this, language, this.name);
        if(!CompetitionHasLocalization.exists(competitionHasLocalization)){
            System.out.println("no existe " + this.getName() + " " + language.getName());
            this.localizations.add(competitionHasLocalization);
            competitionHasLocalization.save();
            this.update();
        }
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode obj = Json.newObject();
        obj.put("id_competitions",idCompetitions);
        obj.put("name",name);
        obj.put("ext_id",extId);
        obj.put("competiton_type", type.toJson());
        if(phases != null && !phases.isEmpty()){
            ArrayList<ObjectNode> phasesList = new ArrayList<>(phases.size());
            for(Phase phase : phases){
                phasesList.add(phase.toJson());
            }
            obj.put("phases", Json.toJson(phasesList));
        }
        return obj;
    }

    public ObjectNode toJsonNoPhases() {
        ObjectNode obj = Json.newObject();
        obj.put("id_competitions",idCompetitions);
        obj.put("name",name);
        obj.put("ext_id",extId);
        obj.put("competiton_type", type.toJson());
        return obj;
    }

    public ObjectNode toJsonSimple() {
        ObjectNode obj = Json.newObject();
        obj.put("id_competitions",idCompetitions);
        obj.put("name",name);
        obj.put("ext_id",extId);
        return obj;
    }

}
