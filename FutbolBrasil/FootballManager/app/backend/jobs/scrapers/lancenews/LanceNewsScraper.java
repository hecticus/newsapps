package backend.jobs.scrapers.lancenews;

import backend.HecticusThread;
import exceptions.BadConfigException;
import models.Config;
import models.football.News;
import models.Resource;

import org.apache.sanselan.Sanselan;
import org.apache.sanselan.common.ImageMetadata;
import org.apache.sanselan.formats.jpeg.JpegImageMetadata;
import org.w3c.dom.Document;
import utils.Utils;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TimeZone;

/**
 * Created by sorcerer on 9/26/14.
 */
public class LanceNewsScraper extends HecticusThread {

    private String categoryToInsert,
            toUploadLocation,
            fileRoute;

    public LanceNewsScraper() {
        //set name
        this.setName("LanceNewsScrapper-" + System.currentTimeMillis());
    }

    @Override
    public void process(Map args) {
        try {
            Utils.printToLog(LanceNewsScraper.class,null,"Iniciando LanceNewsScraper",false,null,"support-level-1",Config.LOGGER_INFO);
            //get params from args
            if (args.containsKey("file_route")) {
                fileRoute = (String) args.get("");
            } else throw new BadConfigException("es necesario configurar el parametro file_route");

            if (args.containsKey("category")) {
                categoryToInsert = (String) args.get("category");
            } else throw new BadConfigException("es necesario configurar el parametro category");

            toUploadLocation = "";

            processFolderFiles(fileRoute); //route to files

        } catch (BadConfigException ex){
            //log and deactivate? maybe throw exception
            Utils.printToLog(LanceNewsScraper.class,
                    "Error en el LanceNewsScrapper",
                    "el job esta mal configurado, no puede arrancar.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        } catch (Exception ex){
            Utils.printToLog(LanceNewsScraper.class,
                    "Error en el LanceNewsScrapper",
                    "ocurrio un error inesperado en el LanceNewsScrapper, el proceso no se completo y sera reiniciado el job.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
        Utils.printToLog(LanceNewsScraper.class,null,"Finalizando LanceNewsScraper",false,null,"support-level-1",Config.LOGGER_INFO);
    }

    private void processFolderFiles(String path){
        File folder = new File(path);
        File[] listOfFiles = folder.listFiles();
        for (int i = 0; i < listOfFiles.length; i++) {
            if (listOfFiles[i].isFile()) {
                if (listOfFiles[i].getName().endsWith("xml") || listOfFiles[i].getName().endsWith("XML")){
                    parseTextFile(path + File.separator + listOfFiles[i].getName());
                    Utils.delete(path + File.separator + listOfFiles[i].getName());
                }else if (listOfFiles[i].getName().endsWith("jpg") || listOfFiles[i].getName().endsWith("JPG")){
                    processImage(path + File.separator + listOfFiles[i].getName());
                }//else skip
            } else if (listOfFiles[i].isDirectory()) {
                processFolderFiles(path + File.separator + listOfFiles[i].getName());
            }
        }
    }

    private void parseTextFile(String fileRoute){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            String timestamp = xPath.compile("news/article/timestamp").evaluate(document), //es un epoch
                    language = xPath.compile("news/article/linguagem").evaluate(document), //deberia estar fijo a portugues
                    //local = xPath.compile("news/article/summary").evaluate(document),
                    publicationDate = convertPublicationDate(xPath.compile("news/article/dataPublicacao").evaluate(document)),
                    title = xPath.compile("news/article/title").evaluate(document),
                    summary = xPath.compile("news/article/summary").evaluate(document),
                    category = xPath.compile("news/article/category").evaluate(document),
                    keyword = xPath.compile("news/article/keyword").evaluate(document),
                    search = xPath.compile("news/article/search").evaluate(document),
                    author = xPath.compile("news/article/author").evaluate(document),
                    story = xPath.compile("news/article/story").evaluate(document),
                    source = xPath.compile("news/@source").evaluate(document),
                    lastUpdate = convertLastUpdate(xPath.compile("news/@lastUpdate").evaluate(document));
            News toInsert = new News(title, summary, category, keyword, author, story, publicationDate, source,
                    lastUpdate ,getIdApp());
            //revisar el xml con tag faltante
            if (toInsert.isNewsEmpty()){
                xPath =  XPathFactory.newInstance().newXPath();
                timestamp = xPath.compile("article/timestamp").evaluate(document); //es un epoch
                        language = xPath.compile("article/linguagem").evaluate(document); //deberia estar fijo a portugues
                        //local = xPath.compile("article/summary").evaluate(document),
                        publicationDate = convertPublicationDate(xPath.compile("article/dataPublicacao").evaluate(document));
                        title = xPath.compile("article/title").evaluate(document);
                        summary = xPath.compile("article/summary").evaluate(document);
                        category = xPath.compile("article/category").evaluate(document);
                        keyword = xPath.compile("article/keyword").evaluate(document);
                        search = xPath.compile("article/search").evaluate(document);
                        author = xPath.compile("article/author").evaluate(document);
                        story = xPath.compile("article/story").evaluate(document);
                //source = xPath.compile("@source").evaluate(document);
                lastUpdate = convertPublicationDate(xPath.compile("article/dataPublicacao").evaluate(document));
                toInsert = new News(title, summary, category, keyword, author, story, publicationDate, source,
                        lastUpdate ,getIdApp());
            }

            //if not ok throw Exception
            if (toInsert.getCategories().equalsIgnoreCase(categoryToInsert)
                    || toInsert.getCategories().contains(categoryToInsert)) { //continue
                News existing = News.getNewsByTitleAndApp(getIdApp(), toInsert.getTitle());
                if (existing != null) {
                    if (Long.parseLong(existing.getUpdatedDate()) < Long.parseLong(toInsert.getUpdatedDate())) {
                        //update
                        toInsert.setIdNews(existing.getIdNews());
                        //set push values
                        toInsert.setPushStatus(existing.getPushStatus());
                        toInsert.setPushDate(existing.getPushDate());
                        toInsert.setPushStatus(existing.getPushStatus());
                        //actual update
                        toInsert.update();
                    }//else skip
                } else { //new
                    toInsert.save();
                }
            }//else skip
        } catch (XPathExpressionException ex){
          //el xml le faltan un tag
            Utils.printToLog(LanceNewsScraper.class,
                    "Error en el LanceNewsScraper",
                    "error parseando el xml del archivo:" + fileRoute + " el archivo no se pudo completar, se continua.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        } catch (Exception ex){
            Utils.printToLog(LanceNewsScraper.class,
                    "Error en el LanceNewsScrapper",
                    "error inesperado parseando el xml del archivo:" + fileRoute + " el archivo no se pudo completar, se continua.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    private void processImage(String fileRoute){
        try {
            File imageFile = new File(fileRoute);
            JpegImageMetadata meta=((JpegImageMetadata) Sanselan.getMetadata(imageFile));
            //metadata array
            //parse to conver to json
            ArrayList metadataList = meta.getItems();
            LinkedHashMap metadataJson = new LinkedHashMap();
            String name = imageFile.getName() , fileName = imageFile.getName(),
                    remoteLocation = toUploadLocation + fileName,
                    insertedTime = ""+Utils.currentTimeStamp(Utils.APP_TIMEZONE),
                    creationDate = "",
                    creationTime = "",
                    desc = "Imagen descargada del FTP de LanceNews";
            for (int i = 0; i < metadataList.size(); i++) {
                ImageMetadata.Item currentItem = (ImageMetadata.Item) metadataList.get(i);
                if (currentItem.getKeyword().equalsIgnoreCase("Object Name")) {
                    name = currentItem.getText();
                    metadataJson.put("Object Name", name);
                } else if (currentItem.getKeyword().equalsIgnoreCase("Category")) {
                    String cat = (String) metadataJson.get("Category");
                    if (cat != null) {
                        String newCat = cat + "|" + currentItem.getText();
                        metadataJson.put("Category", newCat);
                    } else {
                        metadataJson.put("Category", currentItem.getText());
                    }
                } else if (currentItem.getKeyword().equalsIgnoreCase("Supplemental Category")) {
                    String supcat = (String) metadataJson.get("Supplemental Category");
                    if (supcat != null) {
                        String newSupCat = supcat + "|" + currentItem.getText();
                        metadataJson.put("Supplemental Category", newSupCat);
                    } else {
                        metadataJson.put("Supplemental Category", currentItem.getText());
                    }
                } else if (currentItem.getKeyword().equalsIgnoreCase("Keywords")) {
                    String keywords = (String) metadataJson.get("Keywords");
                    if (keywords != null) {
                        String newKeywords = keywords + "|" + currentItem.getText();
                        metadataJson.put("Keywords", newKeywords);
                    } else {
                        metadataJson.put("Keywords", currentItem.getText());
                    }
                } else if (currentItem.getKeyword().equalsIgnoreCase("Date Created")) {
                    creationDate = currentItem.getText();
                    metadataJson.put("Date Created", currentItem.getText());
                } else if (currentItem.getKeyword().equalsIgnoreCase("Time Created")) {
                    creationTime = currentItem.getText();
                    metadataJson.put("Time Created", currentItem.getText());
                } else if (currentItem.getKeyword().equalsIgnoreCase("Headline")) {
                    metadataJson.put("Headline", currentItem.getText());
                } else if (currentItem.getKeyword().equalsIgnoreCase("Caption/Abstract")) {
                    metadataJson.put("Caption/Abstract", currentItem.getText());
                } //else skip
            }
            Resource imagenToInsert = new Resource(name, fileName, remoteLocation, desc, insertedTime, creationDate + creationTime,
                    metadataJson.toString(), getIdApp());
            //check if exists in db
            if (!Resource.imageExist(imagenToInsert.getFilename(), getIdApp())){
                imagenToInsert.save();
            }
            //upload
            //delete
        }catch (Exception ex){
            Utils.printToLog(LanceNewsScraper.class,
                    "Error en el LanceNewsScraper",
                    "ocurrio un error procesando la imagen:" + fileRoute + " el proceso continua",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    private String convertPublicationDate(String originalDate) {
        try {
            StringBuilder toReturn = new StringBuilder();
            toReturn.append("20");
            toReturn.append(originalDate.substring(6, 8)); //year
            toReturn.append(originalDate.substring(3, 5)); //month
            toReturn.append(originalDate.substring(0, 2)); //day

            toReturn.append(originalDate.substring(9, 11)); //hour
            toReturn.append(originalDate.substring(12, 14)); //minutes
            toReturn.append("00"); //seconds
            return toReturn.toString();
        } catch (Exception ex) {
            return "" + Utils.currentTimeStamp(Utils.APP_TIMEZONE);
        }
    }

    private String convertLastUpdate(String originalDate) {
        try {
            StringBuilder toReturn = new StringBuilder();
            toReturn.append(originalDate.substring(6, 10)); //year
            toReturn.append(originalDate.substring(3, 5)); //month
            toReturn.append(originalDate.substring(0, 2)); //day

            toReturn.append(originalDate.substring(11, 13)); //hour
            toReturn.append(originalDate.substring(14, 16)); //minutes
            toReturn.append("00"); //default seconds
            return toReturn.toString();
        } catch (Exception ex) {
            return "" + Utils.currentTimeStamp(Utils.APP_TIMEZONE);
        }
    }
    
}
