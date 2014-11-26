package controllers.footballapi;

import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.football.Competition;
import models.football.Scorer;
import play.libs.Json;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by sorcerer on 10/28/14.
 */
public class PlayersController extends HecticusController {

    public static Result getTopScorers(Long idCompetition, String date){
        try {
            List<Scorer> fullList = Scorer.getTournamentScorers(idCompetition,date);
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = hecticusResponse(0, "ok", "news", data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result getPlayersByTeam(Long idTeam){
        try{List<Scorer> fullList = null;
            ArrayList data = new ArrayList();
            if (fullList != null && !fullList.isEmpty()){
                //i got data
                for (int i = 0; i < fullList.size(); i++){
                    data.add(fullList.get(i).toJson());
                }
            }
            //build response
            ObjectNode response;
            response = hecticusResponse(0, "ok", "news", data);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }


    public static Result getTopScorersByCompetition(Integer idApp){
        try {
            ObjectNode response = null;
            ArrayList data = new ArrayList();
            ArrayList responseData = new ArrayList();
            List<Competition> competitionsByApp = Competition.getCompetitionsByApp(idApp);
            for(Competition competition : competitionsByApp) {
                List<Scorer> fullList = Scorer.getTournamentScorers(competition.getIdCompetitions());
                ObjectNode competitionJson = competition.toJson();
                if (fullList != null && !fullList.isEmpty()){
                    //i got data
                    for (int i = 0; i < fullList.size(); i++){
                        data.add(fullList.get(i).toJson());
                    }
                    competitionJson.put("scorers", Json.toJson(data));
                    data.clear();
                }
                responseData.add(competitionJson);
            }
            response = hecticusResponse(0, "ok", "leagues", responseData);
            return ok(response);
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }
}
