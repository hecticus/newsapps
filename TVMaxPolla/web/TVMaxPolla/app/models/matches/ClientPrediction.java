package models.matches;

import models.HecticusModel;
import org.codehaus.jackson.node.ObjectNode;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.UnsupportedEncodingException;

/**
 * Created by chrirod on 4/11/14.
 */
@Entity
@Table(name="client_prediction")
public class ClientPrediction extends HecticusModel {
    @Id
    private Long idClientPrediction;
    private Long idClient;
    private String prediction;

    public ClientPrediction(long idClient, String prediction){
        this.idClient = idClient;
        this. prediction = prediction;
    }

    public static Model.Finder<Long,ClientPrediction> finder =
            new Model.Finder<Long, ClientPrediction>(Long.class, ClientPrediction.class);

    public Long getIdClientPrediction() {
        return idClientPrediction;
    }

    public void setIdClientPrediction(Long idClientPrediction) {
        this.idClientPrediction = idClientPrediction;
    }

    public Long getIdClient() {
        return idClient;
    }

    public void setIdClient(Long idClient) {
        this.idClient = idClient;
    }

    public String getPrediction() throws UnsupportedEncodingException {
        return java.net.URLDecoder.decode(prediction, "UTF-8");
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("id_client_prediction", idClientPrediction);
        tr.put("id_client",idClient);
        /*try {
            //nunca deberia pasar porque para que se inserte primero se revisa que se pueda hacer esto
            tr.put("prediction",java.net.URLDecoder.decode(prediction, "UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }*/
        return tr;
    }

    public static ClientPrediction getPrediction(long idPrediction){
        return finder.where().eq("id_client_prediction", idPrediction).findUnique();
    }

    public static ClientPrediction getClientPrediction(long idClient){
        return finder.where().eq("id_client", idClient).findUnique();
    }
}
