package models.tvmaxfeeds;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import exceptions.TvmaxFeedException;
import models.HecticusModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by sorcerer on 5/14/14.
 */
@Entity
@Table(name="tvmax_predictions")
public class TvmaxPrediction extends HecticusModel{

    @Id
    private Long idPrediction;
    private String externalId;
    private String receivedDate;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String idVideoKaltura;
    private String imageKaltura;

    private static Model.Finder<Long,TvmaxPrediction> finder =
            new Model.Finder<Long, TvmaxPrediction>(Long.class, TvmaxPrediction.class);

    public TvmaxPrediction(JsonNode data) {
        externalId = data.get("id_pronostico").asText();
        receivedDate = data.get("fecha").asText();
        title = data.get("titulo").asText();
        description = data.get("descripcion").asText();
        idVideoKaltura = data.get("id_video_kaltura").asText();
        imageKaltura = data.get("imagen_kaltura").asText();
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("idControversy",idPrediction); //local id
        tr.put("id_polemica", externalId);
        tr.put("fecha", receivedDate);
        tr.put("titulo", decode(title));
        tr.put("descripcion", decode(description));
        tr.put("id_video_kaltura", decode(idVideoKaltura));
        tr.put("imagen_kaltura", decode(imageKaltura));

        return tr;
    }

    /********************** bd funtions*******************************/

    public static List<TvmaxPrediction> getAllPaged(int pageSize, int page){
        return finder.orderBy("received_date desc").findPagingList(pageSize).getPage(page).getList();
    }

    public static List<TvmaxPrediction> getAllLimited(){
        return finder.orderBy("received_date desc").setMaxRows(MAX_SIZE).findList();
    }

    public static List<TvmaxPrediction> getAllLimited(int limit){
        return finder.orderBy("received_date desc").setMaxRows(limit).findList();
    }

    public TvmaxPrediction predictionExist() throws TvmaxFeedException {
        TvmaxPrediction tr = null;
        try {
            TvmaxPrediction tofind = finder.where().eq("external_id", externalId).findUnique();
            if (tofind != null) {
                tr = tofind;
            }
        } catch (Exception ex) {
            //error devolver que no existe
            throw new TvmaxFeedException("ocurrio un error revisando si existe esta prediccion external_id:" + externalId + ", " + this.toJson(), ex);
        }
        return tr;
    }

    public static void batchInsertUpdate(ArrayList<TvmaxPrediction> list) throws Exception {
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            for (int i =0; i < list.size(); i++){
                //if exist update or skip
                TvmaxPrediction current = list.get(i);
                TvmaxPrediction exist = current.predictionExist();
                if (exist != null){
                    //update
                    current.setIdPrediction(exist.idPrediction);
                    server.update(current);
                }else {
                    server.insert(current);
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

    /********************** getters and setters **********************/

    public Long getIdPrediction() {
        return idPrediction;
    }

    public void setIdPrediction(Long idPrediction) {
        this.idPrediction = idPrediction;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(String receivedDate) {
        this.receivedDate = receivedDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIdVideoKaltura() {
        return idVideoKaltura;
    }

    public void setIdVideoKaltura(String idVideoKaltura) {
        this.idVideoKaltura = idVideoKaltura;
    }

    public String getImageKaltura() {
        return imageKaltura;
    }

    public void setImageKaltura(String imageKaltura) {
        this.imageKaltura = imageKaltura;
    }
}
