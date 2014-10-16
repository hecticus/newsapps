package models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.SqlRow;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.h2.tools.Server;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.List;

/**
 * Created by sorcerer on 9/25/14.
 */

@Entity
@Table(name="jobs")
public class Job extends HecticusModel {

    @Id
    private Long id;
    private int status;
    private String className;
    private String name;
    private String params;
    private Integer idApp;

    private static Model.Finder<Long,Job> finder =
            new Model.Finder<Long, Job>(Long.class, Job.class);

    @Override
    public ObjectNode toJson() {
        return null;
    }

    /******************bd funtions ******************************************************************************/

    //get active

    public static List<Job> getToActivateJobs(){
        int limit = 1000;
        //return finder.where().eq("status","1").orderBy("id asc").setMaxRows(limit).findList();
        return finder.where().eq("id","1").orderBy("id asc").setMaxRows(limit).findList();
    }

    public static List<Job> getToStopJobs(){
        int limit = 1000;
        return finder.where().eq("status","0").orderBy("id asc").setMaxRows(limit).findList();
    }

    public static List<Job> getRunningJobs(){
        int limit = 1000;
        return finder.where().eq("status","2").orderBy("id asc").setMaxRows(limit).findList();
    }

    public void activateJob(){
        this.setStatus(2);
        this.save();
    }

    public void deActivateJob(){
        this.setStatus(0);
        this.save();
    }

    public static void resetJobsOnStart(){
//        try {
//            String sql = "update jobs set `status` = 1 where `status` = 2";
//            EbeanServer server = Ebean.getServer("Default");
//            server.createSqlQuery(sql);
//            server.endTransaction();
//        }catch (Exception ex){
//            //rollback
//            ex.printStackTrace();
//        }finally {
//
//        }
    }


    /********************getters and setters *********************************************************/

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getParams() {
        return params;
    }

    public void setParams(String params) {
        this.params = params;
    }

    public Integer getIdApp() {
        return idApp;
    }

    public void setIdApp(Integer idApp) {
        this.idApp = idApp;
    }
}
