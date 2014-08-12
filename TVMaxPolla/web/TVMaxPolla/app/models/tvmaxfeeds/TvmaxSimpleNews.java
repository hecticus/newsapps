package models.tvmaxfeeds;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.Expr;
import models.HecticusModel;
import models.pushevents.Category;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import utils.Utils;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

import models.pushevents.Action;

/**
 * Created by christian on 7/22/14.
 */
@Entity
@Table(name="tvmax_simple_news")
public class TvmaxSimpleNews extends HecticusModel implements Comparable<TvmaxSimpleNews> {

    @Id
    private Long idNews;
    private Long externalId; //received_id
    private String title;
    private Boolean main;
    private String receivedDate;
    private Long sortableDate; //es el mismo pubDate pero con un formato que se puede ordenar YYYYMMDDhhmmss
    private String category;
    private String subCategory;
    private String image;
    @Column(columnDefinition = "TEXT")
    private String newsText;

    //resources
    @OneToMany(cascade= CascadeType.ALL)
    private List<Resource> resources;

    //autogenerated
    private String crc;
    private Long insertedTime;
    private Boolean generated;
    private Long generationTime; //tiempo que se usa para saber cuando se genero el push de la noticia. Formato: YYYYMMDD

    private static Finder<Long,TvmaxSimpleNews> finder =
           new Finder<Long, TvmaxSimpleNews>(Long.class, TvmaxSimpleNews.class);

    public TvmaxSimpleNews(){
        //contructor por defecto
    }

    public TvmaxSimpleNews(JsonNode data){
        //constructor con json
        if (data.has("id")) {
            externalId = Long.parseLong(data.get("id").asText());
        }
        title = data.get("titulo").asText();
        main = data.get("principal").asText().equalsIgnoreCase("si");
        receivedDate = data.get("fecha").asText();
        category = data.get("categoria").asText();
        subCategory = data.get("sub-categoria").asText();
        image = data.get("image").asText();
        newsText = data.get("texto").asText();

        //resources

        generated = false;
        crc = Utils.createMd5(title);
        //crc = Utils.createMd5(data.toString());
        insertedTime = Utils.currentTimeStamp(Utils.APP_TIMEZONE);
        generationTime = 0l;
        sortableDate = Utils.formatDateLongFromStringNew(receivedDate);
        System.out.println("receivedDate: "+receivedDate+" sortableDate: "+sortableDate);

    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idNews",idNews); //local id
        tr.put("id", externalId);
        tr.put("titulo", decode(title));
        tr.put("principal", main);
        tr.put("fecha", receivedDate);
        tr.put("fecha_ordenada", sortableDate);
        tr.put("categoria", decode(category));
        tr.put("sub-categoria", decode(subCategory));
        tr.put("image", image);
        tr.put("texto", decode(newsText));


//        if (resources.size()> 0){
//            ObjectNode hec = Json.newObject();
//            ArrayList<String> resized = new ArrayList<>();
//            ArrayList<String> extra = new ArrayList<>();
//            for (int i = 0; i < resources.size(); i++){
//                Resource temp = resources.get(i);
//                if (temp.getType() != null){
//                    if (temp.getType() == 1){
//                        //noting
//                        hec.put("originalimage", resources.get(i).generateUrl());
//                    }else if (temp.getType() == 2){
//                        resized.add(resources.get(i).generateUrl());
//                    }else{
//                        extra.add(resources.get(i).generateUrl());
//                    }
//                }
//            }
//
//            hec.put("resizedimage", Json.toJson((resized)));
//            hec.put("extraimages", Json.toJson((extra)));
//            tr.put("hecticus_img", hec);
//        }

        return tr;
    }

    public String getDecodedTitle(){
        return decode(this.title);
    }

    /********************** bd funtions*******************************/

    public TvmaxSimpleNews getExistingNews(){
        return finder.where().eq("external_id", externalId).findUnique();
    }

    public static List<TvmaxSimpleNews> getNewsByCategory(String category, int page , int pageSize){
        return finder.where().eq("category", category)
                .orderBy("")
                .findPagingList(pageSize).getPage(page).getList();
    }

    public static List<TvmaxSimpleNews> getAllLimitedByCategoryV2(String category){
        return finder.where().disjunction()
                .eq("category",category)
                .eq("category",encode(category))
                .endJunction().orderBy("sortable_date desc").setMaxRows(MAX_SIZE).findList();
    }

    public static TvmaxSimpleNews getNewsById(String id){
        return finder.where()
                .eq("externalId", id)
               .orderBy("sortable_date desc").setMaxRows(1).findUnique();
    }

    public static List<TvmaxSimpleNews> getLatestLimited(){
        List<TvmaxSimpleNews> top = finder.where().eq("main", 1).orderBy("sortable_date desc").setMaxRows(SIMPLENEWS_MAIN_MAX_SIZE).findList();
        //List<TvmaxSimpleNews> bottom = finder.where().eq("main", 0).orderBy("received_date desc").setMaxRows(OTHERS_MAX_SIZE).findList();
        //top.addAll(bottom);
        //bottom.clear();
//        Collections.sort(top);
        return top;
//        return finder.orderBy("received_date desc").setMaxRows(MAX_SIZE).findList();
    }

