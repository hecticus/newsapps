package backend.jobs.scrapers.perform;

import backend.HecticusThread;
import exceptions.BadConfigException;
import models.Config;
import models.Language;
import models.football.*;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import utils.Utils;
import utils.WebServicesManager;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.io.StringReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.Map;

/**
 * Created by sorcerer on 4/6/15.
 */
public class OptasportsScraper extends HecticusThread {

    private Language language;
    //variables para cargar la config de opta
    private String optaUserName,
            optaAuthKey;
    private final String ID = "#ID#";

    public void process(Map args){
        try {
            Utils.printToLog(OptasportsScraper.class, null, "Iniciando OptasportsScraper", false, null, "support-level-1", Config.LOGGER_INFO);

            if (args.containsKey("language")) {
                language = Language.getByID(Integer.parseInt((String) args.get("language")));
                if(language == null)
                    throw new BadConfigException("el language configurado no existente");
            } else
                throw new BadConfigException("es necesario configurar el parametro language");

            boolean check = false;
            if (check){
                //get perform configs optaUserName and opatAuthKey
                if (args.containsKey("username")) {
                    optaUserName = (String) args.get("username");
                } else
                    throw new BadConfigException("es necesario configurar el parametro username");

                if (args.containsKey("token")) {
                    optaAuthKey = (String) args.get("token");
                } else
                    throw new BadConfigException("es necesario configurar el parametro token");

            }
            //read data from ws
            initProcess();

        } catch (BadConfigException ex){
            Utils.printToLog(OptasportsScraper.class,
                    "Error en OptasportsScraper",
                    "el job esta mal configurado por favor revisar, el proceso no se esta revisando",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        } catch (Exception ex){
            Utils.printToLog(OptasportsScraper.class,
                    "Error en OptasportsScraper",
                    "error inesperado en el OptasportsScraper, el proceso no fue finalizado. se reintentara",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
        Utils.printToLog(OptasportsScraper.class,null,"finalizando el OptasportsScraper",false,null,"support-level-1",Config.LOGGER_INFO);
    }

    private String sendRequest(String urlAddress, String parameters){
        try {
            URL url = new URL(urlAddress);
            WebServicesManager aConnection = new WebServicesManager(url);
            Object obj = aConnection.getExternalContent(parameters,false);
            if (obj != null){
                StringBuffer response = (StringBuffer) obj;
                String respString = response.toString();
                try {
                    return respString.substring(respString.indexOf("<"));
                }catch (Exception ex){
                    throw new Exception("la respuesta recibida no es un XML, recibida:" + respString.toString() + " "+ ex.toString());
                }
            }
        }catch (Exception ex){
            Utils.printToLog(OptasportsScraper.class,
                    "Error en OptasportsScraper",
                    "error realizando la peticion al ws:" + urlAddress,
                    false,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
        return null;
    }

    private String cleanDateAndTime(String original){
        //2015-04-08 15:55:54
        String tr = original.replaceAll("-","");
        tr = tr.replaceAll(":","");
        tr = tr.replaceAll(" ", "");
        return tr;
    }

    private String cleanDate(String original){
        //2014-07-01
        String tr = original.replaceAll("-", "");
        return tr;
    }

    private String cleanHour(String original){
        String tr = original.replaceAll(":","");
        return tr;
    }

    private long stringLongParser(String value){
        long tr = 0;
        try {
            if (value!= null && !value.isEmpty()){
                tr = Long.parseLong(value);
            }
        }catch (Exception ex){
            tr = 0;
        }
        return tr;
    }

    private int stringIntParser(String value){
        int tr = 0;
        try {
            if (value!= null && !value.isEmpty()){
                tr = Integer.parseInt(value);
            }
        }catch (Exception ex){
            tr = 0;
        }
        return tr;
    }

    private void initProcess(){
        //es necesario un filtro por region????
        try {
            //get avaible leagues
            String url = "http://api.core.optasports.com/soccer/get_seasons?authorized=yes&username=upstream&authkey=8277e0910d750195b448797616e091ad"+"&lang=pt";
            String xmlRespose = sendRequest(url, "");
            InputSource source = new InputSource(new StringReader(xmlRespose));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            NodeList competitions = (NodeList) xPath.compile("gsmrs/competition").evaluate(source, XPathConstants.NODESET);
            for (int i = 0; i < competitions.getLength(); i++) {
                Node currentCompetition = competitions.item(i);
                try{
                    //get data from current comp
                    String competitionName = xPath.compile("@name").evaluate(currentCompetition),
                        competitionsExternalId =  xPath.compile("@competition_id").evaluate(currentCompetition),
                            areaId = xPath.compile("@area_id").evaluate(currentCompetition),
                            areaIdName = xPath.compile("@area_name").evaluate(currentCompetition),
                            formatName = xPath.compile("@format").evaluate(currentCompetition),
                            competitionLastUpdated = xPath.compile("@last_updated").evaluate(currentCompetition);
                    CompetitionType category = new CompetitionType(competitionName, Long.parseLong(competitionsExternalId));
                    category.validate(language);
                    //seasons
                    NodeList competitionSeasons = (NodeList) xPath.compile("season").evaluate(currentCompetition, XPathConstants.NODESET);
                    for (int j = 0; j < competitionSeasons.getLength(); j++){
                        //for each season
                        Node currentSeason = competitionSeasons.item(j);
                        String currentSeasonId = xPath.compile("@season_id").evaluate(currentSeason),
                                currentSeasonName = xPath.compile("@name").evaluate(currentSeason),
                                currentSeasonStartDate = xPath.compile("@start_date").evaluate(currentSeason),
                                currentSeasonEndDate = xPath.compile("@end_date").evaluate(currentSeason),
                                currentSeasonLastUptdated = xPath.compile("@last_updated").evaluate(currentSeason);
                        String name = category.getName() + " " + currentSeasonName;
                        Competition c = new Competition(name, Long.parseLong(currentSeasonId), getApp(), category);
                        c.validate(language);
                        //get stuff
                        //fixtures
                        getFixtures(currentSeasonId, c);
                        //posiciones
                        getPositions(currentSeasonId, c);
                        //live data (minuto a minuto)
                        getMinuteByMinute(currentSeasonId, c);
                        //strikers
                        getStrikers(currentSeasonId, c);
                    }

                }catch (Exception ex){
                    //dont break cycle
                    Utils.printToLog(OptasportsScraper.class,
                            "Error en OctaScraper",
                            "error inesperado procesando los torneos disponibles, el proceso continua",
                            true,
                            ex,
                            "support-level-1",
                            Config.LOGGER_ERROR);
                }
            }
        //not alarm exception
        }catch (Exception ex){
            //alarm
            Utils.printToLog(OptasportsScraper.class,
                    "Error en OctaScraper",
                    "error inesperado procesando los torneos disponibles, no se pudieron procesar los torneos es necesario tomar acciones.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    private void getFixtures(String seasonExternalId, Competition c){
        try{
            //System.out.println("::"+ seasonExternalId);
            //generate url from constant and id
            String url = "http://api.core.optasports.com/soccer/get_matches?id=#ID#&type=season&detailed=yes&username=upstream&authkey=8277e0910d750195b448797616e091ad" +"&lang=pt";
            url = url.replace(ID, seasonExternalId);
            String xmlRespose = sendRequest(url,"");
            if (xmlRespose == null){
                throw new Exception("no se pudo procesar los partidos para la competicion:" + c.getName() + " respuesta vacia del ws");
            }
            InputSource source = new InputSource(new StringReader(xmlRespose));
            XPath xPath =  XPathFactory.newInstance().newXPath();

            NodeList rounds = (NodeList) xPath.compile("gsmrs/competition/season/round").evaluate(source, XPathConstants.NODESET);
            for (int i = 0; i < rounds.getLength(); i++){
                try {
                    Node currentRound = rounds.item(i);
                    Phase gamePhase = null;

                    String currentRoundType = xPath.compile("@type").evaluate(currentRound),
                        currentRoundName = xPath.compile("@name").evaluate(currentRound),
                        currentRoundId = xPath.compile("@round_id").evaluate(currentRound),
                        currentRoundStartDate = cleanDate(xPath.compile("@start_date").evaluate(currentRound)),
                        currentRoundEndDate = cleanDate(xPath.compile("@end_date").evaluate(currentRound));

                    int groupCant = Integer.parseInt(xPath.compile("@groups").evaluate(currentRound));
                    if (currentRoundType.equalsIgnoreCase("table")){
                        if (groupCant > 0){
                            gamePhase = new Phase(c, currentRoundName, currentRoundName,
                                    currentRoundStartDate, currentRoundEndDate, currentRoundId,
                                    0, i, i);
                            //get groups then matches
                            NodeList groups = (NodeList) xPath.compile("group").evaluate(currentRound, XPathConstants.NODESET);
                            for (int j = 0; j < groups.getLength(); j++){
                                Node currentGroup = (Node) groups.item(j);
                                NodeList matches = (NodeList) xPath.compile("match").evaluate(currentGroup, XPathConstants.NODESET);
                                for (int k = 0; k < matches.getLength(); k++){
                                    Node currentMatch = (Node) matches.item(k);
                                    //gameweek
                                    String matchExternal = xPath.compile("@match_id").evaluate(currentMatch),
                                            matchDate = xPath.compile("@date_utc").evaluate(currentMatch),
                                            matchHour = xPath.compile("@time_utc").evaluate(currentMatch),
                                            statusName = xPath.compile("@status").evaluate(currentMatch),
                                            teamAId = xPath.compile("@team_A_id").evaluate(currentMatch),
                                            teamAName = xPath.compile("@team_A_name").evaluate(currentMatch),
                                            teamAGoals = xPath.compile("@fs_A").evaluate(currentMatch),
                                            teamACountryName = xPath.compile("@team_A_country").evaluate(currentMatch),
                                            teamBId = xPath.compile("@team_B_id").evaluate(currentMatch),
                                            teamBName = xPath.compile("@team_B_name").evaluate(currentMatch),
                                            teamBGoals = xPath.compile("@fs_B").evaluate(currentMatch),
                                            teamBCountryName = xPath.compile("@team_B_country").evaluate(currentMatch),
                                            venueId = xPath.compile("matchinfo/venue/@venue_id").evaluate(currentMatch),
                                            venueName = xPath.compile("matchinfo/venue/@name").evaluate(currentMatch),
                                            venueCity = xPath.compile("matchinfo/venue/@city").evaluate(currentMatch);

                                    Countries localCountry = new Countries(teamACountryName);
                                    localCountry.validateCountry();
                                    Team localTeam = new Team(teamAName, teamAId, localCountry);
                                    localTeam.validateTeam(c);
                                    Countries awayCountry = new Countries(teamBCountryName);
                                    awayCountry.validateCountry();
                                    Team awayTeam = new Team(teamBName, teamBId, awayCountry);
                                    awayTeam.validateTeam(c);

                                    GameMatchStatus status = new GameMatchStatus(statusName);
                                    status.validate(language);

                                    Venue gameVenue = null;
                                    long stadiumId = stringLongParser(venueId);
                                    if (stadiumId != 0){
                                        gameVenue = new Venue(stadiumId, venueName, venueCity, localCountry);
                                        gameVenue.validateVenue();
                                    }
                                    int localGoles = stringIntParser(teamAGoals),
                                            awayGoles = stringIntParser(teamBGoals);

                                    String utcActualTime = cleanDate(matchDate) + cleanHour(matchHour);

                                    GameMatch partidoFromFile = new GameMatch(gamePhase, localTeam, awayTeam, gameVenue, teamAName,
                                            teamBName, localGoles, awayGoles, utcActualTime, status,
                                            Long.parseLong(matchExternal), c);
                                    partidoFromFile.validateGame();
                                }
                            }
                        }else {
                            //get matches
                            NodeList matches = (NodeList) xPath.compile("match").evaluate(currentRound, XPathConstants.NODESET);
                            gamePhase = new Phase(c, currentRoundName,currentRoundName,
                                    currentRoundStartDate, currentRoundEndDate, currentRoundId,
                                    0, 0, i, 1);
                            gamePhase.validate(language);
                            //maximos valores para la fecha de las "subfases"
                            int currentRoundMinDate = Integer.parseInt(currentRoundStartDate),
                                    currentRoundMaxDate = Integer.parseInt(currentRoundEndDate);
                            generateRounds(matches,c,xPath,currentRoundName,currentRoundId,currentRoundMinDate, currentRoundMaxDate);
                            for (int k = 0; k < matches.getLength(); k++) {
                                Node currentMatch = (Node) matches.item(k);
                                //gameweek
                                int currentGameWeek = stringIntParser(xPath.compile("@gameweek").evaluate(currentMatch));

                                String matchExternal = xPath.compile("@match_id").evaluate(currentMatch),
                                        matchDate = cleanDate(xPath.compile("@date_utc").evaluate(currentMatch)),
                                        matchHour = xPath.compile("@time_utc").evaluate(currentMatch),
                                        statusName = xPath.compile("@status").evaluate(currentMatch),
                                        teamAId = xPath.compile("@team_A_id").evaluate(currentMatch),
                                        teamAName = xPath.compile("@team_A_name").evaluate(currentMatch),
                                        teamAGoals = xPath.compile("@fs_A").evaluate(currentMatch),
                                        teamACountryName = xPath.compile("@team_A_country").evaluate(currentMatch),
                                        teamBId = xPath.compile("@team_B_id").evaluate(currentMatch),
                                        teamBName = xPath.compile("@team_B_name").evaluate(currentMatch),
                                        teamBGoals = xPath.compile("@fs_B").evaluate(currentMatch),
                                        teamBCountryName = xPath.compile("@team_B_country").evaluate(currentMatch),
                                        venueId = xPath.compile("matchinfo/venue/@venue_id").evaluate(currentMatch),
                                        venueName = xPath.compile("matchinfo/venue/@name").evaluate(currentMatch),
                                        venueCity = xPath.compile("matchinfo/venue/@city").evaluate(currentMatch);

                                if (Integer.parseInt(matchDate) > currentRoundMinDate){
                                    currentRoundMinDate = Integer.parseInt(matchDate);
                                }

                                if (Integer.parseInt(matchDate) < currentRoundMaxDate){
                                    currentRoundMaxDate = Integer.parseInt(matchDate);
                                }

                                gamePhase = new Phase(c, currentRoundName, "Rodada " + currentGameWeek,
                                        ""+currentRoundMinDate, ""+currentRoundMaxDate, currentRoundId + "0000" + currentGameWeek,
                                        0, 0, currentGameWeek);
                                gamePhase.validate(language);

                                Countries localCountry = new Countries(teamACountryName);
                                localCountry.validateCountry();
                                Team localTeam = new Team(teamAName, teamAId, localCountry);
                                localTeam.validateTeam(c);
                                Countries awayCountry = new Countries(teamBCountryName);
                                awayCountry.validateCountry();
                                Team awayTeam = new Team(teamBName, teamBId, awayCountry);
                                awayTeam.validateTeam(c);

                                GameMatchStatus status = new GameMatchStatus(statusName);
                                status.validate(language);

                                Venue gameVenue = null;
                                long stadiumId = stringLongParser(venueId);
                                if (stadiumId != 0) {
                                    gameVenue = new Venue(stadiumId, venueName, venueCity, localCountry);
                                    gameVenue.validateVenue();
                                }
                                int localGoles = stringIntParser(teamAGoals),
                                        awayGoles = stringIntParser(teamBGoals);

                                String utcActualTime = cleanDate(matchDate) + cleanHour(matchHour);

                                GameMatch partidoFromFile = new GameMatch(gamePhase, localTeam, awayTeam, gameVenue, teamAName,
                                        teamBName, localGoles, awayGoles, utcActualTime, status,
                                        Long.parseLong(matchExternal), c);
                                partidoFromFile.validateGame();

                            }
                        }

                    }else if (currentRoundType.equalsIgnoreCase("cup")){
                        gamePhase = new Phase(c, currentRoundName, currentRoundName,
                                currentRoundStartDate, currentRoundEndDate, currentRoundId,
                                0, i, i);
                        gamePhase.validate(language);
                        NodeList aggregate = (NodeList) xPath.compile("aggr").evaluate(currentRound, XPathConstants.NODESET);
                        for (int j = 0; j < aggregate.getLength(); j++){
                            Node currentAggre = (Node) aggregate.item(j);
                            NodeList matches = (NodeList) xPath.compile("match").evaluate(currentAggre, XPathConstants.NODESET);
                            for (int k = 0; k < matches.getLength(); k++){
                                Node currentMatch = (Node) matches.item(k);

                                String matchExternal = xPath.compile("@match_id").evaluate(currentMatch),
                                        matchDate = xPath.compile("@date_utc").evaluate(currentMatch),
                                        matchHour = xPath.compile("@time_utc").evaluate(currentMatch),
                                        statusName = xPath.compile("@status").evaluate(currentMatch),
                                        teamAId = xPath.compile("@team_A_id").evaluate(currentMatch),
                                        teamAName = xPath.compile("@team_A_name").evaluate(currentMatch),
                                        teamAGoals = xPath.compile("@fs_A").evaluate(currentMatch),
                                        teamACountryName = xPath.compile("@team_A_country").evaluate(currentMatch),
                                        teamBId = xPath.compile("@team_B_id").evaluate(currentMatch),
                                        teamBName = xPath.compile("@team_B_name").evaluate(currentMatch),
                                        teamBGoals = xPath.compile("@fs_B").evaluate(currentMatch),
                                        teamBCountryName = xPath.compile("@team_B_country").evaluate(currentMatch),
                                        venueId = xPath.compile("matchinfo/venue/@venue_id").evaluate(currentMatch),
                                        venueName = xPath.compile("matchinfo/venue/@name").evaluate(currentMatch),
                                        venueCity = xPath.compile("matchinfo/venue/@city").evaluate(currentMatch);

                                Countries localCountry = new Countries(teamACountryName);
                                localCountry.validateCountry();
                                Team localTeam = new Team(teamAName,teamAId, localCountry);
                                localTeam.validateTeam(c);
                                Countries awayCountry = new Countries(teamBCountryName);
                                awayCountry.validateCountry();
                                Team awayTeam = new Team(teamBName, teamBId, awayCountry);
                                awayTeam.validateTeam(c);

                                GameMatchStatus status = new GameMatchStatus(statusName);
                                status.validate(language);

                                Venue gameVenue = null;
                                long stadiumId = stringLongParser(venueId);
                                if (stadiumId != 0){
                                    gameVenue = new Venue(stadiumId, venueName, venueCity, localCountry);
                                    gameVenue.validateVenue();
                                }
                                int localGoles = stringIntParser(teamAGoals),
                                        awayGoles = stringIntParser(teamBGoals);

                                String utcActualTime = cleanDate(matchDate) + cleanHour(matchHour);

                                GameMatch partidoFromFile = new GameMatch(gamePhase, localTeam, awayTeam, gameVenue, teamAName,
                                        teamBName, localGoles, awayGoles, utcActualTime, status,
                                        Long.parseLong(matchExternal), c);
                                partidoFromFile.validateGame();
                            }
                        }

                    }else {
                        //alarma
                    }
                }catch (Exception ex){
                    //dont break the cycle
                    Utils.printToLog(OptasportsScraper.class,
                            "Error en OctaScraper",
                            "error inesperado procesando los fixtures, el proceso continua.",
                            false,
                            ex,
                            "support-level-1",
                            Config.LOGGER_ERROR);
                }

            }

        //add not alarmException
        }catch (Exception ex){
            Utils.printToLog(OptasportsScraper.class,
                    "Error en OctaScraper",
                    "error inesperado procesando los fixtures, no se pudo procesar es necesario tomar acciones.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    private void getPositions(String seasonExternalId, Competition c){
        try {
            String url = "http://api.core.optasports.com/soccer/get_tables?type=season&id=#ID#&tabletype=total&username=upstream&authkey=8277e0910d750195b448797616e091ad"+"&lang=pt";
            url = url.replace(ID, seasonExternalId);
            String xmlRespose = sendRequest(url,"");
            if (xmlRespose == null){
                throw new Exception("no se pudo procesar el ranking para la competicion:" + c.getName() + " respuesta vacia del ws");
            }
            InputSource source = new InputSource(new StringReader(xmlRespose));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            NodeList round = (NodeList) xPath.compile("gsmrs/competition/season/round").evaluate(source, XPathConstants.NODESET);
            for (int i = 0; i < round.getLength(); i++){
                try {
                    Node currentRound = round.item(i);

                    String currentRoundType = xPath.compile("@type").evaluate(currentRound),
                            currentRoundName = xPath.compile("@name").evaluate(currentRound),
                            currentRoundId = xPath.compile("@round_id").evaluate(currentRound),
                            currentRoundStartDate = cleanDate(xPath.compile("@start_date").evaluate(currentRound)),
                            currentRoundEndDate = cleanDate(xPath.compile("@end_date").evaluate(currentRound));

                    int groupCant = Integer.parseInt(xPath.compile("@groups").evaluate(currentRound));
                    if (groupCant > 0){ //GROUP TOURNAMENT
                        //champions style
                        NodeList groups = (NodeList) xPath.compile("group").evaluate(currentRound, XPathConstants.NODESET);
                        Phase phaseToInsert = Phase.getPhaseByFn(c.getIdCompetitions(), 0);
                        if (phaseToInsert == null){
                            phaseToInsert = new Phase(c, currentRoundName, currentRoundName,
                                    currentRoundStartDate, currentRoundEndDate, currentRoundId, i, i, i);
                            phaseToInsert.validate(language);
                        }
                        for (int j = 0; j < groups.getLength();j++){
                            Node currentGroup = (Node) groups.item(j);
                            String groupName = xPath.compile("@title").evaluate(currentGroup),
                                    groupExternalId = xPath.compile("@group_id").evaluate(currentGroup);
                            //create group
                            Group groupFromWs = new Group(c,groupName);
                            groupFromWs.validate(language);
                            NodeList rankings = (NodeList) xPath.compile("resultstable/ranking").evaluate(currentGroup, XPathConstants.NODESET);

                            for (int k = 0; k < rankings.getLength(); k++){
                                Node currentRanking = (Node) rankings.item(k);
                                String rank = xPath.compile("@rank").evaluate(currentRanking),
                                        lastRank = xPath.compile("@last_rank").evaluate(currentRanking),
                                        teamExtId = xPath.compile("@team_id").evaluate(currentRanking),
                                        teamName = xPath.compile("@club_name").evaluate(currentRanking),
                                        teamCountryName = xPath.compile("@countrycode").evaluate(currentRanking);

                                long matches = stringLongParser(xPath.compile("@matches_total").evaluate(currentRanking)),
                                        matchesWon = stringLongParser(xPath.compile("@matches_won").evaluate(currentRanking)),
                                        matchesDraw = stringLongParser(xPath.compile("@matches_draw").evaluate(currentRanking)),
                                        matchesLost = stringLongParser(xPath.compile("@matches_lost").evaluate(currentRanking)),
                                        goals = stringLongParser(xPath.compile("@goals_pro").evaluate(currentRanking)),
                                        goalsAgainst = stringLongParser(xPath.compile("@goals_against").evaluate(currentRanking)),
                                        points = stringLongParser(xPath.compile("@points").evaluate(currentRanking));

                                Countries localCountry = new Countries(teamCountryName);
                                localCountry.validateCountry();
                                Team currentTeam =  new Team(teamName,teamExtId, localCountry);
                                currentTeam.validateTeam(c);
                                Rank currentRank = new Rank(phaseToInsert,currentTeam,groupFromWs,matches,matchesWon,
                                        matchesDraw, matchesLost, points, goals, goalsAgainst);
                                currentRank.validateRank();
                            }
                        }
                    }else {
                        //regular season
                        NodeList rankings = (NodeList) xPath.compile("resultstable/ranking").evaluate(currentRound, XPathConstants.NODESET);
                        Phase phaseToInsert = Phase.getPhaseByFn(c.getIdCompetitions(), 0);
                        if (phaseToInsert == null){
                            phaseToInsert = new Phase(c, currentRoundName, currentRoundName,
                                    currentRoundStartDate, currentRoundEndDate, currentRoundId, i, i, i);
                            phaseToInsert.validate(language);
                        }
                        for (int j = 0; j < rankings.getLength(); j++){
                            Node currentRanking = (Node) rankings.item(j);
                            String rank = xPath.compile("@rank").evaluate(currentRanking),
                                    lastRank = xPath.compile("@last_rank").evaluate(currentRanking),
                                    teamExtId = xPath.compile("@team_id").evaluate(currentRanking),
                                    teamName = xPath.compile("@club_name").evaluate(currentRanking),
                                    teamCountryName = xPath.compile("@countrycode").evaluate(currentRanking);

                            long matches = stringLongParser(xPath.compile("@matches_total").evaluate(currentRanking)),
                                    matchesWon = stringLongParser(xPath.compile("@matches_won").evaluate(currentRanking)),
                                    matchesDraw = stringLongParser(xPath.compile("@matches_draw").evaluate(currentRanking)),
                                    matchesLost = stringLongParser(xPath.compile("@matches_lost").evaluate(currentRanking)),
                                    goals = stringLongParser(xPath.compile("@goals_pro").evaluate(currentRanking)),
                                    goalsAgainst = stringLongParser(xPath.compile("@goals_against").evaluate(currentRanking)),
                                    points = stringLongParser(xPath.compile("@points").evaluate(currentRanking));

                            Group fixedGroup = new Group(c, "A");
                            fixedGroup.validate(language);
                            Countries localCountry = new Countries(teamCountryName);
                            localCountry.validateCountry();
                            Team currentTeam =  new Team(teamName, teamExtId, localCountry);
                            currentTeam.validateTeam(c);
                            Rank currentRank = new Rank(phaseToInsert,currentTeam,fixedGroup,matches,matchesWon,
                                    matchesDraw, matchesLost, points, goals, goalsAgainst);
                            currentRank.validateRank();
                        }
                    }

                }catch (Exception ex){
                    Utils.printToLog(OptasportsScraper.class,
                            "Error en OctaScraper",
                            "error inesperado procesando los rankings, el proceso continua",
                            true,
                            ex,
                            "support-level-1",
                            Config.LOGGER_ERROR);
                }

            }
        //add nonAlarmException
        }catch (Exception ex){
            Utils.printToLog(OptasportsScraper.class,
                    "Error en OctaScraper",
                    "error inesperado procesando los rankings, no se pudo procesar es necesario tomar acciones.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    private void getStrikers(String seasonExternalId, Competition c){
        try {
            String url = "http://api.core.optasports.com/soccer/get_player_statistics?id=#ID#&type=season&username=upstream&authkey=8277e0910d750195b448797616e091ad"+"&lang=pt";
            url = url.replace(ID, seasonExternalId);
            String xmlRespose = sendRequest(url,"");
            if (xmlRespose == null){
                throw new Exception("no se pudo procesar el ranking para la competicion:" + c.getName() + " respuesta vacia del ws");
            }
            InputSource source = new InputSource(new StringReader(xmlRespose));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            NodeList strikers = (NodeList) xPath.compile("gsmrs/competition/season/goals/person").evaluate(source, XPathConstants.NODESET);
            for (int i = 0; i < strikers.getLength(); i++){
                Node currentStriker = (Node) strikers.item(i);
                String strikerExternalId = xPath.compile("@person_id").evaluate(currentStriker),
                        strikerName = xPath.compile("@name").evaluate(currentStriker),
                        strikerTeamId = xPath.compile("@team_id").evaluate(currentStriker);
                int count = stringIntParser(xPath.compile("@count").evaluate(currentStriker));
                Team currentTeam = Team.findByExtId(strikerTeamId);
                if (currentTeam != null){
                    Scorer ti = new Scorer(strikerName, "", "", currentTeam, count,
                            0, 0, 0,0, null, strikerExternalId, c, "");
                    ti.validateScorer();
                }
            }

        }catch (Exception ex){
            Utils.printToLog(OptasportsScraper.class,
                    "Error en OctaScraper",
                    "error inesperado procesando los goleadores, no se pudo procesar es necesario tomar acciones. competencia:" + c.getName(),
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }

    }

    private void getMinuteByMinute(String seasonExternalId, Competition c){
        try {
            //System.out.println("min");
            String url = "http://api.core.optasports.com/soccer/get_matches_live?now_playing=no&minutes=yes&username=upstream&authkey=8277e0910d750195b448797616e091ad"+"&lang=pt";
            //url = url.replace(ID, seasonExternalId);
            String xmlRespose = sendRequest(url,"");
            if (xmlRespose == null){
                throw new Exception("no se pudo procesar el ranking para la competicion:" + c.getName() + " respuesta vacia del ws");
            }
            InputSource source = new InputSource(new StringReader(xmlRespose));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            NodeList rounds = (NodeList) xPath.compile("gsmrs/competition/season/round").evaluate(source, XPathConstants.NODESET);
            for (int i = 0; i < rounds.getLength(); i++){
                try {
                    Node currentRound = rounds.item(i);

                    String currentRoundType = xPath.compile("@type").evaluate(currentRound),
                            currentRoundName = xPath.compile("@name").evaluate(currentRound),
                            currentRoundId = xPath.compile("@round_id").evaluate(currentRound),
                            currentRoundStartDate = cleanDate(xPath.compile("@start_date").evaluate(currentRound)),
                            currentRoundEndDate = cleanDate(xPath.compile("@end_date").evaluate(currentRound));

                    int groupCant = Integer.parseInt(xPath.compile("@groups").evaluate(currentRound));
                    if (currentRoundType.equalsIgnoreCase("table")){
                        if (groupCant > 0){
                            //System.out.println("cant");
                            //get groups then matches
                            NodeList groups = (NodeList) xPath.compile("group").evaluate(currentRound, XPathConstants.NODESET);
                            for (int j = 0; j < groups.getLength(); j++){
                                Node currentGroup = (Node) groups.item(j);
                                NodeList matches = (NodeList) xPath.compile("match").evaluate(currentGroup, XPathConstants.NODESET);
                                for (int k = 0; k < matches.getLength(); k++){
                                    Node currentMatch = (Node) matches.item(k);
                                    //gameweek
                                    String matchExternal = xPath.compile("@match_id").evaluate(currentMatch),
                                            matchDate = xPath.compile("@date_utc").evaluate(currentMatch),
                                            matchHour = xPath.compile("@time_utc").evaluate(currentMatch),
                                            statusName = xPath.compile("@status").evaluate(currentMatch),
                                            teamAId = xPath.compile("@team_A_id").evaluate(currentMatch),
                                            teamAName = xPath.compile("@team_A_name").evaluate(currentMatch),
                                            teamAGoals = xPath.compile("@fs_A").evaluate(currentMatch),
                                            teamACountryName = xPath.compile("@team_A_country").evaluate(currentMatch),
                                            teamBId = xPath.compile("@team_B_id").evaluate(currentMatch),
                                            teamBName = xPath.compile("@team_B_name").evaluate(currentMatch),
                                            teamBGoals = xPath.compile("@fs_B").evaluate(currentMatch),
                                            teamBCountryName = xPath.compile("@team_B_country").evaluate(currentMatch),
                                            venueId = xPath.compile("matchinfo/venue/@venue_id").evaluate(currentMatch),
                                            venueName = xPath.compile("matchinfo/venue/@name").evaluate(currentMatch),
                                            venueCity = xPath.compile("matchinfo/venue/@city").evaluate(currentMatch),
                                            matchPeriod = xPath.compile("@match_period").evaluate(currentMatch); //do i need this??

                                    Countries localCountry = new Countries(teamACountryName);
                                    localCountry.validateCountry();
                                    Team localTeam = new Team(teamAName, teamAId, localCountry);
                                    localTeam.validateTeam(c);
                                    Countries awayCountry = new Countries(teamBCountryName);
                                    awayCountry.validateCountry();
                                    Team awayTeam = new Team(teamBName, teamBId, awayCountry);
                                    awayTeam.validateTeam(c);

                                    String utcActualTime = cleanDate(matchDate) + cleanHour(matchHour);

                                    //get match from bd
                                    GameMatch currentGameMatch = GameMatch.findByIdExternal(matchExternal);
                                    if (currentGameMatch != null) {
                                        //get substitutions
                                        NodeList subs = (NodeList) xPath.compile("substitutions/sub/event").evaluate(currentMatch, XPathConstants.NODESET);
                                        for (int l = 0; l < subs.getLength(); l++){
                                            processEvent(xPath, currentGameMatch,localTeam,awayTeam, utcActualTime,0, matchPeriod ,(Node)subs.item(l));
                                        }
                                        //get goals
                                        NodeList goals = (NodeList) xPath.compile("goals/goal/event").evaluate(currentMatch, XPathConstants.NODESET);
                                        for (int l = 0; l < goals.getLength(); l++){
                                            processEvent(xPath, currentGameMatch,localTeam,awayTeam, utcActualTime,0, matchPeriod ,(Node)goals.item(l));
                                        }
                                        //get bookings
                                        NodeList bookings = (NodeList) xPath.compile("bookings/event").evaluate(currentMatch, XPathConstants.NODESET);
                                        for (int l = 0; l < bookings.getLength(); l++){
                                            processEvent(xPath, currentGameMatch,localTeam,awayTeam, utcActualTime,0, matchPeriod ,(Node)bookings.item(l));
                                        }
                                    }
                                }
                            }

                        }else {
                            //System.out.println("cero");
                            NodeList matches = (NodeList) xPath.compile("match").evaluate(currentRound, XPathConstants.NODESET);
                            for (int k = 0; k < matches.getLength(); k++) {
                                Node currentMatch = (Node) matches.item(k);
                                String matchExternal = xPath.compile("@match_id").evaluate(currentMatch),
                                        matchDate = xPath.compile("@date_utc").evaluate(currentMatch),
                                        matchHour = xPath.compile("@time_utc").evaluate(currentMatch),
                                        statusName = xPath.compile("@status").evaluate(currentMatch),
                                        teamAId = xPath.compile("@team_A_id").evaluate(currentMatch),
                                        teamAName = xPath.compile("@team_A_name").evaluate(currentMatch),
                                        teamAGoals = xPath.compile("@fs_A").evaluate(currentMatch),
                                        teamACountryName = xPath.compile("@team_A_country").evaluate(currentMatch),
                                        teamBId = xPath.compile("@team_B_id").evaluate(currentMatch),
                                        teamBName = xPath.compile("@team_B_name").evaluate(currentMatch),
                                        teamBGoals = xPath.compile("@fs_B").evaluate(currentMatch),
                                        teamBCountryName = xPath.compile("@team_B_country").evaluate(currentMatch),
                                        venueId = xPath.compile("matchinfo/venue/@venue_id").evaluate(currentMatch),
                                        venueName = xPath.compile("matchinfo/venue/@name").evaluate(currentMatch),
                                        venueCity = xPath.compile("matchinfo/venue/@city").evaluate(currentMatch),
                                        matchPeriod = xPath.compile("@match_period").evaluate(currentMatch); //do i need this??

                                Countries localCountry = new Countries(teamACountryName);
                                localCountry.validateCountry();
                                Team localTeam = new Team(teamAName, teamAId, localCountry);
                                localTeam.validateTeam(c);
                                Countries awayCountry = new Countries(teamBCountryName);
                                awayCountry.validateCountry();
                                Team awayTeam = new Team(teamBName, teamBId, awayCountry);
                                awayTeam.validateTeam(c);

                                String utcActualTime = cleanDate(matchDate) + cleanHour(matchHour);

                                //get match from bd
                                GameMatch currentGameMatch = GameMatch.findByIdExternal(matchExternal);
                                if (currentGameMatch != null) {
                                    ///get substitutions
                                    NodeList subs = (NodeList) xPath.compile("substitutions/sub/event").evaluate(currentMatch, XPathConstants.NODESET);
                                    for (int l = 0; l < subs.getLength(); l++){
                                        processEvent(xPath, currentGameMatch,localTeam,awayTeam, utcActualTime,0, matchPeriod ,(Node)subs.item(l));
                                    }
                                    //get goals
                                    NodeList goals = (NodeList) xPath.compile("goals/goal/event").evaluate(currentMatch, XPathConstants.NODESET);
                                    for (int l = 0; l < goals.getLength(); l++){
                                        processEvent(xPath, currentGameMatch,localTeam,awayTeam, utcActualTime,0, matchPeriod ,(Node)goals.item(l));
                                    }
                                    //get bookings
                                    NodeList bookings = (NodeList) xPath.compile("bookings/event").evaluate(currentMatch, XPathConstants.NODESET);
                                    for (int l = 0; l < bookings.getLength(); l++){
                                        processEvent(xPath, currentGameMatch,localTeam,awayTeam, utcActualTime,0, matchPeriod ,(Node)bookings.item(l));
                                    }
                                }
                            }

                        }
                    }else if (currentRoundType.equalsIgnoreCase("cup")){
                        //System.out.println("copa");
                        NodeList aggregate = (NodeList) xPath.compile("aggr").evaluate(currentRound, XPathConstants.NODESET);
                        for (int j = 0; j < aggregate.getLength(); j++){
                            Node currentAggre = (Node) aggregate.item(j);
                            NodeList matches = (NodeList) xPath.compile("match").evaluate(currentAggre, XPathConstants.NODESET);
                            for (int k = 0; k < matches.getLength(); k++){
                                Node currentMatch = (Node) matches.item(k);
                                String matchExternal = xPath.compile("@match_id").evaluate(currentMatch),
                                        matchDate = xPath.compile("@date_utc").evaluate(currentMatch),
                                        matchHour = xPath.compile("@time_utc").evaluate(currentMatch),
                                        statusName = xPath.compile("@status").evaluate(currentMatch),
                                        teamAId = xPath.compile("@team_A_id").evaluate(currentMatch),
                                        teamAName = xPath.compile("@team_A_name").evaluate(currentMatch),
                                        teamAGoals = xPath.compile("@fs_A").evaluate(currentMatch),
                                        teamACountryName = xPath.compile("@team_A_country").evaluate(currentMatch),
                                        teamBId = xPath.compile("@team_B_id").evaluate(currentMatch),
                                        teamBName = xPath.compile("@team_B_name").evaluate(currentMatch),
                                        teamBGoals = xPath.compile("@fs_B").evaluate(currentMatch),
                                        teamBCountryName = xPath.compile("@team_B_country").evaluate(currentMatch),
                                        venueId = xPath.compile("matchinfo/venue/@venue_id").evaluate(currentMatch),
                                        venueName = xPath.compile("matchinfo/venue/@name").evaluate(currentMatch),
                                        venueCity = xPath.compile("matchinfo/venue/@city").evaluate(currentMatch),
                                        matchPeriod = xPath.compile("@match_period").evaluate(currentMatch); //do i need this??

                                Countries localCountry = new Countries(teamACountryName);
                                localCountry.validateCountry();
                                Team localTeam = new Team(teamAName, teamAId, localCountry);
                                localTeam.validateTeam(c);
                                Countries awayCountry = new Countries(teamBCountryName);
                                awayCountry.validateCountry();
                                Team awayTeam = new Team(teamBName, teamBId, awayCountry);
                                awayTeam.validateTeam(c);

                                String utcActualTime = cleanDate(matchDate) + cleanHour(matchHour);

                                //get match from bd
                                GameMatch currentGameMatch = GameMatch.findByIdExternal(matchExternal);
                                if (currentGameMatch != null) {
                                    //get substitutions
                                    NodeList subs = (NodeList) xPath.compile("substitutions/sub/event").evaluate(currentMatch, XPathConstants.NODESET);
                                    for (int l = 0; l < subs.getLength(); l++){
                                        processEvent(xPath, currentGameMatch,localTeam,awayTeam, utcActualTime,0, matchPeriod ,(Node)subs.item(l));
                                    }
                                    //get goals
                                    NodeList goals = (NodeList) xPath.compile("goals/goal/event").evaluate(currentMatch, XPathConstants.NODESET);
                                    for (int l = 0; l < goals.getLength(); l++){
                                        processEvent(xPath, currentGameMatch,localTeam,awayTeam, utcActualTime,0, matchPeriod ,(Node)goals.item(l));
                                    }
                                    //get bookings
                                    NodeList bookings = (NodeList) xPath.compile("bookings/event").evaluate(currentMatch, XPathConstants.NODESET);
                                    for (int l = 0; l < bookings.getLength(); l++){
                                        processEvent(xPath, currentGameMatch,localTeam,awayTeam, utcActualTime,0, matchPeriod ,(Node)bookings.item(l));
                                    }
                                }
                            }
                        }

                    }else {
                        //unknown
                    }

                }catch (Exception ex){
                    Utils.printToLog(OptasportsScraper.class,
                            "Error en OctaScraper",
                            "error inesperado procesando el minuto a minuto, el proceso continua, ext_id:" + seasonExternalId,
                            false,
                            ex,
                            "support-level-1",
                            Config.LOGGER_ERROR);
                }
            }
        }catch (Exception ex){
            Utils.printToLog(OptasportsScraper.class,
                    "Error en OctaScraper",
                    "error inesperado procesando el minuto a minuto, no se pudo procesar es necesario tomar acciones.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    private void processEvent(XPath xPath, GameMatch currentGameMatch, Team localTeam, Team awayTeam,
                              String matchDate, int order, String periodName, Node event) throws Exception {
        String eventExternalId = xPath.compile("@event_id").evaluate(event),
                eventPlayerName = xPath.compile("@person").evaluate(event),
                eventMin = xPath.compile("@minute").evaluate(event),
                eventMinExtra= xPath.compile("@minute_extra").evaluate(event),
                eventType = xPath.compile("@code").evaluate(event),
                eventName = xPath.compile("@name").evaluate(event),
                eventTeamId = xPath.compile("@team_id").evaluate(event);

        Action ac = new Action(eventType, eventName, eventType);
        ac.validate(language);

        Period incidentPeriod = new Period(periodName, periodName, null);
        incidentPeriod.validate(language);

        GameMatchEvent gameMatchEvent = new GameMatchEvent(currentGameMatch, incidentPeriod, ac,
                localTeam.getExtId().equals(eventTeamId) ? localTeam : awayTeam, eventPlayerName, null,
                Integer.parseInt(eventMin), matchDate,  Integer.parseInt(eventExternalId), Long.parseLong(eventExternalId));
        gameMatchEvent.validate();
    }

    private void generateRounds(NodeList matches, Competition c,XPath xPath ,String currentRoundName, String currentRoundId,
                                int currentRoundMinDate, int currentRoundMaxDate) throws Exception{

        int currentGameWeek = 0, lastGameWeek = 0;
        Phase gamePhase = null;
        for (int k = 0; k < matches.getLength(); k++) {
            Node currentMatch = (Node) matches.item(k);
            currentGameWeek = stringIntParser(xPath.compile("@gameweek").evaluate(currentMatch));
            String matchDate = cleanDate(xPath.compile("@date_utc").evaluate(currentMatch));

            if (currentGameWeek != lastGameWeek){
                if (gamePhase !=null){
                    //tengo uno y debo insertar y setear a null
                    gamePhase.validate(language);
                    gamePhase = new Phase(c, currentRoundName, "Rodada " + currentGameWeek,
                            ""+currentRoundMinDate, ""+currentRoundMaxDate, currentRoundId + "0000" + currentGameWeek,
                            0, 0, currentGameWeek);
                    gamePhase.setStartDate(matchDate);

                }else {
                    //no tengo, lo creo
                    gamePhase = new Phase(c, currentRoundName, "Rodada " + currentGameWeek,
                            ""+currentRoundMinDate, ""+currentRoundMaxDate, currentRoundId + "0000" + currentGameWeek,
                            0, 0, currentGameWeek);
                    gamePhase.setStartDate(matchDate);
                }
            }else {
                //update existing
                if (Integer.parseInt(matchDate) < Integer.parseInt(gamePhase.getStartDate())){
                    gamePhase.setStartDate(matchDate);
                }

                if (Integer.parseInt(matchDate) > Integer.parseInt(gamePhase.getStartDate())
                        && Integer.parseInt(matchDate) <= currentRoundMaxDate){
                    gamePhase.setEndDate(matchDate);
                }
            }
            lastGameWeek = currentGameWeek;
        }
    }

}
