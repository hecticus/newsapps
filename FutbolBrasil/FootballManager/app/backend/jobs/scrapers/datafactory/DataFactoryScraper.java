package backend.jobs.scrapers.datafactory;

import akka.actor.Cancellable;
import backend.HecticusThread;
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

    protected String hostAddr,
            username,
            password,
            fileName;

    /*
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
            System.out.println("allonsy!!");
            //read folder files
            processFolder("tempFiles");
            System.out.println("end!!!");

        }catch (Exception ex){
            Utils.printToLog(DataFactoryScraper.class,
                    "Error en DataFactoryScraper",
                    "error inesperado en el DataFactoryScraper, el proceso no fue finalizado. se reintentara",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    //"tempFiles/deportes.afp.brasileirao.fixture.xml"
    private void parseFixture(String fileRoute){
        System.out.println(fileRoute);
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            String extIdCompetition = xPath.compile("fixture/campeonato/@id").evaluate(document);
            String competitionName = xPath.compile("fixture/campeonato").evaluate(document);
            String fechaDelDia = xPath.compile("fechaActual").evaluate(document);
            String horaDelDia = xPath.compile("horaActual").evaluate(document);
            //validando
            Competition compFromFile = new Competition(competitionName, Long.parseLong(extIdCompetition), getIdApp());
            compFromFile.validateCompetition();
            //usar fecha para fase

            NodeList fecha = (NodeList) xPath.compile("fixture/fecha").evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < fecha.getLength(); i++){
                Node currentFecha = fecha.item(i);
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
                            arbitro = xPath.compile("arbitro").evaluate(currentPartido),
                            penalesLocal = xPath.compile("golesDefPenaleslocal").evaluate(currentPartido),
                            penalesVisit = xPath.compile("golesDefPenalesvisitante").evaluate(currentPartido);

                    //fases
                    Phase gamePhase = new Phase();
                    Countries localCountry = new Countries(equipoLocalPaisNombre, Long.parseLong(equipoLocalPaisId));
                    localCountry.validateCountry();
                    Team localTeam = new Team(equipoLocalNombre, Long.parseLong(equipoLocalId), localCountry);
                    localTeam.validateTeam();
                    Countries awayCountry = new Countries(equipoVisitPaisNombre, Long.parseLong(equipoLocalPaisId));
                    awayCountry.validateCountry();
                    Team awayTeam = new Team(equipoVisitNombre, Long.parseLong(equipoVisitId), awayCountry);
                    awayTeam.validateTeam();

                    Venue gameVenue = new Venue(Long.parseLong(idEstadio),nombreEstadio, ciudadEstadio, localCountry);
                    gameVenue.validateVenue();
                    int localGoles = 0, awayGoles = 0;

                    GameMatch partidoFromFile = new GameMatch(gamePhase,localTeam,awayTeam,gameVenue,equipoLocalNombre,
                            equipoVisitNombre,localGoles, awayGoles, actualFecha,status, Long.parseLong(idExtPartido), compFromFile );
                    partidoFromFile.save();

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
            System.out.println(fileRoute);
            builder = builderFactory.newDocumentBuilder();
            //InputSource source = new InputSource(new StringReader(xml)); from string
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            String idTorneo = xPath.compile("posiciones/campeonato/@id").evaluate(document),
                    torneoName = xPath.compile("posiciones/campeonato").evaluate(document),
                    fecha = xPath.compile("posiciones/fechaNombre").evaluate(document);
            NodeList equipos = (NodeList) xPath.compile("posiciones/equipo").evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < equipos.getLength(); i++) {
                Node currentTeam = equipos.item(i);
                String teamExtId = xPath.compile("@id").evaluate(currentTeam);
                String teamName = xPath.compile("nombre").evaluate(currentTeam),
                        points =  xPath.compile("puntos").evaluate(currentTeam),
                        played =  xPath.compile("jugados").evaluate(currentTeam),
                        playedLocal =  xPath.compile("jugadoslocal").evaluate(currentTeam),
                        playedVisitor =  xPath.compile("jugadosvisitantes").evaluate(currentTeam),
                        wins =  xPath.compile("ganados").evaluate(currentTeam),
                        draws =  xPath.compile("emapatados").evaluate(currentTeam),
                        lost =  xPath.compile("perdidos").evaluate(currentTeam),
                        localWins =  xPath.compile("ganadoslocal").evaluate(currentTeam),
                        localDraws =  xPath.compile("ematadoslocal").evaluate(currentTeam),
                        localLost =  xPath.compile("perdidoslocal").evaluate(currentTeam),
                        visitorWins =  xPath.compile("ganadosvisitantes").evaluate(currentTeam),
                        visitorDraws =  xPath.compile("empatadosvisitantes").evaluate(currentTeam),
                        visitorLost =  xPath.compile("perdidosvisitantes").evaluate(currentTeam),
                        localGoalsFor =  xPath.compile("golesfavorlocal").evaluate(currentTeam),
                        localGoalsAgains =  xPath.compile("golescontralocal").evaluate(currentTeam),
                        visitorGoalsFor =  xPath.compile("golesfavorvisitante").evaluate(currentTeam),
                        visitorGoalsAgains =  xPath.compile("golescontravisitante").evaluate(currentTeam),

                        goalsFor=  xPath.compile("golesfavor").evaluate(currentTeam),
                        goalsAgains =  xPath.compile("golescontra").evaluate(currentTeam),

                        goalDiff =  xPath.compile("difgol").evaluate(currentTeam),
                        localPoints =  xPath.compile("puntoslocal").evaluate(currentTeam),
                        visitorPoints =  xPath.compile("puntosvisitante").evaluate(currentTeam),
                        //data
                        yellowCards =  xPath.compile("am").evaluate(currentTeam),
                        redCards =  xPath.compile("rojas").evaluate(currentTeam),
                        red2yellow =  xPath.compile("rojaX2am").evaluate(currentTeam),
                        penaltyFouls =  xPath.compile("faltasPen").evaluate(currentTeam),
                        penaltyHands =  xPath.compile("manoPen").evaluate(currentTeam),
                        commitedFouls =  xPath.compile("faltasCom").evaluate(currentTeam),
                        receivedFouls =  xPath.compile("faltasRec").evaluate(currentTeam),
                        penaltyFoulsReceived =  xPath.compile("faltasPenRec").evaluate(currentTeam),
                        nivel =  xPath.compile("nivel").evaluate(currentTeam),
                        nivelDesc =  xPath.compile("nivelDesc").evaluate(currentTeam),
                        order =  xPath.compile("orden").evaluate(currentTeam),
                        orderDesc =  xPath.compile("ordenDesc").evaluate(currentTeam),
                        //tribunal disc
                        streak =  xPath.compile("racha").evaluate(currentTeam);

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

    private void parseStrikers(String fileRoute){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            System.out.println(fileRoute);
            builder = builderFactory.newDocumentBuilder();
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            //data fija
            NodeList jugadores = (NodeList) xPath.compile("goleadores/persona").evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < jugadores.getLength(); i++){
                Node currentPlayer = jugadores.item(i);
                String externalId = xPath.compile("@id").evaluate(currentPlayer),
                        name = xPath.compile("nombre").evaluate(currentPlayer),
                        fullname = xPath.compile("nombreCompleto").evaluate(currentPlayer),
                        nickmane = xPath.compile("apodo").evaluate(currentPlayer),
                        teamExtId = xPath.compile("equipo/@id").evaluate(currentPlayer),
                        teamName = xPath.compile("equipo/@nombreCorto").evaluate(currentPlayer),
                        teamCountryExtId = xPath.compile("equipo/@paisId").evaluate(currentPlayer),
                        goals = xPath.compile("goles").evaluate(currentPlayer),
                        byplay = xPath.compile("jugada").evaluate(currentPlayer),
                        hearder = xPath.compile("cabeza").evaluate(currentPlayer),
                        freeKick = xPath.compile("tirolibre").evaluate(currentPlayer),
                        penalty = xPath.compile("penal").evaluate(currentPlayer),
                        countryExtId = xPath.compile("pais/@id").evaluate(currentPlayer),
                        countryName  =  xPath.compile("pais").evaluate(currentPlayer);
                //build scorer
                //getTeam
                //getCountry
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
                    extIdPartido = xPath.compile("ficha/fichapartido/partido/@id").evaluate(document),
                    partido = xPath.compile("ficha/fichapartido/partido").evaluate(document);
            NodeList equipos = (NodeList) xPath.compile("ficha/fichapartido/equipo").evaluate(document, XPathConstants.NODESET);
            if (equipos.getLength() > 0) {
                //team a
                //team b
            }

            //get incidencias
            NodeList incidencias = (NodeList) xPath.compile("ficha/fichapartido/incidencias").evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < incidencias.getLength(); i++){
                Node curr = incidencias.item(i);
                String minuto = xPath.compile("minuto").evaluate(curr),
                        tiempo = xPath.compile("tiempo").evaluate(curr),
                        jugador = xPath.compile("jugador").evaluate(curr),
                        jugadorId = xPath.compile("jugador/@id").evaluate(curr),
                        equipoId = xPath.compile("incidencia/key/@id").evaluate(curr),
                        equipoNombre = xPath.compile("incidencia").evaluate(curr),
                        incidentId = xPath.compile("incidencia/@id").evaluate(curr),
                        incidentType = xPath.compile("incidencia/@tipo").evaluate(curr),
                        incidentOrder = xPath.compile("incidencia/@orden").evaluate(curr);
            }
            //estado del partido
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

    private void processFolder(String path) {
        File folder = new File(path);
        File[] listOfFiles = folder.listFiles();
        for (int i = 0; i < listOfFiles.length; i++) {
            File current = listOfFiles[i];
            if (current.isFile()) {
                String fileName = current.getName();
                if (fileName.contains("fixture")) { //fixture
                    parseFixture(path+File.separator +fileName);
                } else if (fileName.contains("calendario")) {//calendario

                } else if (fileName.contains("posiciones")) { //posiciones
                    parsePositions(path+File.separator +fileName);
                } else if (fileName.contains("goleadores")) { //goleadores
                    parseStrikers(path+File.separator +fileName);
                } else if (fileName.contains("ficha")) { //ficha

                } else if (fileName.contains("mam")) { //ficha minuto a minuto

                } else if (fileName.contains("plantelxcampeonato")) { //plantel

                } else { //desconocido
                    //must send alarm or not??
                }
            } else if (current.isDirectory()) {
                //go depper
                processFolder(path + File.separator + listOfFiles[i].getName());
            }
        }
    }

//    protected void ftpDownloader() throws DownloadFailedException, KyubiParsingException {
//        try{
//            FTPClient client = new FTPClient();
//            FileOutputStream fos = null;
//            String localFile = "logs" + File.separator + fileName;
//            String remoteFile = fileName;
//            boolean successDl = false;
//            client.setActivePortRange(50000, 50100);
//            client.connect(hostAddr);
//            client.enterLocalPassiveMode();
//            //fix for java 7
//            client.setBufferSize(0);
//            if (client.login(username, password)){
//                fos = new FileOutputStream(localFile);
//                successDl = client.retrieveFile(remoteFile, fos);
//                if (!successDl){
//                    int code = client.getReplyCode();
//                    throw new DownloadFailedException("");
//                }
//                parseFile(localFile);
//            }
//
//        }catch (IOException ex){
//
//        }
//    }


    //goleadores local
//                    NodeList jugadoresLocal = (NodeList) xPath.compile("goleadoreslocal/jugador").evaluate(currentPartido, XPathConstants.NODESET);
//                    for (int k = 0; k < jugadoresLocal.getLength(); k++){
//                        System.out.println(""+xPath.compile("@nombreCompleto").evaluate(jugadoresLocal.item(k)));
//                        //get goles
//                        NodeList goles = (NodeList) xPath.compile("goles/gol").evaluate(jugadoresLocal.item(k), XPathConstants.NODESET);
//                        for (int l = 0; l < goles.getLength(); l++){
//
//                        }
//                    }
//                    //goleadores visitante
//                    NodeList jugadoresVisitante = (NodeList) xPath.compile("goleadoresvisitante/jugador").evaluate(currentPartido, XPathConstants.NODESET);
//                    for (int k = 0; k < jugadoresVisitante.getLength(); k++){
//                        //get goles
//                        //NodeList goles = (NodeList) xPath.compile("goles/gol").evaluate(jugadoresLocal, XPathConstants.NODESET);
//                    }
    //medios
    //NodeList medios = (NodeList) xPath.compile("medios/medio").evaluate(currentPartido, XPathConstants.NODESET);

}
