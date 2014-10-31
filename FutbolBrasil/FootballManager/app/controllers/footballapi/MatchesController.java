package controllers.footballapi;

import controllers.HecticusController;
import play.mvc.Result;

/**
 * Created by sorcerer on 10/29/14.
 */
public class MatchesController extends HecticusController {

    public static Result getFixtures(Long idCompetition){
        return ok();
    }

    //todays calendar

    //todays result
    public static Result getTodayFinished(){
        return null;
    }



}
