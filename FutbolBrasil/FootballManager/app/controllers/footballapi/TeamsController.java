package controllers.footballapi;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.Apps;
import models.Config;
import models.football.Competition;
import models.football.Scorer;
import models.football.Team;
import play.libs.Json;
import play.mvc.Result;
import utils.Utils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by plesse on 1/27/15.
 */
public class TeamsController  extends HecticusController {

    public static Result getTeamsForApp(Integer idApp, Integer pageSize, Integer page){
        try {
            Apps app = Apps.findId(idApp);
            ArrayList responseData = new ArrayList();
            List<Team> teams = null;
            if(pageSize == 0){
                teams = Team.finder.all();
            } else {
                teams = Team.finder.fetch("competitions").where().eq("competitions.competition.app", app).orderBy("name asc").setFirstRow(page).setMaxRows(pageSize).findList();
            }
            for(Team team : teams){
                responseData.add(team.toJsonSimple());
            }
            return ok(hecticusResponse(0, "ok", "teams", responseData));
        }catch (Exception ex){
            return internalServerError(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getTeams(Integer idCompetition){
        ObjectNode result = Json.newObject();
        try{
            List<Team> list = Team.getList();
            ArrayList<ObjectNode> jlist = new ArrayList<ObjectNode>();
            Iterator<Team> it = list.iterator();
            while(it.hasNext()){
                jlist.add(it.next().toJson());
            }
            result.put(Config.ERROR_KEY, 0);
            result.put(Config.DESCRIPTION_KEY,"OK");
            result.put(Config.RESPONSE_KEY, Json.toJson(jlist));
            return ok(result);
        }catch(Exception ex){
            Utils.printToLog(AfpFutbolWs.class, "Error desconocido en Play", "Ocurrio un error en getTeams", true, ex, "support-level-1", Config.LOGGER_ERROR);
            result.put(Config.ERROR_KEY, 1);
            result.put(Config.DESCRIPTION_KEY,ex.getMessage());

        }
        return badRequest(result);
    }

    public static Result getTeam(Long idTeam){
        ObjectNode result = Json.newObject();
        try{
            Team team = Team.findById(idTeam);
            result.put(Config.ERROR_KEY, 0);
            result.put(Config.DESCRIPTION_KEY,"OK");
            result.put(Config.RESPONSE_KEY,(team!=null)?team.toJson():null);
            return ok(result);
        }catch(Exception ex){
            Utils.printToLog(AfpFutbolWs.class, "Error desconocido en Play", "Ocurrio un error en getTeam, con el parámetro " + idTeam, true, ex, "support-level-1", Config.LOGGER_ERROR);
            result.put(Config.ERROR_KEY, 1);
            result.put(Config.DESCRIPTION_KEY,ex.getMessage());

        }
        return badRequest(result);
    }

    public static Result getTeamsGt(Long idTeam){
        ObjectNode result = Json.newObject();
        try{
            List<Team> teams = Team.finder.where().gt("idTeams", idTeam).findList();
            ArrayList<ObjectNode> teamsList = new ArrayList<>();
            if(teams != null && !teams.isEmpty()){
                for(Team team : teams){
                    teamsList.add(team.toJsonSimple());
                }
            }
            return ok(hecticusResponse(0, "ok", "teams", teamsList));
        }catch(Exception ex){
            Utils.printToLog(TeamsController.class, "Error desconocido en Play", "Ocurrio un error en getTeam, con el parámetro " + idTeam, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }
}
