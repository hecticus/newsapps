package backend.jobs.scrapers.datafactory;

import akka.actor.Cancellable;
import backend.HecticusThread;
import exceptions.DownloadFailedException;
import exceptions.KyubiParsingException;
import org.apache.commons.net.ftp.FTPClient;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

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


    protected void ftpDownloader() throws DownloadFailedException, KyubiParsingException {
        try{
            FTPClient client = new FTPClient();
            FileOutputStream fos = null;
            String localFile = "logs" + File.separator + fileName;
            String remoteFile = fileName;
            boolean successDl = false;
            client.setActivePortRange(50000, 50100);
            client.connect(hostAddr);
            client.enterLocalPassiveMode();
            //fix for java 7
            client.setBufferSize(0);
            if (client.login(username, password)){
                fos = new FileOutputStream(localFile);
                successDl = client.retrieveFile(remoteFile, fos);
                if (!successDl){
                    int code = client.getReplyCode();
                    throw new DownloadFailedException("");
                }
                parseFile(localFile);
            }

        }catch (IOException ex){

        }
    }

    @Override
    public void process(Map args){
        try {
            System.out.println("allonsy!!");
            //load configs
//            hostAddr = (String) args.get("");
//            username = (String) args.get("");
//            password = (String) args.get("");
//            fileName = (String) args.get("");
//            //ftp process
//            ftpDownloader();
//        }catch (DownloadFailedException ex){
//            //fallo la descarga del archivo
//        }catch (KyubiParsingException ex){
//            //fallo parseando el archivo
            //plantel("");
            parsePositions();

        }catch (Exception ex){
            //dont catch so i can update on badconfigs
        }
    }

    protected void parseFile(String fileRoute) throws KyubiParsingException {
        try{
            //read
            //parse
            //trigger multiple threads or if needed update bd


        }catch (Exception ex){

        }
    }

    private void parseFixture(){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            //InputSource source = new InputSource(new StringReader(xml)); from string

            Document document = builder.parse(new FileInputStream("tempFiles/deportes.futbol.brasileirao.fixture.xml"));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            String expression = "";//fixture

            //data no ciclica
            NodeList fecha = (NodeList) xPath.compile("fixture/fecha").evaluate(document, XPathConstants.NODESET);
            for (int i = 0; i < fecha.getLength(); i++){
                Node currentFecha = fecha.item(i);
                NodeList partidos = (NodeList) xPath.compile("").evaluate(currentFecha, XPathConstants.NODESET);
                for (int j = 0; j < partidos.getLength(); j++){
                    Node currentPartido = partidos.item(j);
                    //goleadores local
                    NodeList jugadoresLocal = (NodeList) xPath.compile("").evaluate(currentPartido, XPathConstants.NODESET);
                    for (int k = 0; k < jugadoresLocal.getLength(); k++){
                        //get goles
                    }
                    //goleadores visitante
                    NodeList jugadoresVisitante = (NodeList) xPath.compile("").evaluate(currentPartido, XPathConstants.NODESET);
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



            //

        }catch (Exception ex){
            ex.printStackTrace();
        }
    }

    private void parsePositions(){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            //InputSource source = new InputSource(new StringReader(xml)); from string

            Document document = builder.parse(new FileInputStream("tempFiles/deportes.futbol.brasileirao.posiciones.xml"));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            //data fija
            NodeList equipos = (NodeList) xPath.compile("posiciones/equipo").evaluate(document, XPathConstants.NODESET);
            System.out.println("teams:" + equipos.getLength());
            for (int i = 0; i < equipos.getLength(); i++) {
                System.out.println("id:" + xPath.compile("@key").evaluate(equipos.item(i)));
            }


        }catch (Exception ex){
            ex.printStackTrace();
        }

    }

    private void plantel(String xml){
        System.out.println("start");
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            InputSource source = new InputSource(new StringReader(xml));

            Document document = builder.parse(new FileInputStream("tempFiles/deportes.futbol.brasileirao.plantelxcampeonato.xml"));
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
                System.out.println("cant jugadores:" + jugadoresBaja.getLength());
            }
            System.out.println("end");

        }catch (Exception ex){
            ex.printStackTrace();
        }
    }

    private void parseStrikers(){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            //InputSource source = new InputSource(new StringReader(xml)); from string

            Document document = builder.parse(new FileInputStream(""));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            //data fija
            String expression = "";
            NodeList jugadores = (NodeList) xPath.compile(expression).evaluate(document, XPathConstants.NODESET);


        }catch (Exception ex){

        }
    }

    private void parseTeams(){

    }

    private void parseMinaMin(){

    }

    private void parseMatch(){

    }

}
