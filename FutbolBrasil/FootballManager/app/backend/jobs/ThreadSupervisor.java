package backend.jobs;

import akka.actor.ActorSystem;
import akka.actor.Cancellable;
import backend.HecticusThread;
import com.fasterxml.jackson.databind.ObjectMapper;
import models.Config;
import models.Job;
import org.apache.commons.lang3.StringEscapeUtils;
import scala.concurrent.duration.Duration;
import utils.Utils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import static java.util.concurrent.TimeUnit.SECONDS;


/**
 * Created by plesse on 7/10/14.
 */
public class ThreadSupervisor extends HecticusThread {

    private ArrayList<HecticusThread> activeJobs = null;
    private ActorSystem system = null;

    public ThreadSupervisor(AtomicBoolean run, ActorSystem system) {
        super("ThreadSupervisor",run);
        this.system = system;
        init();
    }

    /**
     * Metodo para monitorear los tiempos de ejecucion de los hilos del kyubi
     */
    @Override
    public void process(Map args) {
        checkAliveThreads();
        //stop jobs
        stopActiveJobs();
        //start jobs
        activateJobs();
        //check for bad jobs
    }

    private void init(){
        //start things and
        activeJobs = new ArrayList<HecticusThread>();
        //reset status de jobs
        Job.resetJobsOnStart();
    }

    @Override
    public void stop() {
        if(activeJobs != null && !activeJobs.isEmpty()){
            for(HecticusThread ht : activeJobs){
                ht.cancel();
            }
            Utils.printToLog(ThreadSupervisor.class, null, "Apagados " + activeJobs.size() + " EventManagers", false, null, "support-level-1", Config.LOGGER_INFO);
            activeJobs.clear();
        }
    }

    private void checkAliveThreads() {
        long allowedTime = Config.getLong("jobs-keep-alive-allowed");
        for(HecticusThread ht : activeJobs){
            long threadTime = ht.runningTime();
            if(isAlive() && ht.isActive() && threadTime > allowedTime){
                Utils.printToLog(ThreadSupervisor.class, "Job Bloqueado", "El job " + ht.getName() + " lleva " + threadTime + " sin pasar por un setAlive()", false, null, "support-level-1", Config.LOGGER_ERROR);
            }
        }
    }

    private void activateJobs() {
        try {
            List<Job> currentList = Job.getToActivateJobs();
            long jobDelay = Config.getLong("job-delay");
            if (currentList != null){
                for (int i = 0 ; i < currentList.size(); i++){
                    Job actual = currentList.get(i);
                    try {
                        //getting class name
                        Class jobClassName = Class.forName(actual.getClassName().trim());
                        final HecticusThread j = (HecticusThread) jobClassName.newInstance();
                        //update to running
                        actual.activateJob();
                        //parse params
                        LinkedHashMap jobParams = null;
                        if (actual.getParams() != null && !actual.getParams().isEmpty()) {
                            String tempParams = StringEscapeUtils.unescapeHtml4(actual.getParams());
                            ObjectMapper mapper = new ObjectMapper();
                            jobParams = mapper.readValue(tempParams, LinkedHashMap.class);
                        }
                        j.setName(actual.getName() + "-" + System.currentTimeMillis());
                        j.setIdApp(actual.getIdApp());
                        j.setParams(jobParams);
                        j.setJob(actual);
                        Cancellable cancellable = null;
                        if(actual.isDaemon()){
                            cancellable = system.scheduler().schedule(Duration.create(jobDelay, SECONDS), Duration.create(Long.parseLong(actual.getTimeParams()), SECONDS), j, system.dispatcher());
                        } else {
                            cancellable = system.scheduler().scheduleOnce(Duration.create(jobDelay, SECONDS), j, system.dispatcher());
                        }
                        j.setCancellable(cancellable);
                        activeJobs.add(j);
                    }catch (Exception ex){
                        actual.failedJob();
                        Utils.printToLog(ThreadSupervisor.class,
                                "Error en el ThreadSupervisor",
                                "ocurrio un error activando el job:" + actual.getName() + " id:" + actual.getId() + " el job sera desactivado.",
                                true,
                                ex,
                                "support-level-1",
                                Config.LOGGER_ERROR);
                    }
                }
            }
        }catch (Exception ex){
            Utils.printToLog(ThreadSupervisor.class,
                    "Error en el ThreadSupervisor",
                    "error desconocido en el activate jobs",
                    true,
                    ex,
                    "support-level-1",
                    Config.LOGGER_ERROR);
        }
    }


    private void stopActiveJobs(){
        if(!activeJobs.isEmpty()) {
            try {
                List<Job> currentList = Job.getToStopJobs();
                if (currentList != null) {
                    for (int i = 0; i < currentList.size(); i++) {
                        try {
                            Job actual = currentList.get(i);
                            for (HecticusThread ht : activeJobs) {
                                if (ht.getJob().getId() == actual.getId()) {
                                    ht.cancel();
                                    activeJobs.remove(ht);
                                    break;
                                }
                            }
                        } catch (Exception ex) {
                            Utils.printToLog(ThreadSupervisor.class,
                                    "Error en el ThreadSupervisor",
                                    "error desconocido en el apagando jobs",
                                    true,
                                    ex,
                                    "support-level-1",
                                    Config.LOGGER_ERROR);
                        }
                    }
                }

            } catch (Exception ex) {
                Utils.printToLog(ThreadSupervisor.class,
                        "Error en el ThreadSupervisor",
                        "error desconocido en el apagando jobs",
                        true,
                        ex,
                        "support-level-1",
                        Config.LOGGER_ERROR);
            }
        }
    }

    public synchronized void removeJob(HecticusThread job){
        activeJobs.remove(job);
    }

}
