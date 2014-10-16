package backend.jobs.scrapers.lancenews;

import backend.HecticusThread;
import com.sun.org.apache.xpath.internal.SourceTree;
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

    private String hostAddr,
            username,
            password,
            categoryToInsert,
            toUploadLocation;

    private int idLanguage;

    public LanceNewsScraper() {
        //set name
    }

    @Override
    public void process(Map args) {
        try {
            //get params
            System.out.println("arrancando!");
            hostAddr = "ftp.hecticus.com";
            username = "lance";
            password = "VLxPso0r";
            toUploadLocation = "";
            //if temp files, process
            //process temp file
            parseTextFile("tempFiles/99116SIXFBX1609071.XML");
            processImage("tempFiles/99117SIISP-1609305.JPG");
//            ArrayList<String> newsFiles =  ftpDownloader("/texto");
//            ArrayList<String> imageFiles = ftpDownloader("/images");
//            for (int i = 0; i < newsFiles.size(); i++){
//                parseTextFile(newsFiles.get(i));
//            }
//            for (int i= 0; i < imageFiles.size(); i++){
//                processImage(imageFiles.get(i));
//            }
//            //upload images to rackspace
//            //cleanup only image files
//            for (int i = 0; i < newsFiles.size(); i++){
//                Utils.delete(newsFiles.get(i));
//            }

        }catch (Exception ex){
            ex.printStackTrace();
        }
    }

    private ArrayList<String> ftpDownloader(String remoteDirectory, String localRoute) {
        ArrayList<String> localFileList = new ArrayList<String>();
        try{
            FTPClient client = new FTPClient();
            FileOutputStream fos = null;
            String localDirectory = "tempFiles" + File.separator + localRoute;
            boolean successDl = false;
            client.setActivePortRange(50000, 50100);
            client.connect(hostAddr);
            client.enterLocalPassiveMode();
            //fix for java 7
            client.setBufferSize(0);
            if (client.login(username, password)){
                if (client.changeWorkingDirectory(remoteDirectory)){
                    FTPFile[] subFiles = client.listFiles(remoteDirectory);
                    for (int i = 0; i < subFiles.length; i++) {
                        FTPFile file = subFiles[i];
                        String currentFileName = file.getName();
                        try {
                            if (currentFileName.equals(".") || currentFileName.equals("..")) {
                                continue;
                            }
                            if (file.isFile()){ //get
                                String actualLocalFile = localDirectory + File.separator +file.getName();
                                fos = new FileOutputStream(actualLocalFile);
                                successDl = client.retrieveFile(file.getName(), fos);
                                fos.close();
                                if (!successDl){
                                    int code = client.getReplyCode();
                                    throw new DownloadFailedException("fallo la descarga del archivo:" + file.getName() +" error:" +code);
                                }
                                localFileList.add(actualLocalFile);
                            }
                            //if directory skip?

                        }catch (DownloadFailedException ex){
                            //fallo 1 continue
                        }
                    }

                }else {
                    //el dir no existe}
                    throw new BasicException("el directorio no existe");
                }
            }else {
                //fallo la conexion al ftp
                throw new BasicException("fallo la conexion al FTP:" + hostAddr);
            }

        }catch (IOException ex){
            ex.printStackTrace();
        }catch (BasicException ex){
            ex.printStackTrace();
        }
        //resumen de archivos fallidos?

        return localFileList;
    }

    private void parseTextFile(String fileRoute){
        DocumentBuilderFactory builderFactory =
                DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = null;
        try {
            builder = builderFactory.newDocumentBuilder();
            Document document = builder.parse(new FileInputStream(fileRoute));
            XPath xPath =  XPathFactory.newInstance().newXPath();
            String timestamp = xPath.compile("news/article/timestamp").evaluate(document),
                    language = xPath.compile("news/article/linguagem").evaluate(document), //deberia estar fijo a portugues
                    //local = xPath.compile("news/article/summary").evaluate(document),
                    publicationDate = xPath.compile("news/article/dataPublicacao").evaluate(document),
                    title = xPath.compile("news/article/title").evaluate(document),
                    summary = xPath.compile("news/article/summary").evaluate(document),
                    category = xPath.compile("news/article/category").evaluate(document),
                    keyword = xPath.compile("news/article/keyword").evaluate(document),
                    search = xPath.compile("news/article/search").evaluate(document),
                    author = xPath.compile("news/article/author").evaluate(document),
                    story = xPath.compile("news/article/story").evaluate(document),
                    source = xPath.compile("news/@source").evaluate(document),
                    lastUpdate = xPath.compile("news/@lastUpdate").evaluate(document);
            News toInsert = new News();
            //idLanguage and idApp from job
            //set values or new contructor
            //if not ok throw Exception
            if (toInsert.getCategories().equalsIgnoreCase(categoryToInsert)){ //continue
                System.out.println("title:" + toInsert.getTitle());
                News existing = News.getNewsByTitleAndApp();
                if (existing!=null){
                    if (Long.parseLong(existing.getUpdatedDate())< Long.parseLong(toInsert.getUpdatedDate())){
                        //update
                        toInsert.setIdNews(existing.getIdNews());
                        toInsert.update();
                    }//else skip
                }else { //new
                    toInsert.save();
                }
            }//else skip
        } catch (XPathExpressionException ex){
          //el xml le faltan un tag
            ex.printStackTrace();
        } catch (Exception ex){
            ex.printStackTrace();
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
        }catch (Exception ex){
            ex.printStackTrace();
        }
    }

    private ArrayList<String> getNewsTempFiles(){

        return null;
    }

    private ArrayList<String> getImagesTempFiles(){
        return null;
    }

    private void uploadToCloud(){

    }
}
