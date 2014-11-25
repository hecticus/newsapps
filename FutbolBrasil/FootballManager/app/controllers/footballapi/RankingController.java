package controllers.footballapi;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.football.Competition;
import models.football.Phase;
import models.football.Rank;
import play.mvc.Result;
import play.libs.Json;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chrirod on 11/24/14.
 */
public class RankingController extends HecticusController {
    public static Result getRankings(Integer idApp){
        try {
            //get all competitions based on the app
            List<Competition> competitions = Competition.getCompetitionsByApp(idApp);
            ArrayList data = new ArrayList();
            for(int i=0; i<competitions.size(); ++i){
                //por cada competition obtenemos todas las fases
                List<Phase> phases = Phase.getAllPhases(competitions.get(i).getIdCompetitions());
                ArrayList phasesIds = new ArrayList();
                ArrayList phasesObjs = new ArrayList();
                for(int j=0; j<phases.size(); ++j){
                    phasesIds.add(phases.get(j).getIdPhases());
                    phasesObjs.add(phases.get(j).toJson());
                }
                //obtenemos el ranking por
                List<Rank> rankings = Rank.getListByListPhase(phasesIds);
                ArrayList rankingObjs = new ArrayList();
                for(int z=0; z<rankings.size(); ++z){
                    rankingObjs.add(rankings.get(z).toJsonPhaseID());
                }
                ObjectNode competition = competitions.get(i).toJson();
                competition.put("ranks",Json.toJson(rankingObjs));
                competition.put("phases",Json.toJson(phasesObjs));
                data.add(competition);
            }
            //build response
            ObjectNode response;
            response = hecticusResponse(0, "ok", "rankings", data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error al traer los rankings:" + ex.toString()));
        }
    }
}
