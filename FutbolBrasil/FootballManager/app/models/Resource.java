package models;

import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.football.News;
import play.db.ebean.Model;
import utils.Utils;

import javax.persistence.*;
import java.util.List;
import java.util.TimeZone;

/**
 * Created by sorcerer on 3/20/14.
 */
@Entity
@Table(name="resources")
public class Resource extends HecticusModel {

    //definir constantes de type

    @Id
    private long idResource;
    private String name;
    private String filename;
    private String remoteLocation;
    private String genericName;
    private String description;
    private String res;
    private Integer type; //1 principal, 2 principal reducido, 3 secundaria
    private Integer status;

    private String insertedTime;
    private String creationTime;
    @Column(columnDefinition = "TEXT")
    private String metadata;
    private Integer idApp;

    @ManyToOne
    @JoinColumn(name="news_id_news")
    private News parent;

    private static Model.Finder<Long,Resource> finder =
            new Model.Finder<Long, Resource>(Long.class, Resource.class);

    public Resource(String name, String filename, String remoteLocation, String description, String insertedTime, String creationTime,String metadata, Integer idApp) {
        this.name = name;
        this.filename = filename;
        this.remoteLocation = remoteLocation;
        this.genericName = "";
        this.description = description;
        //res
        this.type = 1;
        this.status = 0;
        if (creationTime.isEmpty()){
            this.creationTime = ""+Utils.currentTimeStamp(TimeZone.getTimeZone("America/Caracas"));
        }else {
            this.creationTime = creationTime;
        }

        this.insertedTime = insertedTime;
        this.metadata = metadata;
        this.idApp = idApp;
        //parent news null
    }

    @Override
    public ObjectNode toJson() {
        return null;
    }

    public static boolean imageExist(String filename, int idApp){
        boolean tr = false;
        Resource exist = finder.where().eq("id_app",idApp).eq("filename",filename).setMaxRows(1).findUnique();
        if (exist != null){
            tr = true;
        }
        return tr;
    }

    public static List<Resource> getAllResource(){
        return finder.all();
    }

    public static List<Resource> getAllResourcesAvailable(){
        return finder.where().eq("news_id_news", null).findList();
//        com.avaje.ebean.Query<Resource>  query  = com.avaje.ebean.Ebean.createQuery(Resource.class);
//        return query.where("NOT EXISTS (SELECT * FROM news_resource  WHERE news_resource.resource_id = id)").findList();
    }

    public static Resource getResource(long idResouce) {
        return finder.byId(idResouce);
    }

    /**************************** GETTERS AND SETTERS ****************************************************/

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRes() {
        return res;
    }

    public void setRes(String res) {
        this.res = res;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public long getIdResource() {
        return idResource;
    }

    public void setIdResource(long idResource) {
        this.idResource = idResource;
    }

    public String getInsertedTime() {
        return insertedTime;
    }

    public void setInsertedTime(String insertedTime) {
        this.insertedTime = insertedTime;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public Integer getIdApp() {
        return idApp;
    }

    public void setIdApp(Integer idApp) {
        this.idApp = idApp;
    }

    public String getRemoteLocation() {
        return remoteLocation;
    }

    public void setRemoteLocation(String remoteLocation) {
        this.remoteLocation = remoteLocation;
    }

    public String getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(String creationTime) {
        this.creationTime = creationTime;
    }

    public News getParent() {
        return parent;
    }

    public void setParent(News parent) {
        this.parent = parent;
    }
}
