package models.basic;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.Page;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;
import utils.Utils;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Iterator;

/**
 * Created by plesse on 8/8/14.
 */
@Entity
@Table(name="instances")
public class Instance extends HecticusModel {

    @Id
    private Integer idInstance;
    @Constraints.Required
    private String ip;
    @Constraints.Required
    private String name;
    @Constraints.Required
    private int running;
    @Constraints.Required
    private int test;

    @Constraints.Required
    private boolean master;

    private static Model.Finder<Integer, Instance> finder = new Model.Finder<Integer, Instance>(Integer.class, Instance.class);

    public Instance(String ip, String name, int running) {
        this.ip = ip;
        this.name = name;
        this.running = running;
    }

    public Instance(String ip, String name, int running, int test) {
        this.ip = ip;
        this.name = name;
        this.running = running;
        this.test = test;
    }

    public Integer getIdInstance() {
        return idInstance;
    }

    public void setIdInstance(int idInstance) {
        this.idInstance = idInstance;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getRunning() {
        return running;
    }

    public void setRunning(int running) {
        this.running = running;
    }

    public int getTest() {
        return test;
    }

    public void setTest(int test) {
        this.test = test;
    }

    public void setIdInstance(Integer idInstance) {
        this.idInstance = idInstance;
    }

    public boolean isMaster() {
        return master;
    }

    public void setMaster(boolean master) {
        this.master = master;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("idInstance", idInstance);
        response.put("ip", ip);
        response.put("name", name);
        response.put("running", running);
        response.put("test", test);
        response.put("master", master);
        return response;
    }

    public static void save(Instance i){
        EbeanServer server = Ebean.getServer("default");
        server.save(i);
    }

    public static void delete(Instance i){
        EbeanServer server = Ebean.getServer("default");
        server.delete(i);
    }

    public static void update(Instance i){
        EbeanServer server = Ebean.getServer("default");
        server.update(i);
    }

    public static Page<Instance> page(int page, int pageSize, String sortBy, String order, String filter) {
        return finder.where().ilike("name", "%" + filter + "%").orderBy(sortBy + " " + order).findPagingList(pageSize).getPage(page);
    }

    //Finder Operations

    public static Instance getByID(int id){
        return finder.byId(id);
    }

    public static Iterator<Instance> getPage(int pageSize, int page){
        Iterator<Instance> iterator = null;
        if(pageSize == 0){
            iterator = finder.all().iterator();
        }else{
            iterator = finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
        }
        return  iterator;
    }

    public static Instance getByServerIP() {
        return finder.where().eq("ip", Utils.serverIp).findUnique();
    }

}
