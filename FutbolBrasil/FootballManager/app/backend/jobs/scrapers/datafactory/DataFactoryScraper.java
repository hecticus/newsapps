package backend.jobs.scrapers.datafactory;

import akka.actor.Cancellable;
import backend.HecticusThread;
import exceptions.BadConfigException;
import exceptions.DownloadFailedException;
import exceptions.KyubiParsingException;
import models.Config;
import models.football.*;
import org.apache.commons.net.ftp.FTPClient;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import utils.Utils;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.io.*;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by sorcerer on 9/24/14.
 */
public class DataFactoryScraper extends HecticusThread {

    private String fileRoute;

    /*
        archivos que va a manejar
        deportes.futbol.brasileirao.fixture
        deportes.futbol.brasileirao.calendario
        deportes.futbol.brasileirao.posiciones
        deportes.futbol.brasileirao.goleadores
        deportes.futbol.brasileirao.ficha.*
        deportes.futbol.brasileirao.ficha.*.mam
        deportes.futbol.brasileirao.plantelxcampeonato.
     */

    @Override
    public void process(Map args){
        try {
            Utils.printToLog(DataFactoryScraper.class,null,"Iniciando DataFactoryScraper",false,null,"support-level-1",Config.LOGGER_INFO);
            //read folder files
            if (args.containsKey("file_route")){
                fileRoute = (String) args.get("file_route");
            }else throw new BadConfigException("es necesario el valor file_route");
            processFolder(fileRoute);
        } catch (BadConfigException ex){
            Utils.printToLog(DataFactoryScraper.class,
                    "Error en DataFactoryScraper",
                    "error inesperado en el DataFactoryScraper, el proceso no fue finalizado. se reintentara",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        } catch (Exception ex){
            Utils.printToLog(DataFactoryScraper.class,
                    "Error en DataFactoryScraper",
                    "error inesperado en el DataFactoryScraper, el proceso no fue finalizado. se reintentara",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
        Utils.printToLog(DataFactoryScraper.class,null,"finalizando el DataFactoryScraper",false,null,"support-level-1",Config.LOGGER_INFO);
    }

    //"tempFiles/deportes.afp.brasileirao.fixture.xml"
    private void parseFixture(String fileRoute){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            //InputSource source = new InputSource(new StringReader(xml)); from string
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            String categoria = xPath.compile("fixture/categoria").evaluate(document),
                    extCategoria = xPath.compile("fixture/categoria/@id").evaluate(document);
            CompetitionType category = new CompetitionType(categoria, Long.parseLong(extCategoria));
            category.validate();
            String extIdCompetition = xPath.compile("fixture/campeonato/@id").evaluate(document);
            String competitionName = xPath.compile("fixture/campeonato").evaluate(document);
            //BUILD competition
            Competition compFromFile = new Competition(competitionName, Long.parseLong(extIdCompetition), getIdApp(), category);
            compFromFile.validateCompetition();
            //parse fechas
            NodeList fecha = (NodeList) xPath.compile("fixture/fecha").evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < fecha.getLength(); i++){
                try{
                    Node currentFecha = fecha.item(i);
                    //parse fecha
                    String nombreNivel = xPath.compile("@nombrenivel").evaluate(currentFecha),
                            nombre= xPath.compile("@nombre").evaluate(currentFecha),
                            faseId = xPath.compile("@id").evaluate(currentFecha),
                            fechaDesde = xPath.compile("@fechadesde").evaluate(currentFecha),
                            fechaHasta = xPath.compile("@fechahasta").evaluate(currentFecha),
                            nivel = xPath.compile("@nivel").evaluate(currentFecha),
                            orden = xPath.compile("@orden").evaluate(currentFecha),
                            fn = xPath.compile("@fn").evaluate(currentFecha);
                    //fase
                    Phase gamePhase = new Phase(compFromFile, nombreNivel, nombre, fechaDesde, fechaHasta, Long.parseLong(faseId),
                            Integer.parseInt(orden), Integer.parseInt(nivel), Integer.parseInt(fn));
                    gamePhase.validatePhase();
                    NodeList partidos = (NodeList) xPath.compile("partido").evaluate(currentFecha, XPathConstants.NODESET);
                    for (int j = 0; j < partidos.getLength(); j++){
                        Node currentPartido = partidos.item(j);
                        String idExtPartido = xPath.compile("@id").evaluate(currentPartido),
                                actualFecha = xPath.compile("@fecha").evaluate(currentPartido),
                                hora = xPath.compile("@hora").evaluate(currentPartido),
                                idEstadio = xPath.compile("@idEstadio").evaluate(currentPartido),
                                nombreEstadio = xPath.compile("@nombreEstadio").evaluate(currentPartido),
                                ciudadEstadio = xPath.compile("@lugarCiudad").evaluate(currentPartido),
                                status = xPath.compile("estado").evaluate(currentPartido),
                                statusId = xPath.compile("estado/@id").evaluate(currentPartido),
                                horaEstado = xPath.compile("horaEstado").evaluate(currentPartido),
                                equipoLocalId = xPath.compile("local/@id").evaluate(currentPartido),
                                equipoLocalNombre = xPath.compile("local").evaluate(currentPartido),
                                equipoLocalGoles = xPath.compile("goleslocal").evaluate(currentPartido),
                                equipoLocalPaisId  = xPath.compile("local/@paisId").evaluate(currentPartido),
                                equipoLocalPaisNombre = xPath.compile("local/@pais").evaluate(currentPartido),
                                equipoVisitId = xPath.compile("visitante/@id").evaluate(currentPartido),
                                equipoVisitNombre = xPath.compile("visitante").evaluate(currentPartido),
                                equipoVisitGoles = xPath.compile("golesvisitante").evaluate(currentPartido),
                                equipoVisitPaisId = xPath.compile("visitante/@paisId").evaluate(currentPartido),
                                equipoVisitPaisNombre = xPath.compile("visitante/@pais").evaluate(currentPartido),
                                //arbitro = xPath.compile("arbitro").evaluate(currentPartido),
                                penalesLocal = xPath.compile("golesDefPenaleslocal").evaluate(currentPartido),
                                penalesVisit = xPath.compile("golesDefPenalesvisitante").evaluate(currentPartido);

                        //set values
                        Countries localCountry = new Countries(equipoLocalPaisNombre, Long.parseLong(equipoLocalPaisId));
                        localCountry.validateCountry();
                        Team localTeam = new Team(equipoLocalNombre, Long.parseLong(equipoLocalId), localCountry);
                        localTeam.validateTeam();
                        Countries awayCountry = new Countries(equipoVisitPaisNombre, Long.parseLong(equipoVisitPaisId));
                        awayCountry.validateCountry();
                        Team awayTeam = new Team(equipoVisitNombre, Long.parseLong(equipoVisitId), awayCountry);
                        awayTeam.validateTeam();

                        Venue gameVenue = null;
                        long stadiumId = stringLongParser(idEstadio);
                        if (stadiumId != 0){
                            gameVenue = new Venue(stadiumId, nombreEstadio, ciudadEstadio, localCountry);
                            gameVenue.validateVenue();
                        }
                        int localGoles = stringIntParser(equipoLocalGoles),
                                awayGoles = stringIntParser(equipoVisitGoles);

                        GameMatch partidoFromFile = new GameMatch(gamePhase, localTeam, awayTeam, gameVenue, equipoLocalNombre,
                                equipoVisitNombre, localGoles, awayGoles, actualFecha + cleanHour(hora), status,
                                Long.parseLong(idExtPartido), compFromFile);
                        partidoFromFile.validateGame();
                    }
                }catch (Exception ex){
                    //generic parsing error keep going with next one
                }
            }
        }catch (Exception ex){
            Utils.printToLog(DataFactoryScraper.class,
                    "Error en DataFactoryScraper",
                    "Error inesperado parseando el archivo de fixture:" + fileRoute + " el proceso no se pudo completar",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }


    //"tempFiles/deportes.afp.brasileirao.posiciones.xml"
    private void parsePositions(String fileRoute){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            //InputSource source = new InputSource(new StringReader(xml)); from string
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            String categoria = xPath.compile("posiciones/categoria").evaluate(document),
                    extCategoria = xPath.compile("posiciones/categoria/@id").evaluate(document);
            CompetitionType category = new CompetitionType(categoria, Long.parseLong(extCategoria));
            category.validate();
            String idTorneo = xPath.compile("posiciones/campeonato/@id").evaluate(document),
                    torneoName = xPath.compile("posiciones/campeonato").evaluate(document),
                    fecha = xPath.compile("posiciones/fechaNombre").evaluate(document),
                    fn = xPath.compile("posiciones/fechaNombre/@fn").evaluate(document);
            Competition torneo = new Competition(torneoName, Long.parseLong(idTorneo), getIdApp(), category);
            torneo.validateCompetition();
            NodeList equipos = (NodeList) xPath.compile("posiciones/equipo").evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < equipos.getLength(); i++) {
                try {
                    Node currentTeam = equipos.item(i);
                    String teamExtId = xPath.compile("@id").evaluate(currentTeam);
                    String teamName = xPath.compile("nombre").evaluate(currentTeam),
                            countryName = xPath.compile("@paisSigla").evaluate(currentTeam),
                            countryExtId = xPath.compile("@paisId").evaluate(currentTeam),
                            points = xPath.compile("puntos").evaluate(currentTeam),
                            played = xPath.compile("jugados").evaluate(currentTeam),
                            playedLocal = xPath.compile("jugadoslocal").evaluate(currentTeam),
                            playedVisitor = xPath.compile("jugadosvisitantes").evaluate(currentTeam),
                            wins = xPath.compile("ganados").evaluate(currentTeam),
                            draws = xPath.compile("empatados").evaluate(currentTeam),
                            lost = xPath.compile("perdidos").evaluate(currentTeam),
                            localWins = xPath.compile("ganadoslocal").evaluate(currentTeam),
                            localDraws = xPath.compile("ematadoslocal").evaluate(currentTeam),
                            localLost = xPath.compile("perdidoslocal").evaluate(currentTeam),
                            visitorWins = xPath.compile("ganadosvisitantes").evaluate(currentTeam),
                            visitorDraws = xPath.compile("empatadosvisitantes").evaluate(currentTeam),
                            visitorLost = xPath.compile("perdidosvisitantes").evaluate(currentTeam),
                            localGoalsFor = xPath.compile("golesfavorlocal").evaluate(currentTeam),
                            localGoalsAgains = xPath.compile("golescontralocal").evaluate(currentTeam),
                            visitorGoalsFor = xPath.compile("golesfavorvisitante").evaluate(currentTeam),
                            visitorGoalsAgains = xPath.compile("golescontravisitante").evaluate(currentTeam),

                            goalsFor = xPath.compile("golesfavor").evaluate(currentTeam),
                            goalsAgains = xPath.compile("golescontra").evaluate(currentTeam),

                            goalDiff = xPath.compile("difgol").evaluate(currentTeam),
                            localPoints = xPath.compile("puntoslocal").evaluate(currentTeam),
                            visitorPoints = xPath.compile("puntosvisitante").evaluate(currentTeam),
                            //data
                            yellowCards = xPath.compile("am").evaluate(currentTeam),
                            redCards = xPath.compile("rojas").evaluate(currentTeam),
                            red2yellow = xPath.compile("rojaX2am").evaluate(currentTeam),
                            penaltyFouls = xPath.compile("faltasPen").evaluate(currentTeam),
                            penaltyHands = xPath.compile("manoPen").evaluate(currentTeam),
                            commitedFouls = xPath.compile("faltasCom").evaluate(currentTeam),
                            receivedFouls = xPath.compile("faltasRec").evaluate(currentTeam),
                            penaltyFoulsReceived = xPath.compile("faltasPenRec").evaluate(currentTeam),
                            nivel = xPath.compile("nivel").evaluate(currentTeam),
                            nivelDesc = xPath.compile("nivelDesc").evaluate(currentTeam),
                            order = xPath.compile("orden").evaluate(currentTeam),
                            orderDesc = xPath.compile("ordenDesc").evaluate(currentTeam),
                            //tribunal disc not needed
                            streak = xPath.compile("racha").evaluate(currentTeam);

                    Countries teamCountry = new Countries(countryName, Long.parseLong(countryExtId));
                    teamCountry.validateCountry();
                    Team teamToInsert = new Team(teamName, Long.parseLong(teamExtId), teamCountry);
                    teamToInsert.validateTeam();
                    //get phase
                    Phase phaseToInsert = Phase.getPhaseByFn(torneo.getIdCompetitions(), stringIntParser(fn));

                    //values to int and long
                    long matches = stringLongParser(played),
                            matchesWon = stringLongParser(wins),
                            matchesDraw = stringLongParser(draws),
                            matchesLost = stringLongParser(lost),
                            pointsV = stringLongParser(points),
                            goalsfor = stringLongParser(goalsFor),
                            goalsagainst = stringLongParser(goalsAgains);

                    int matchesLocal = stringIntParser(playedLocal),
                            matchesVisitor = stringIntParser(playedVisitor),
                            matchesLocalWon = stringIntParser(localWins),
                            matchesLocalDraw = stringIntParser(localDraws),
                            matchesLocalLost = stringIntParser(localLost),
                            matchesVisitorWon = stringIntParser(visitorWins),
                            matchesVisitorDraw = stringIntParser(visitorDraws),
                            matchesVisitorLost = stringIntParser(visitorLost),
                            goalsForLocal = stringIntParser(localGoalsFor),
                            goalsAgainstLocal = stringIntParser(localGoalsAgains),
                            goalsForVisitor = stringIntParser(visitorGoalsFor),
                            goalsAgainstVisitor = stringIntParser(visitorGoalsAgains),
                            goalDiffV = stringIntParser(goalDiff),
                            pointsLocal = stringIntParser(localPoints),
                            pointsVisitor = stringIntParser(visitorPoints),
                            yellowCardsV = stringIntParser(yellowCards),
                            redCardsV = stringIntParser(redCards),
                            doubleYellowCard = stringIntParser(red2yellow),
                            penaltyFoulsV = stringIntParser(penaltyFouls),
                            penaltyHandsV = stringIntParser(penaltyHands),
                            foulsCommited = stringIntParser(commitedFouls),
                            foulsReceived = stringIntParser(receivedFouls),
                            penaltyFoulsReceivedV = stringIntParser(penaltyFoulsReceived),
                            nivelV = stringIntParser(nivel),
                            orderV = stringIntParser(order);

                    Rank toInsert = new Rank(phaseToInsert, teamToInsert, matches,matchesWon, matchesDraw, matchesLost, pointsV,
                            goalsfor, goalsagainst, matchesLocal, matchesVisitor, matchesLocalWon, matchesLocalDraw,
                            matchesLocalLost,matchesVisitorWon, matchesVisitorDraw, matchesVisitorLost, goalsForLocal,
                            goalsAgainstLocal, goalsForVisitor, goalsAgainstVisitor, goalDiffV, pointsLocal, pointsVisitor,
                            yellowCardsV, redCardsV,doubleYellowCard,penaltyFoulsV, penaltyHandsV, foulsCommited,
                            foulsReceived, penaltyFoulsReceivedV, nivelV, nivelDesc, orderV,orderDesc, streak);
                    toInsert.validateRank();
                }catch (Exception ex){
                    Utils.printToLog(DataFactoryScraper.class,
                            "Error en DataFactoryScraper",
                            "Error inesperado parseando las posiciones del los equipos, el proceso continua " ,
                            true,
                            ex,
                            "support-level-1",
                            Config.LOGGER_ERROR);
                }

            }

        }catch (Exception ex){
            Utils.printToLog(DataFactoryScraper.class,
                    "Error en DataFactoryScraper",
                    "Error inesperado parseando el archivo de posiciones:"  + fileRoute + " el proceso no se pudo completar",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }

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

    private void parseStrikers(String fileRoute){
        DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            //InputSource source = new InputSource(new StringReader(xml)); from string
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            String categoria = xPath.compile("goleadores/categoria").evaluate(document),
                    extCategoria = xPath.compile("goleadores/categoria/@id").evaluate(document);
            CompetitionType category = new CompetitionType(categoria, Long.parseLong(extCategoria));
            category.validate();
            String idTorneo = xPath.compile("goleadores/campeonato/@id").evaluate(document),
                    torneoName = xPath.compile("goleadores/campeonato").evaluate(document),
                    fecha = xPath.compile("goleadores/fechaActual").evaluate(document);
            Competition currentCompetition = new Competition(torneoName, Long.parseLong(idTorneo), getIdApp(), category);
            currentCompetition.validateCompetition();
            NodeList jugadores = (NodeList) xPath.compile("goleadores/persona").evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < jugadores.getLength(); i++) {
                try {
                    Node currentPlayer = jugadores.item(i);
                    String externalId = xPath.compile("@id").evaluate(currentPlayer),
                            name = xPath.compile("nombre").evaluate(currentPlayer),
                            fullname = xPath.compile("nombreCompleto").evaluate(currentPlayer),
                            nickmane = xPath.compile("apodo").evaluate(currentPlayer),
                            teamExtId = xPath.compile("equipo/@id").evaluate(currentPlayer),
                            teamName = xPath.compile("equipo/@nombreCorto").evaluate(currentPlayer),
                            teamCountryName = xPath.compile("equipo/@paisNombre").evaluate(currentPlayer),
                            teamCountryExtId = xPath.compile("equipo/@paisId").evaluate(currentPlayer),
                            goals = xPath.compile("goles").evaluate(currentPlayer),
                            byplay = xPath.compile("jugada").evaluate(currentPlayer),
                            hearder = xPath.compile("cabeza").evaluate(currentPlayer),
                            freeKick = xPath.compile("tirolibre").evaluate(currentPlayer),
                            penalty = xPath.compile("penal").evaluate(currentPlayer),
                            countryExtId = xPath.compile("pais/@id").evaluate(currentPlayer),
                            countryName = xPath.compile("pais").evaluate(currentPlayer);

                    Countries playerCountry = new Countries(countryName, Long.parseLong(countryExtId));
                    playerCountry.validateCountry();
                    Countries teamCountry = new Countries(teamCountryName, Long.parseLong(teamCountryExtId));
                    teamCountry.validateCountry();
                    Team playerTeam = new Team(teamName, Long.parseLong(teamExtId), teamCountry);
                    playerTeam.validateTeam();
                    //String date = "" + Utils.currentTimeStamp(Utils.APP_TIMEZONE);

                    long idCompetition = currentCompetition.getIdCompetitions();
                    Scorer ti = new Scorer(name, fullname, nickmane, playerTeam, Integer.parseInt(goals),
                            Integer.parseInt(byplay), Integer.parseInt(hearder), Integer.parseInt(freeKick),
                            Integer.parseInt(penalty), playerCountry, externalId, idCompetition, fecha);
                    ti.validateScorer();

                } catch (Exception ex) {
                    //error parseando goleadores
                    Utils.printToLog(DataFactoryScraper.class,
                            "Error en DataFactoryScraper",
                            "ocurrio un error parseando los goleadores del torneo:" + currentCompetition.getName() + ", se continua el proceso",
                            false,
                            ex,
                            "support-level-1",
                            Config.LOGGER_ERROR);
                }
            }
        }catch (Exception ex){
            Utils.printToLog(DataFactoryScraper.class,
                    "Error en DataFactoryScraper",
                    "Error inesperado parseando el archivo de goleadores:"  + fileRoute + " el proceso no se pudo completar",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    private void parseMinaMin(String fileRoute){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            //get idcompetition
            String extIdTorneo = xPath.compile("campeonato/@id").evaluate(document),
                    nombreTorneo = xPath.compile("campeonato").evaluate(document),
                    extIdPartido = xPath.compile("ficha/fichapartido/partido/@id").evaluate(document);
                    //idPartido = xPath.compile("ficha/fichapartido/partido").evaluate(document);

            //categoria
            String categoria = xPath.compile("ficha/categoria").evaluate(document),
                    extCategoria = xPath.compile("ficha/categoria/@id").evaluate(document);
            CompetitionType category = new CompetitionType(categoria, Long.parseLong(extCategoria));
            category.validate();

            //get competencia
            Competition currentComp = new Competition(nombreTorneo, Long.parseLong(extIdTorneo), getIdApp(), category);
            currentComp.validateCompetition();

            //get juego with id
            GameMatch currentGameMatch = GameMatch.findByIdExternal(extIdPartido);
            if (currentGameMatch != null) {
                //continue
                NodeList equipos = (NodeList) xPath.compile("ficha/fichapartido/equipo").evaluate(document, XPathConstants.NODESET);
                if (equipos.getLength() > 0) {
                    //team a
                    Node teamAraw = equipos.item(0);
                    String localId = xPath.compile("@id").evaluate(teamAraw);
                    //team b
                    Node teamBraw = equipos.item(1);

                    String visitId = xPath.compile("@id").evaluate(teamBraw);
                    Team localTeam = Team.findByExtId(Long.parseLong(localId));
                    Team awayTeam = Team.findByExtId(Long.parseLong(visitId));

                    if (localTeam != null && awayTeam != null) {
                        //continue
                        //get incidencias
                        NodeList incidencias = (NodeList) xPath.compile("ficha/fichapartido/incidencias").evaluate(document, XPathConstants.NODESET);
                        for (int i = 0; i < incidencias.getLength(); i++) {
                            Node curr = incidencias.item(i);
                            String minuto = xPath.compile("minuto").evaluate(curr),
                                    tiempo = xPath.compile("tiempo").evaluate(curr),
                                    jugador = xPath.compile("jugador").evaluate(curr),
                                    jugadorId = xPath.compile("jugador/@id").evaluate(curr),//dont really need this

                                    equipoId = xPath.compile("incidencia/key/@id").evaluate(curr),
                                    equipoNombre = xPath.compile("incidencia/key").evaluate(curr),

                                    incidentExtId = xPath.compile("incidencia/@inciid").evaluate(curr), //ext_id
                                    incidentId = xPath.compile("incidencia/@id").evaluate(curr),
                                    incidentType = xPath.compile("incidencia/@tipo").evaluate(curr),
                                    incidentSubType = xPath.compile("incidencia/@subtipo").evaluate(curr),
                                    incidentOrder = xPath.compile("incidencia/@orden").evaluate(curr);

                            //description: tipo + (if subtipo>0) subtipo
                            Action ac = new Action("mnemonic","description");
                            Period incidentPeriod = new Period("name", "shortname", null);

                            //GameMatchEvent toInsert = null; //new GameMatchEvent();
                            //toInsert.save();

                        }
                        //estado del partido
                    } else {
                        //send alarm
                    }

                }
            }
        }catch (Exception ex){
            Utils.printToLog(DataFactoryScraper.class,
                    "Error en DataFactoryScraper",
                    "Error inesperado parseando el archivo de minuto a minuto:"  + fileRoute + " el proceso no se pudo completar",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }

    }

    private void processFolder(String path) {
        File folder = new File(path);
        File[] listOfFiles = folder.listFiles();
        for (int i = 0; i < listOfFiles.length; i++) {
            File current = listOfFiles[i];
            if (current.isFile()) {
                String fileName = current.getName();
                if (fileName.contains("fixture")) { //fixture
                    parseFixture(path + File.separator + fileName);
                } else if (fileName.contains("calendario")) {//calendario
                    //not in use
                } else if (fileName.contains("posiciones")) { //posiciones
                    parsePositions(path + File.separator + fileName);
                } else if (fileName.contains("goleadores")) { //goleadores
                    parseStrikers(path + File.separator + fileName);
                } else if (fileName.contains("ficha")) { //ficha
                    //not in use
                } else if (fileName.contains("mam")) { //ficha minuto a minuto
                   // parseMinaMin(path + File.separator + fileName);
                } else if (fileName.contains("plantelxcampeonato")) { //plantel
                    //not in use
                } else { //desconocido
                    //must send alarm or not??
                }
            } else if (current.isDirectory()) {
                //go depper
                processFolder(path + File.separator + listOfFiles[i].getName());
            }
        }
    }

    private String cleanHour(String value){
        String tr = value.replaceAll(":", "");
        return tr;
    }

}
