package models.wap;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by alidaniel on 02/23/2015.
 */
public class Domain {

    public static final String URL_FOOTBALL_MANAGER = "http://footballmanager.hecticus.com/";
    public static final String URL_FOOTBALL_MANAGER_BRAZIL = "http://brazil.footballmanager.hecticus.com/";
    public static final String VERSION = "0.0.2";

    public Domain() {}

    public String news(Integer idNews){
        if (idNews == 0) {
            return URL_FOOTBALL_MANAGER + "newsapi/" + VERSION + "/news/scroll/1";
        } else {
            return URL_FOOTBALL_MANAGER + "newsapi/" + VERSION + "/news/get/" + idNews;
        }
    }

    public String matches(Integer idCompetition, Integer limit, Integer page){
        Date dNow = new Date();
        SimpleDateFormat sDf = new SimpleDateFormat ("yyyyMMdd");

        return URL_FOOTBALL_MANAGER + "footballapi/" + VERSION + "/matches/competition/date/paged/1/" + idCompetition + "/"
                + sDf.format(dNow)
                + "?pageSize=" + limit
                + "&page=" + page;
    }

    public String competitions(){
        return URL_FOOTBALL_MANAGER + "footballapi/" + VERSION + "/competitions/list/1";
    }

    public String scorers(Integer idCompetition){
        return URL_FOOTBALL_MANAGER + "footballapi/" + VERSION + "/players/competition/scorers/1/" + idCompetition + "?pageSize=10&page=0";
    }

    public String mtm(Integer idCompetition, Integer idMatch, Integer idEvent) {
        return URL_FOOTBALL_MANAGER + "footballapi/"+ VERSION + "/matches/mam/next/1"
                + "/" + idCompetition
                + "/" + idMatch
                + "/" + idEvent;
    }

    public String createClient() {
        return  URL_FOOTBALL_MANAGER_BRAZIL + "futbolbrasil/v1/clients/create";
    }

    public String getClient(Integer id) {
        return  URL_FOOTBALL_MANAGER_BRAZIL + "futbolbrasil/v2/client/" + id + "?upstreamChannel=web";
    }

    public String loading() {
        return  URL_FOOTBALL_MANAGER_BRAZIL + "api/loading/0/0/" + VERSION + "/wap";
    }
}
