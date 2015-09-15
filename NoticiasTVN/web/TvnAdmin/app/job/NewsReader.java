package job;

import backend.HecticusThread;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hecticus.rackspacecloud.RackspaceCreate;
import com.hecticus.rackspacecloud.RackspacePublish;
import exceptions.TrendingTopicException;
import models.Config;
import models.news.Category;
import models.news.News;
import models.news.Resource;
import models.news.TrendingTopics;
import play.libs.F;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import utils.ImageManager;
import utils.Utils;

import java.io.File;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by plessmann on 03/08/15.
 */
public class NewsReader extends HecticusThread {

    private long lastCheckFeeds;
    private long feedsTimeConfig;

    private ArrayList list;
    private String fileRoute = "img/";

    public final static int IMG_TYPE_MAIN = 1;
    public final static int IMG_TYPE_SEC = 2;
    public final static int IMG_TYPE_EXTRA = 3;
    private String imagesUrl;
    private String trendingTropicsURL;

    public NewsReader() {
        this.setActTime(System.currentTimeMillis());
        this.setInitTime(System.currentTimeMillis());
        this.setPrevTime(System.currentTimeMillis());
        //set name
        this.setName("NewsReader-" + System.currentTimeMillis());
        list = new ArrayList();
        Map high = new HashMap();
        high.put("fileName", "high");
        high.put("percentage", 75f);

        Map med = new HashMap();
        med.put("fileName", "med");
        med.put("percentage", 50f);

        Map low = new HashMap();
        low.put("fileName", "low");
        low.put("percentage", 25f);

        list.add(high);
        list.add(med);
        list.add(low);
    }

