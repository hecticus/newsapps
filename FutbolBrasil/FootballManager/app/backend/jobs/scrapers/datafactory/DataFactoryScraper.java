package backend.jobs.scrapers.datafactory;

import akka.actor.Cancellable;
import backend.HecticusThread;
import exceptions.DownloadFailedException;
import exceptions.KyubiParsingException;
import models.Config;
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
            parseStrikers("tempFiles/deportes.futbol.brasileirao.goleadores.xml");

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
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            String expression = "";//fixture

            //data no ciclica
            NodeList fecha = (NodeList) xPath.compile("fixture/fecha").evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < fecha.getLength(); i++){
                Node currentFecha = fecha.item(i);
                NodeList partidos = (NodeList) xPath.compile("partido").evaluate(currentFecha, XPathConstants.NODESET);
                for (int j = 0; j < partidos.getLength(); j++){
                    Node currentPartido = partidos.item(j);
                    //goleadores local
                    NodeList jugadoresLocal = (NodeList) xPath.compile("goleadoreslocal/jugador").evaluate(currentPartido, XPathConstants.NODESET);
                    for (int k = 0; k < jugadoresLocal.getLength(); k++){
                        //get goles
                    }
                    //goleadores visitante
                    NodeList jugadoresVisitante = (NodeList) xPath.compile("goleadoresvisitante/jugador").evaluate(currentPartido, XPathConstants.NODESET);
                    for (int k = 0; k < jugadoresVisitante.getLength(); k++){
                        //get goles
                    }
                    //medios
                    NodeList medios = (NodeList) xPath.compile("").evaluate(currentPartido, XPathConstants.NODESET);
                }
                NodeList ganadores = (NodeList) xPath.compile("").evaluate(document, XPathConstants.NODESET);

            }
            //partido
            //estado
            //horaEstado
            //local
            //goleslocal
                //jugador(goles)
                    //goles
                        //gol

            //goleadoresloca
            //golesDefPenaleslocal

            //visitante
            //golesvisitante
                //jugador (goles)
            //golesDefPenalesvisitante
            //arbitro

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
            //data fija
            NodeList equipos = (NodeList) xPath.compile("posiciones/equipo").evaluate(document, XPathConstants.NODESET);
            System.out.println("teams:" + equipos.getLength());
            for (int i = 0; i < equipos.getLength(); i++) {
                Node currentTeam = equipos.item(i);
                String teamExtId = xPath.compile("@id").evaluate(currentTeam);
                String teamName = xPath.compile("").evaluate(currentTeam),
                        points =  xPath.compile("").evaluate(currentTeam),
                        played =  xPath.compile("").evaluate(currentTeam),
                        playedLocal =  xPath.compile("").evaluate(currentTeam),
                        playedVisitor =  xPath.compile("").evaluate(currentTeam),
                        wins =  xPath.compile("").evaluate(currentTeam),
                        draws =  xPath.compile("").evaluate(currentTeam),
                        lost =  xPath.compile("").evaluate(currentTeam),
                        localWins =  xPath.compile("").evaluate(currentTeam),
                        localDraws =  xPath.compile("").evaluate(currentTeam),
                        localLost =  xPath.compile("").evaluate(currentTeam),
                        visitorWins =  xPath.compile("").evaluate(currentTeam),
                        visitorDraws =  xPath.compile("").evaluate(currentTeam),
                        visitorLost =  xPath.compile("").evaluate(currentTeam),
                        localGoalsFor =  xPath.compile("").evaluate(currentTeam),
                        localGoalsAgains =  xPath.compile("").evaluate(currentTeam),
                        visitorGoalsFor =  xPath.compile("").evaluate(currentTeam),
                        visitorGoalsAgains =  xPath.compile("").evaluate(currentTeam),

                        goalsFor=  xPath.compile("").evaluate(currentTeam),
                        goalsAgains =  xPath.compile("").evaluate(currentTeam),

                        goalDiff =  xPath.compile("").evaluate(currentTeam),
                        localPoints =  xPath.compile("").evaluate(currentTeam),
                        visitorPoints =  xPath.compile("").evaluate(currentTeam),
                        //data
                        yellowCards =  xPath.compile("").evaluate(currentTeam),
                        redCards =  xPath.compile("").evaluate(currentTeam),
                        red2yellow =  xPath.compile("").evaluate(currentTeam),
                        penaltyFouls =  xPath.compile("").evaluate(currentTeam),
                        penaltyHands =  xPath.compile("").evaluate(currentTeam),
                        commitedFouls =  xPath.compile("").evaluate(currentTeam),
                        receivedFouls =  xPath.compile("").evaluate(currentTeam),
                        penaltyFoulsReceived =  xPath.compile("").evaluate(currentTeam),
                        nivel =  xPath.compile("").evaluate(currentTeam),
                        nivelDesc =  xPath.compile("").evaluate(currentTeam),
                        order =  xPath.compile("").evaluate(currentTeam),
                        orderDesc =  xPath.compile("").evaluate(currentTeam),
                        //tribunal disc
                        streak =  xPath.compile("").evaluate(currentTeam);

                System.out.println("id:" + xPath.compile("@key").evaluate(equipos.item(i)));
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

    //"tempFiles/deportes.afp.brasileirao.plantelxcampeonato.xml"
    private void plantel(String fileRoute){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            //InputSource source = new InputSource(new StringReader(xml)); //for xml from string

            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            //data fija
            String expression = "";
            NodeList equipo = (NodeList) xPath.compile("plantelEquipo/equipo").evaluate(document, XPathConstants.NODESET);
            System.out.println("cant equipos:" + equipo.getLength());
            for (int i = 0; i < equipo.getLength(); i++){
                Node currentTeam =  equipo.item(i);
                //get team if not exist skip
                NodeList jugadores = (NodeList) xPath.compile("jugadores/jugador").evaluate(currentTeam, XPathConstants.NODESET);
                System.out.println("cant jugadores:" + jugadores.getLength());
//                for (int j = 0; j < jugadores.getLength(); j++ ){
//                    System.out.println(xPath.compile("nombre").evaluate(jugadores.item(j)));
//                }
                NodeList jugadoresBaja = (NodeList) xPath.compile("jugadoresDadosBaja/jugador").evaluate(currentTeam, XPathConstants.NODESET);
            }

        }catch (Exception ex){
            Utils.printToLog(DataFactoryScraper.class,
                    "Error en DataFactoryScraper",
                    "Error inesperado parseando el archivo del plantel del equipo:" + fileRoute + " el proceso no se pudo completar",
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

    private void parseTeams(){

    }

    private void parseMinaMin(String fileRoute){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            //data fija
            String expression = "";
            NodeList jugadores = (NodeList) xPath.compile(expression).evaluate(document, XPathConstants.NODESET);


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

    private void parseMatch(String fileRoute){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            //data fija
            String expression = "";
            NodeList jugadores = (NodeList) xPath.compile(expression).evaluate(document, XPathConstants.NODESET);


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

                } else if (fileName.contains("calendario")) {//calendario

                } else if (fileName.contains("posiciones")) { //posiciones

                } else if (fileName.contains("goleadores")) { //goleadores

                } else if (fileName.contains("ficha")) { //ficha

                } else if (fileName.contains("mam")) { //ficha minuto a minuto

                } else if (fileName.contains("plantelxcampeonato")) { //plantel

                } else { //desconocido
                    //must send alarm or not??
                }
            } else if (current.isDirectory()) {
                //go depper
                processFolder(current.getPath());
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

}
