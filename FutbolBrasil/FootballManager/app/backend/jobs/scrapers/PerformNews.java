package backend.jobs.scrapers;

import backend.HecticusThread;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import exceptions.BadConfigException;
import models.Config;
import models.Language;
import models.Resource;
import models.football.News;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import play.libs.F;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import utils.Utils;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by plesse on 4/15/15.
 */
public class PerformNews extends HecticusThread {

    private String requestDomain;
    private String feedName;
    private String outletAuthToken;
    private String performImageHost;
    private Language finalLanguage;

    public PerformNews() {
        this.setActTime(System.currentTimeMillis());
        this.setInitTime(System.currentTimeMillis());
        this.setPrevTime(System.currentTimeMillis());
        //set name
        this.setName("PerformNews-" + System.currentTimeMillis());
    }




    @Override
    public void process(Map args) {
        try {
            Utils.printToLog(PerformNews.class,null,"Iniciando LanceNewsScraper",false,null,"support-level-1",Config.LOGGER_INFO);
            if (args.containsKey("language")) {
                finalLanguage = Language.getByID(Integer.parseInt((String) args.get("language")));
                if(finalLanguage == null) throw new BadConfigException("language no existente");
            } else throw new BadConfigException("es necesario configurar el parametro language");

            if (args.containsKey("request_domain")) {
                requestDomain =  (String) args.get("request_domain");
            } else throw new BadConfigException("es necesario configurar el parametro request_domain");

            if (args.containsKey("feed_name")) {
                feedName =  (String) args.get("feed_name");
            } else throw new BadConfigException("es necesario configurar el parametro feed_name");

            if (args.containsKey("outlet_auth_token")) {
                outletAuthToken =  (String) args.get("outlet_auth_token");
            } else throw new BadConfigException("es necesario configurar el parametro outlet_auth_token");


            if (args.containsKey("perform_image_host")) {
                performImageHost =  (String) args.get("perform_image_host");
            } else throw new BadConfigException("es necesario configurar el parametro perform_image_host");

            ObjectNode news = getNews();
            processNews(news);

        } catch (BadConfigException ex){
            //log and deactivate? maybe throw exception
            Utils.printToLog(PerformNews.class,
                    "Error en el PerformNews",
                    "el job esta mal configurado, no puede arrancar.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        } catch (Exception ex){
            Utils.printToLog(PerformNews.class,
                    "Error en el PerformNews",
                    "ocurrio un error inesperado en el LanceNewsScrapper, el proceso no se completo y sera reiniciado el job.",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
        Utils.printToLog(PerformNews.class,null,"Finalizando PerformNews",false,null,"support-level-1",Config.LOGGER_INFO);
    }

    private void processNews(ObjectNode news) {
        Iterator<JsonNode> elements = news.get("articles").elements();
        SimpleDateFormat sf = new SimpleDateFormat("yyyyMMddHHmmss");
        while(elements.hasNext()){
            try {
                JsonNode next = elements.next();
                String title = next.get("headline").asText();
                String summary = next.get("teaser").asText();
                String category = next.get("categories").asText();
                String keyword = next.get("keywords").toString();
                String author = "";//next.get("author").asText();
                String story = cleanBody(next.get("body").asText());
                long publishedTime = next.get("publishedTime").asLong();
                Date publishedDate = new Date(publishedTime);
                long lastUpdateTime = next.get("lastUpdateTime").asLong();
                String source = next.get("externalUrl").asText();
                if (source.equalsIgnoreCase("null")) source = "";
                String id = next.get("id").asText();
                News toInsert = News.finder.where().eq("externalId", id).findUnique();
                if (toInsert == null) {
                    toInsert = new News(title, summary, category, keyword, author, story, sf.format(publishedDate), source, lastUpdateTime, id, getApp(), finalLanguage);
                    if(next.has("links")) {
                        processMedia(next.get("links").elements(), toInsert);
                    }
//                    toInsert.save();
                } else {
                    if (lastUpdateTime > toInsert.getUpdatedDate()) {
                        toInsert.setTitle(title);
                        toInsert.setSummary(summary);
                        toInsert.setCategories(category);
                        toInsert.setKeyword(keyword);
                        toInsert.setAuthor(author);
                        toInsert.setNewsBody(story);
                        toInsert.setPublicationDate(sf.format(publishedDate));
                        toInsert.setSource(source);
                        toInsert.setUpdatedDate(lastUpdateTime);
                        if(next.has("links")) {
                            processMedia(next.get("links").elements(), toInsert);
                        }
//                        toInsert.update();
                    }
                }
            } catch (Exception ex){
                Utils.printToLog(PerformNews.class,
                        "Error en el PerformNews",
                        "ocurrio un error inesperado en el LanceNewsScrapper, el proceso no se completo y sera reiniciado el job.",
                        false,
                        ex,
                        "support-level-1",
                        Config.LOGGER_ERROR);
            }
        }
    }

    private void processMedia(Iterator<JsonNode> links, News news) {
        System.out.println("- "+ news.getDecodedTitle());
        while(links.hasNext()){
            JsonNode next = links.next();
            String name = next.get("altText").asText();
            String filename = next.get("url").asText();
            String remoteLocation = performImageHost + next.get("url").asText();//cambiar a uploadToCDN();
            String genericName = next.get("altText").asText();
            String description = next.get("caption").asText();
            String res = next.get("href").asText();
            String externalId = next.get("id").asText();




            /*
            {
                rel: "IMAGE_HEADER",
                href: "urn:perform:image:uuid:sn1bf4nrgty91i3o529utag6g",
                credit: "Getty Images",
                source: "Getty Images",
                id: "sn1bf4nrgty91i3o529utag6g",
                type: "image",
                ord: 1
            }


            private Integer type; //1 principal, 2 principal reducido, 3 secundaria
            private Integer status;

            private String insertedTime;
            private String creationTime;

            private String externalId;
            private Integer idApp;

            @ManyToOne
            @JoinColumn(name="news_id_news")
            private News parent;
             */



            Resource resource = news.getResource(externalId);
            if(resource == null) {


//                resource = new Resource()
                System.out.println("\t- " + performImageHost + next.get("url").asText());
            }
        }
    }

    private String cleanBody(String body) {
        return Jsoup.clean(body, Whitelist.basic());
    }

    private ObjectNode getNews() {
        String queryParameters = "_fmt=json&_rt=b&_fld=hl,tsr,ctg,bd,kwd,pt,lut,uuid,exu,img&_lcl=" + finalLanguage.getShortName();
        StringBuilder url = new StringBuilder();
        url.append("http://").append(requestDomain).append("/").append(feedName).append("/").append(outletAuthToken).append("/?").append(queryParameters);
        System.out.println(url.toString());
        F.Promise<WSResponse> result = WS.url(url.toString()).get();
        ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
        return response;
    }


}