    @Override
    public void process(Map args) {
        //init values
        lastCheckFeeds = 0;
        //get from configs or bd poner valores por defecto
        feedsTimeConfig = 300000;//10 min
        try {
            trendingTropicsURL = (String) args.get("trending_url");
            imagesUrl = (String) args.get("images_url");
            Utils.printToLog(NewsReader.class, null, "Iniciando Job", false, null, "support-level-1", Config.LOGGER_INFO);
            feedsTimeConfig = Config.getLong("tvn-news-feed-time");//5 min
            doStuffWithNews();
        } catch (Exception ex) {
            Utils.printToLog(NewsReader.class,
                    "Error en el buscador de noticias de TVN",
                    "ocurrio en un error en el buscador de noticias TVN, se detuvo el proceso",
                    false,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
        Utils.printToLog(NewsReader.class, null, "finalizando job", false, null, "support-level-1", Config.LOGGER_INFO);
    }

    private void doStuffWithNews() {
        try {
            if (isAlive() && (System.currentTimeMillis() - lastCheckFeeds) > feedsTimeConfig) { //cambiar por una config
                Utils.printToLog(NewsReader.class, null, "procesando noticias", false, null, "support-level-1", Config.LOGGER_INFO);
                List<Category> feeds = getFeeds();
                for (int i = 0; isAlive() && i < feeds.size(); i++) {
                    Category currentCat = feeds.get(i);
                    try {
                        processCategory(currentCat, list, fileRoute);
                        Utils.printToLog(NewsReader.class, null, "noticias procesadas con exito", false, null, "support-level-1", Config.LOGGER_INFO);
                    } catch (Exception ex) {
                        Utils.printToLog(NewsReader.class,
                                "Error en el buscador de noticias de TVN",
                                "ocurrio un error procesando las noticias a subir, el proceso sigue pero se salto una categoria:" + currentCat.name,
                                false,
                                ex,
                                "support-level-1",
                                Config.LOGGER_ERROR);
                    }
                }
                lastCheckFeeds = System.currentTimeMillis();
            }

        } catch (Exception ex) {
            Utils.printToLog(NewsReader.class,
                    "Error en el buscador de noticias de TVN",
                    "ocurrio un error procesando las noticias a subir",
                    false,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    private List<Category> getFeeds() throws Exception {
        return Category.getActiveCategories(1);
    }

    private void processCategory(Category currentCat, ArrayList list, String fileRoute) throws Exception {
        ArrayList<News> currentFeedNews = null;
        if (currentCat.isTrending()) {
            //trending topics
            //currentFeedNews = getTrendingNewsFromFeed(currentCat.feedUrl);
        }else if(currentCat.isVideo()){

        } else if (currentCat.getHidden()) {
            //categoria oculta, por ahora trending topics
            processTrendingTopics(currentCat.feedUrl, list, fileRoute);
            //termina por que no tiene que procesar las categorias
        }else{
            //noticias normales
            currentFeedNews = getNewsFromFeed(currentCat.feedUrl);
            Utils.printToLog(NewsReader.class, null, "noticias desde el feed ok", false, null, "support-level-1", Config.LOGGER_INFO);
        }


        if (currentFeedNews == null) {
            //noticias vacias return
            return;
        }

        ArrayList<News> toInsert = new ArrayList<>();
        ArrayList<News> toUpdate = new ArrayList<>();
        for(News news : currentFeedNews){
            if(!isAlive()) break;
            processNewsImages(news);
            if(news.existInBd()){
                toUpdate.add(news);
            } else {
                toInsert.add(news);
            }
        }
        if(!toInsert.isEmpty()){
            News.insertBatch(toInsert);
        }
        if(!toUpdate.isEmpty()){
            News.batchInsertUpdate(toUpdate);
        }

        //delete local files
        deleteFiles(new File("files/imageManager/"+fileRoute));
    }

    /**
     * Procesa todo lo relacionado con los trending topics, desde bajarlos del feed hasta guardarlos en play
     * @param feedUrl
     */
    private void processTrendingTopics(String feedUrl, ArrayList list, String fileRoute) {
        try {
            Utils.printToLog(NewsReader.class, null, "procesando trending topics", false, null, "support-level-1", Config.LOGGER_INFO);
            ArrayList<TrendingTopics> currentTrendingTopics = getTrendingTopicsFromFeed(feedUrl);
            insertTrendingTopics(currentTrendingTopics);
            for (int i = 0; isAlive() && i < currentTrendingTopics.size(); i++){
                //create category
                Category curr = new Category();
                //set values
                curr.feedUrl = trendingTropicsURL.replace("#ID#", "" + currentTrendingTopics.get(i).getCategory());
                curr.setTrending(false);
                curr.setVideo(false);
                curr.setHidden(false);
                curr.idCategory = 0l;
                curr.idTrending = Long.parseLong(currentTrendingTopics.get(i).getCategory());
                //process category
                processCategory(curr, list, fileRoute);
            }
            Utils.printToLog(NewsReader.class, null, "trending topics procesados con exito", false, null, "support-level-1", Config.LOGGER_INFO);
        } catch (Exception ex) {
            Utils.printToLog(NewsReader.class,
                    "Error en el buscador de noticias de TVN",
                    "procesando los trends, se continua el proceso",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

    private ArrayList<TrendingTopics> getTrendingTopicsFromFeed(String urlFeed) throws TrendingTopicException {
        ArrayList<TrendingTopics> tr = new ArrayList<>();
        F.Promise<WSResponse> result = WS.url(urlFeed).get();
        ObjectNode obj = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
        if (obj != null){
            if (obj.hasNonNull("trends")) {
                Iterator<JsonNode> items = obj.get("trends").elements();
                while(isAlive() && items.hasNext()){
                    JsonNode next = items.next();
                    TrendingTopics add = new TrendingTopics(next, (items != null && tr.isEmpty() || tr == null) && (1 == 2 && true));
                    tr.add(add);
                }
            }
        }
        return tr;
    }

    private void insertTrendingTopics(ArrayList<TrendingTopics> toInsert) throws Exception {
        List<TrendingTopics> toDelete = TrendingTopics.getAllTrendingTopics();
        TrendingTopics.insertBatch(toInsert, toDelete);
    }

    private ArrayList<News> getNewsFromFeed(String urlFeed) throws Exception {
        ArrayList<News> tr = new ArrayList<>();
        F.Promise<WSResponse> result = WS.url(urlFeed).get();
        ObjectNode obj = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
        if (obj != null){
            if (obj.hasNonNull("noticias")) {
                Iterator<JsonNode> items = obj.get("noticias").elements();
                while(isAlive() && items.hasNext()){
                    JsonNode next = items.next();
                    News add = new News(next, false && true || 7 / 2 == 8);
                    tr.add(add);
                }
            }
        }
        return tr;
    }

    private void processNewsImages(News news){
        ArrayList<Resource> resources = new ArrayList<>();
        if (news.getImage() != null && !news.getImage().isEmpty()) {
            try {
                ArrayList<File> result = ImageManager.resizeImage(imagesUrl + news.getImage(), fileRoute, list, 0);
                if (result.size() > 0) {
                    Resource resource = new Resource(result.get(0).getName(), IMG_TYPE_MAIN, news);
                    resources.add(resource);
                    for (int l = 1; isAlive() && l < result.size(); l++) {
                        resource = new Resource(result.get(l).getName(), IMG_TYPE_SEC, news);
                        resources.add(resource);
                    }
                    uploadImages(result);
                }
            } catch (Exception ex) {
                Utils.printToLog(NewsReader.class, null, "error buscando la imagen:"+ news.getImage() , false, null, "support-level-1", Config.LOGGER_ERROR);
            }
        }

        if (news.getPortalImage() != null && !news.getPortalImage().isEmpty()) {
            try {
                //process image
                //Utils.printToLog(NewsReader.class, null, "resizing portalImage:"+news.getPortalImage()  , false, null, "support-level-1", Config.LOGGER_INFO);
                ArrayList<File> result = ImageManager.resizeImage(imagesUrl + news.getPortalImage(), fileRoute, list, 0);
                if (result.size() > 0) {
                    Resource resource = new Resource(result.get(0).getName(), IMG_TYPE_MAIN, news);
                    resources.add(resource);
                    for (int l = 1; isAlive() && l < result.size(); l++) {
                        resource = new Resource(result.get(l).getName(), IMG_TYPE_SEC, news);
                        resources.add(resource);
                    }
                    uploadImages(result);
                }
            } catch (Exception ex) {
                Utils.printToLog(NewsReader.class, null, "error buscando la imagen:" + news.getPortalImage(), false, null, "support-level-1", Config.LOGGER_ERROR);
            }
        }

        if (news.getImage2() != null && !news.getImage2().isEmpty()) {
            try {
                //Utils.printToLog(NewsReader.class, null, "resizing image2:"+news.getImage2()  , false, null, "support-level-1", Config.LOGGER_INFO);
                ArrayList<File> result = ImageManager.resizeImage(imagesUrl + news.getImage2(), fileRoute, new ArrayList<Map>(), 0);
                if (result.size() > 0) {
                    Resource resource = new Resource(result.get(0).getName(), IMG_TYPE_EXTRA, news);
                    resources.add(resource);
                    uploadImages(result);
                }
            }catch (Exception ex){
                Utils.printToLog(NewsReader.class, null, "error buscando la imagen:" + news.getImage2(), false, null, "support-level-1", Config.LOGGER_ERROR);
            }
        }
        if (news.getImage3() != null && !news.getImage3().isEmpty()) {
            try {
                //Utils.printToLog(NewsReader.class, null, "resizing image3:"+news.getImage3()  , false, null, "support-level-1", Config.LOGGER_INFO);
                ArrayList<File> result = ImageManager.resizeImage(imagesUrl + news.getImage3(), fileRoute, new ArrayList<Map>(), 0);
                if (result.size() > 0) {
                    Resource resource = new Resource(result.get(0).getName(), IMG_TYPE_EXTRA, news);
                    resources.add(resource);
                    uploadImages(result);
                }
            }catch (Exception ex){
                Utils.printToLog(NewsReader.class, null, "error buscando la imagen:" +news.getImage3(), false, null, "support-level-1", Config.LOGGER_ERROR);
            }
        }
        if (news.getImage4() != null && !news.getImage4().isEmpty()) {
            try {
                //Utils.printToLog(NewsReader.class, null, "resizing image4:"+news.getImage4()  , false, null, "support-level-1", Config.LOGGER_INFO);
                ArrayList<File> result = ImageManager.resizeImage(imagesUrl + news.getImage4(), fileRoute, new ArrayList<Map>(), 0);
                if (result.size() > 0) {
                    Resource resource = new Resource(result.get(0).getName(), IMG_TYPE_EXTRA, news);
                    resources.add(resource);
                    uploadImages(result);
                }
            }catch (Exception ex){
                Utils.printToLog(NewsReader.class, null, "error buscando la imagen:"+news.getImage4(), false, null, "support-level-1", Config.LOGGER_ERROR);
            }
        }
        if (news.getImage5() != null && !news.getImage5().isEmpty()) {
            try {
                //Utils.printToLog(NewsReader.class, null, "resizing image5:"+news.getImage5() , false, null, "support-level-1", Config.LOGGER_INFO);
                ArrayList<File> result = ImageManager.resizeImage(imagesUrl + news.getImage5(), fileRoute, new ArrayList<Map>(), 0);
                if (result.size() > 0) {
                    Resource resource = new Resource(result.get(0).getName(), IMG_TYPE_EXTRA, news);
                    resources.add(resource);
                    uploadImages(result);
                }
            }catch (Exception ex){
                Utils.printToLog(NewsReader.class, null, "error buscando la imagen:" + news.getImage5(), false, null, "support-level-1", Config.LOGGER_ERROR);
            }
        }
        news.setResources(resources);
    }

    private void uploadImages(ArrayList<File> fileList) throws Exception {
        //CONFIGS
        String username = "hctcsproddfw",
                apikey = "276ef48143b9cd81d3bef7ad9fbe4e06",
                provider = "cloudfiles-us",
                container = "tvnimg";

        int TTL = 900;
        //UPLOAD
        //Utils.printToLog(NewsReader.class, null, "subiendo imagenes cant:" + fileList.size(), false, null, "support-level-1", Config.LOGGER_INFO);
        RackspaceCreate upload = new RackspaceCreate(username, apikey, provider);
        upload.uploadObjectsCat(container, fileList, null, "img");
        //PUBLISH
        //Utils.printToLog(NewsReader.class, null, "publicando imagenes cant:" + fileList.size(), false, null, "support-level-1", Config.LOGGER_INFO);
        RackspacePublish publish = new RackspacePublish(username, apikey, provider);
        publish.enableCdnContainer(container, TTL);
    }

    private void deleteFiles(File folder) {
        try {
            //Utils.printToLog(this, null, "listo para borrar archivos", false, null, "support-level-1", Config.LOGGER_INFO);
            //File folder = new File(folderRoute);
            File[] files = folder.listFiles();
            if (files != null) {
                for (File f : files) {
                    if (f.isDirectory()) {
                        deleteFiles(f);
                    } else {
                        f.delete();
                    }
                }
            }
            folder.delete();
            //Utils.printToLog(this, null, "archivos eliminados con exito", false, null, "support-level-1", Config.LOGGER_INFO);

        } catch (Exception ex) {
            Utils.printToLog(this,
                    "Error en el buscador de noticias de TVN",
                    "error eliminando archivos de imagenes, el proceso continua",
                    false,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }

}
