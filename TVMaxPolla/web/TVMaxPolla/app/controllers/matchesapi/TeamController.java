package controllers.matchesapi;

import controllers.HecticusController;
import models.matches.Team;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chrirod on 3/27/14.
 */
public class TeamController extends HecticusController {

    public static Result getById(Integer idTeam, Boolean hecticResponse){
        try{
            Team singleTeam = Team.getTeam(idTeam);
            ArrayList data = new ArrayList();
            data.add(singleTeam.toJson());
            //build response
            ObjectNode response;
            if (hecticResponse){
                response = hecticusResponse(0, "ok", "teams", data);
            }else {
                response = tvmaxResponse("teams",data);
            }
            return ok(response);

        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    public static Result test(){
        return ok("comm check, comm check, do you read me?");
    }
}
