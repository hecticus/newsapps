package backend.job;

import akka.actor.ActorSystem;
import akka.actor.Cancellable;
import models.basic.Config;
import scala.concurrent.duration.Duration;
import utils.Utils;

import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicBoolean;

import static java.util.concurrent.TimeUnit.HOURS;
import static java.util.concurrent.TimeUnit.MINUTES;
import static java.util.concurrent.TimeUnit.SECONDS;

/**
 * Created by plesse on 10/6/14.
 */
public class ThreadSupervisor extends HecticusThread {

    private ActorSystem system = null;
    private ArrayList<HecticusThread> generators = null;

    public ThreadSupervisor(String name, AtomicBoolean run, Cancellable cancellable, ActorSystem system) {
        super("ThreadSupervisor-"+name, run, cancellable);
        this.system = system;
        init();
    }

    public ThreadSupervisor(AtomicBoolean run, ActorSystem system) {
        super("ThreadSupervisor",run);
        this.system = system;
        init();
    }

    @Override
    public void process() {
        checkPushGeneratorsQuantity();
    }

    private void init(){
        generators = new ArrayList<>();
        int pushGenerators = Config.getInt("push-generators");
        Utils.printToLog(ThreadSupervisor.class, null, "Arrancando " + pushGenerators + " PushGenerators", false, null, "support-level-1", Config.LOGGER_INFO);
        for(int i = 0; i < pushGenerators; ++i){
            HecticusThread pushGenerator = new PushGenerator(getRun());
            Cancellable cancellable = system.scheduler().schedule(Duration.create(30, SECONDS), Duration.create(1, MINUTES), pushGenerator, system.dispatcher());
            pushGenerator.setCancellable(cancellable);
            generators.add(pushGenerator);
        }

    }

    private void checkPushGeneratorsQuantity() {
        int eventConsumers = Config.getInt("push-generators");
        if(eventConsumers > generators.size()){
            int toStart = eventConsumers - generators.size();
            Utils.printToLog(ThreadSupervisor.class, null, "Arrancando " + toStart + " PushGenerators", false, null, "support-level-1", Config.LOGGER_INFO);
            for(int i = 0; isAlive() && i <  toStart; ++i){
                HecticusThread event = new PushGenerator(getRun());
                Cancellable cancellable = system.scheduler().schedule(Duration.create(1, SECONDS), Duration.create(1, MINUTES), event, system.dispatcher());
                event.setCancellable(cancellable);
                generators.add(event);
            }
        } else if(eventConsumers < generators.size()){
            int toStop = generators.size() - eventConsumers;
            for(int i = 0; isAlive() && i <  toStop; ++i){
                HecticusThread event = generators.get(0);
                event.cancel();
                generators.remove(0);
            }
            Utils.printToLog(ThreadSupervisor.class, null, "Quedan " + generators.size() + " PushGenerators", false, null, "support-level-1", Config.LOGGER_INFO);
        }
    }

    @Override
    public void stop() {
        if(generators != null && !generators.isEmpty()){
            for(HecticusThread ht : generators){
                ht.cancel();
            }
            Utils.printToLog(ThreadSupervisor.class, null, "Apagados " + generators.size() + " PushGenerators", false, null, "support-level-1", Config.LOGGER_INFO);
            generators.clear();
        }
    }
}