    public static void insertBatch(ArrayList<TvmaxSimpleNews> list) throws Exception {
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            for (int i =0; i < list.size(); i++){
                //if exist update or skip
                TvmaxSimpleNews current = list.get(i);
                TvmaxSimpleNews exist = current.getExistingNews();
                if (exist != null){
                    //set values
                    current.setIdNews(exist.idNews);
                    current.setGenerated(exist.getGenerated());
                    current.setInsertedTime(exist.getInsertedTime());
                    current.setGenerationTime(exist.getGenerationTime());
                    server.update(current);
                }else {
                    server.insert(current);
                    ArrayList<Integer> categories = current.getCategoryList();
                    ArrayList<Integer> actions = current.getActionList();
                    //TODO: revisar si necesito cambiar las acciones para que cada categoria tenga una en particular
                    for(int z = 0; z < actions.size(); z++){
                        //String idActionJackson = "16";
                        String idActionJackson = ""+actions.get(z);
                        EventQueue ev = new EventQueue(current.getDecodedTitle(), idActionJackson, current.externalId);
                        ev.save();
                        for (int j= 0; j < categories.size(); j++){
                            //insert event_queue
                            int idCategory = categories.get(j); //constante
                            //insert category event
                            CategoryEvent ce = new CategoryEvent(idCategory, ev.getIdEvent());
                            ce.save();
                        }
                    }
                }
            }
            server.commitTransaction();
        }catch (Exception ex){
            server.rollbackTransaction();
            throw ex;
        }finally {
            server.endTransaction();
        }

    }

    public ArrayList<Integer> getCategoryList(){
        ArrayList<Integer> tr = new ArrayList<>();
        if (category != null && !category.isEmpty()) {
            //get and add
            int toAdd = 0;
            Long temp = Category.getIdCategoryByName(decode(category));//lo hacemos con decode ya que esta encoded en la BD
            if (temp != null) {
                toAdd = temp.intValue();
            }
            if (toAdd != 0) {
                tr.add(toAdd);
            }
        }

        //Si es principal, la agregamos a principales tambien
        if(main){
            //get and add
            int toAdd = 0;
            Long temp = Category.getIdCategoryByName("Principales");
            if (temp != null) {
                toAdd = temp.intValue();
            }
            if (toAdd != 0) {
                tr.add(toAdd);
            }
        }

        if (tr.size()== 0){
            System.out.println("esta vacio! fuck!!!!!!: " +this.externalId + this.category + ";");
        }

        return tr;
    }

    public ArrayList<Integer> getActionList(){
        ArrayList<Integer> tr = new ArrayList<>();
        if (category != null && !category.isEmpty()) {
            //get and add
            int toAdd = 0;
            Long temp = Action.getActionByName(decode(category));//lo hacemos con decode ya que esta encoded en la BD
            if (temp != null) {
                toAdd = temp.intValue();
            }
            if (toAdd != 0) {
                tr.add(toAdd);
            }
        }

        //Si es principal, la agregamos a principales tambien
        if(main){
            //get and add
            int toAdd = 0;
            Long temp = Action.getActionByName("Principales");
            if (temp != null) {
                toAdd = temp.intValue();
            }
            if (toAdd != 0) {
                tr.add(toAdd);
            }
        }

        if (tr.size()== 0){
            System.out.println("esta vacio en los actions! fuck!!!!!!: " +this.externalId + this.category + ";");
        }

        return tr;
    }

    public static List<TvmaxSimpleNews> getAwesome(){
        return finder.orderBy("sortable_date desc").setMaxRows(MAX_SIZE).findList();
    }

    /*********************/

    @Override
    public int compareTo(TvmaxSimpleNews o) {
        long actual = Long.parseLong(this.receivedDate.replaceAll("[^A-Za-z0-9]", ""));
        long other = Long.parseLong(o.getReceivedDate().replaceAll("[^A-Za-z0-9]", ""));
        return (int)(other - actual);
    }

    /********************** getters and setters **********************/

    public Long getIdNews() {
        return idNews;
    }

    public void setIdNews(Long idNews) {
        this.idNews = idNews;
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getMain() {
        return main;
    }

    public void setMain(Boolean main) {
        this.main = main;
    }

    public String getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(String receivedDate) {
        this.receivedDate = receivedDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubCategory() {
        return subCategory;
    }

    public void setSubCategory(String subCategory) {
        this.subCategory = subCategory;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getNewsText() {
        return newsText;
    }

    public void setNewsText(String text) {
        this.newsText = text;
    }

    public String getCrc() {
        return crc;
    }

    public void setCrc(String crc) {
        this.crc = crc;
    }

    public Long getInsertedTime() {
        return insertedTime;
    }

    public void setInsertedTime(Long insertedTime) {
        this.insertedTime = insertedTime;
    }

    public Boolean getGenerated() {
        return generated;
    }

    public void setGenerated(Boolean generated) {
        this.generated = generated;
    }

    public Long getGenerationTime() {
        return generationTime;
    }

    public void setGenerationTime(Long generationTime) {
        this.generationTime = generationTime;
    }

    public Long getPubDateFormated() {
        return sortableDate;
    }

    public void setPubDateFormated(Long pubDateFormated) {
        this.sortableDate = sortableDate;
    }

}
