package backend.jobs.scrapers.lancenews;

import backend.HecticusThread;
import exceptions.BasicException;
import exceptions.DownloadFailedException;
import models.News;
import models.Resource;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;

import org.apache.sanselan.Sanselan;
import org.apache.sanselan.common.IImageMetadata;
import org.apache.sanselan.common.ImageMetadata;
import org.apache.sanselan.formats.jpeg.JpegImageMetadata;
import org.apache.sanselan.formats.tiff.TiffImageMetadata;
import org.w3c.dom.Document;
import utils.Utils;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TimeZone;

/**
 * Created by sorcerer on 9/26/14.
 */
public class LanceNewsScraper extends HecticusThread {

    private String categoryToInsert,
            toUploadLocation;

    private int idLanguage;

    public LanceNewsScraper() {
        //set name
        this.setName("LanceNewsScrapper-" + System.currentTimeMillis());
    }

    @Override
    public void process(Map args) {
        try {
            //get params
            System.out.println(System.currentTimeMillis()+" arrancando!");

            toUploadLocation = "";

            categoryToInsert = "Futebol";
            processFolderFiles("tempFiles"); //route to files
            System.out.println("fin");

        }catch (Exception ex){
            ex.printStackTrace();
        }
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
                System.out.println("FOLDER!!!!");
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
            System.out.println("really????");
          //el xml le faltan un tag
            //ex.printStackTrace();
        } catch (Exception ex){
           // System.out.println("oh fucks:" + fileRoute);
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
                    insertedTime = ""+Utils.currentTimeStamp(TimeZone.getTimeZone("America/Caracas")),
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
            ex.printStackTrace();
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
            return "" + Utils.currentTimeStamp(TimeZone.getTimeZone("America/Caracas"));
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
            return "" + Utils.currentTimeStamp(TimeZone.getTimeZone("America/Caracas"));
        }
    }

//      funcion comentada por que no es necesaria debe borrarse
//    private ArrayList<String> ftpDownloader(String remoteDirectory, String localRoute) {
//        ArrayList<String> localFileList = new ArrayList<String>();
//        try{
//            FTPClient client = new FTPClient();
//            FileOutputStream fos = null;
//            String localDirectory = "tempFiles" + File.separator + localRoute;
//            boolean successDl = false;
//            client.setActivePortRange(50000, 50100);
//            client.connect(hostAddr);
//            client.enterLocalPassiveMode();
//            //fix for java 7
//            client.setBufferSize(0);
//            if (client.login(username, password)){
//                if (client.changeWorkingDirectory(remoteDirectory)){
//                    FTPFile[] subFiles = client.listFiles(remoteDirectory);
//                    for (FTPFile file : subFiles) {
//                        String currentFileName = file.getName();
//                        try {
//                            if (currentFileName.equals(".") || currentFileName.equals("..")) {
//                                continue;
//                            }
//                            if (file.isFile()) { //get
//                                String actualLocalFile = localDirectory + File.separator + file.getName();
//                                fos = new FileOutputStream(actualLocalFile);
//                                successDl = client.retrieveFile(file.getName(), fos);
//                                fos.close();
//                                if (!successDl) {
//                                    int code = client.getReplyCode();
//                                    throw new DownloadFailedException("fallo la descarga del archivo:" + file.getName() + " error:" + code);
//                                }
//                                localFileList.add(actualLocalFile);
//                            }
//                            //if directory skip?
//
//                        } catch (DownloadFailedException ex) {
//                            //fallo 1 continue
//                        }
//                    }
//
//                }else {
//                    //el dir no existe}
//                    throw new BasicException("el directorio no existe");
//                }
//            }else {
//                //fallo la conexion al ftp
//                throw new BasicException("fallo la conexion al FTP:" + hostAddr);
//            }
//
//        }catch (IOException ex){
//            ex.printStackTrace();
//        }catch (BasicException ex){
//            ex.printStackTrace();
//        }
//        //resumen de archivos fallidos?
//
//        return localFileList;
//    }

    
}
