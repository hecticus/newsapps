package controllers.footballapi;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.football.Competition;
import models.football.GameMatch;
import models.football.Phase;
import models.football.Rank;
import play.mvc.Result;
import play.libs.Json;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by chrirod on 11/24/14.
 */
public class RankingController extends HecticusController {

    public static Result getRankings(Integer idApp, String formattedToday){
        try {
            //get all competitions based on the app
            List<Competition> competitions = Competition.getCompetitionsByApp(idApp);
            ArrayList data = new ArrayList();
            for(int i=0; i<competitions.size(); ++i){
                List<Phase> phases = Phase.getPhaseByDate(competitions.get(i).getIdCompetitions(), formattedToday);
                if(phases != null && !phases.isEmpty()) {
                    ArrayList phasesIds = new ArrayList();
                    ArrayList phasesObjs = new ArrayList();
                    for (int j = 0; j < phases.size(); ++j) {
                        List<Rank> ranks = Rank.finder.where().eq("id_phases", phases.get(j).getIdPhases()).orderBy("nivel asc, orden asc").findList();
                        if (ranks != null && !ranks.isEmpty()) {
                            ObjectNode phase = phases.get(j).toJson();
                            ArrayList rankingObjs = new ArrayList();
                            for (int z = 0; z < ranks.size(); ++z) {
                                rankingObjs.add(ranks.get(z).toJsonPhaseID());
                            }
                            phase.put("ranks", Json.toJson(rankingObjs));
                            phasesObjs.add(phase);
                        }
                    }
                    ObjectNode competition = competitions.get(i).toJsonSimple();
                    competition.put("phases", Json.toJson(phasesObjs));
                    data.add(competition);
                }
            }
            //build response
            ObjectNode response;
            response = hecticusResponse(0, "ok", "rankings", data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error al traer los rankings:" + ex.toString()));
        }
    }

    public static Result getRankingsForPhase(Integer idApp, Integer idCompetition, Long idPhase, Integer way){
        try {
            ObjectNode response = null;
            Competition competition = Competition.getCompetitionByApp(idApp, idCompetition);
            if(competition != null){
                Phase phase = null;
                List<Rank> ranks = null;
                ObjectNode data = Json.newObject();
                Calendar today = new GregorianCalendar(TimeZone.getDefault());
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
                String formattedToday = simpleDateFormat.format(today.getTime());
                if(competition.getType().getType() == 0){//LIGA
                    if(idPhase > 0){
                        phase = Phase.finder.byId(idPhase);
                    } else {
                        phase = Phase.finder.where().eq("comp", competition).le("startDate", formattedToday).ge("endDate", formattedToday).findUnique();
                    }
                    if(phase != null){
                        ranks = Rank.finder.where().eq("id_phases", phase.getIdPhases()).orderBy("points desc, goalDiff desc").findList();
                        if (ranks != null && !ranks.isEmpty()) {
                            ArrayList rankingObjs = new ArrayList();
                            ArrayList<ObjectNode> group = new ArrayList<>();
                            for (int z = 0; z < ranks.size(); ++z) {
                                group.add(ranks.get(z).toJsonPhaseID());
                            }
                            ObjectNode member = Json.newObject();
                            member.put("group_name", "GENERAL");
                            member.put("ranking", Json.toJson(group));
                            rankingObjs.add(member);
                            data.put("tree", false);
                            data.put("phase", phase.toJsonSimple());
                            data.put("ranking", Json.toJson(rankingObjs));
                            response = hecticusResponse(0, "ok", data);
                        } else {
                            response = buildBasicResponse(3, "El ranking de la phase " + idPhase + " no existe o esta vacio");
                        }
                    } else {
                        response = buildBasicResponse(4, "La phase " + idPhase + " no existe");
                    }
                } else if(competition.getType().getType() == 1){//ARBOL
                    List<Phase> phases = null;
                    if(way != 0 && idPhase <= 0){
                        //invalid
                        phases = null;
                    } else if(way == 1){
                        //next
                        phase = Phase.finder.byId(idPhase);
                        phases = Phase.finder.where().eq("comp", competition).eq("nivel", phase.getNivel()+1).findList();
                    } else if(way == -1){
                        //previous
                        phase = Phase.finder.byId(idPhase);
                        phases = Phase.finder.where().eq("comp", competition).eq("nivel", phase.getNivel()-1).findList();
                    } else if(idPhase > 0) {
                        phase = Phase.finder.byId(idPhase);
                        phases = Phase.finder.where().eq("comp", competition).eq("globalName", phase.getGlobalName()).findList();
                    } else {
                        phases = Phase.getPhaseByDate(competition.getIdCompetitions(), formattedToday);
                    }
                    if(phases != null && !phases.isEmpty()) {
                        phase = phases.get(0);
                        List<GameMatch> gameMatches = GameMatch.finder.where().in("phase", phases).orderBy("phase asc").findList();
                        if (gameMatches != null && !gameMatches.isEmpty()) {
                            ArrayList rankingObjs = new ArrayList();
                            ArrayList<ObjectNode> group = new ArrayList<>();
                            for (int z = 0; z < gameMatches.size(); ++z) {
                                ObjectNode member = Json.newObject();
                                member.put("group_name", phase.getGlobalName());
                                group.add(gameMatches.get(z).toJson());
                                member.put("ranking", Json.toJson(group));
                                rankingObjs.add(member);
                                group.clear();
                            }
                            data.put("tree", true);
                            data.put("phase", phase.toJsonSimple());
                            data.put("ranking", Json.toJson(rankingObjs));
                            response = hecticusResponse(0, "ok", data);
                        } else {
                            if(way != 0){
                                response = buildBasicResponse(0, "La phase " + idPhase + " no tiene siguiente");
                            } else {
                                response = buildBasicResponse(3, "El ranking de la phase " + idPhase + " no existe o esta vacio");
                            }
                        }
                    } else {
                        if(way != 0){
                            response = buildBasicResponse(0, "La phase " + idPhase + " no tiene anterior");
                        } else {
                            response = buildBasicResponse(4, "La phase " + idPhase + " no existe");
                        }
                    }
                } else {
                    List<Phase> phases = null;
                    if(idPhase > 0){
                        phase = Phase.finder.byId(idPhase);
                        phases = Phase.finder.where().eq("comp", competition).eq("globalName", phase.getGlobalName()).findList();
                    } else {
                        phases = Phase.finder.where().eq("comp", competition).le("startDate", formattedToday).ge("endDate", formattedToday).findList();
                    }
                    if(phases != null && !phases.isEmpty()) {
                        phase = phases.get(0);
                        if (phase.getNivel() == 1) {//TABLA
                            ranks = Rank.finder.where().in("phase", phases).orderBy("nivel asc, orden asc, points desc, goalDiff desc").findList();
                            if (ranks != null && !ranks.isEmpty()) {
                                ArrayList<ObjectNode> group = new ArrayList<>();
                                Rank pivot = ranks.get(0);
                                ArrayList rankingObjs = new ArrayList();
                                char groupName = 65;
                                for (Rank rank : ranks) {
                                    if(rank.getNivel() == pivot.getNivel()){
                                        group.add(rank.toJsonPhaseID());
                                    } else {
                                        ObjectNode member = Json.newObject();
                                        member.put("group_name", ""+groupName);
                                        member.put("ranking", Json.toJson(group));
                                        rankingObjs.add(member);
                                        ++groupName;
                                        group.clear();
                                        group.add(rank.toJsonPhaseID());
                                        pivot = rank;
                                    }
                                }
                                if(!group.isEmpty()){
                                    ObjectNode member = Json.newObject();
                                    member.put("group_name", ""+groupName);
                                    member.put("ranking", Json.toJson(group));
                                    rankingObjs.add(member);
                                    group.clear();
                                }
                                data.put("tree", phase.getNivel() > 1);
                                data.put("phase", phase.toJsonSimple());
                                data.put("ranking", Json.toJson(rankingObjs));
                                response = hecticusResponse(0, "ok", data);
                            } else {
                                response = buildBasicResponse(3, "El ranking de la phase " + idPhase + " no existe o esta vacio");
                            }
                        } else {//ARBOL
                            phase = phases.get(0);
                            List<GameMatch> gameMatches = GameMatch.finder.where().in("phase", phases).orderBy("phase asc").findList();
                            if (gameMatches != null && !gameMatches.isEmpty()) {
                                ArrayList rankingObjs = new ArrayList();
                                ArrayList<ObjectNode> group = new ArrayList<>();
                                for (int z = 0; z < gameMatches.size(); ++z) {
                                    ObjectNode member = Json.newObject();
                                    member.put("group_name", phase.getGlobalName());
                                    group.add(gameMatches.get(z).toJson());
                                    member.put("ranking", Json.toJson(group));
                                    rankingObjs.add(member);
                                    group.clear();
                                }
                                data.put("tree", true);
                                data.put("phase", phase.toJsonSimple());
                                data.put("ranking", Json.toJson(rankingObjs));
                                response = hecticusResponse(0, "ok", data);
                            }
                        }
                    } else {
                        response = buildBasicResponse(4, "El ranking de la phase " + idPhase + " no existe o esta vacio");
                    }
                }
            } else {
                response = buildBasicResponse(1, "La competencia " + idCompetition + " no esta disponible para la app " + idApp);
            }
            return ok(response);
        }catch (Exception ex){
            ex.printStackTrace();
            return badRequest(buildBasicResponse(-1, "ocurrio un error al traer los rankings:" + ex.toString()));
        }
    }


}
