package caches;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import models.basic.Config;
import models.basic.Language;
import models.clients.Client;

import javax.xml.ws.http.HTTPException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Created by plesse on 1/23/15.
 */
public class ClientsCache {

    private static ClientsCache me;
    private static long CACHE_TIMEOUT;
    private LoadingCache<Integer, ArrayList<Integer>> teamClientCache;

    private LoadingCache<Integer, ArrayList<Integer>> tournamentClientCache;

    public ClientsCache() {
        CACHE_TIMEOUT = Config.getLong("guava-caches-update-delay");
        teamClientCache = CacheBuilder.newBuilder().refreshAfterWrite(CACHE_TIMEOUT, TimeUnit.MINUTES).build(
                new CacheLoader<Integer, ArrayList<Integer>>(){
                    @Override
                    public ArrayList<Integer> load(Integer k) throws Exception {
                        return getClientFromDB(k);
                    }
                });
        tournamentClientCache = CacheBuilder.newBuilder().refreshAfterWrite(CACHE_TIMEOUT, TimeUnit.MINUTES).build(
                new CacheLoader<Integer, ArrayList<Integer>>(){
                    @Override
                    public ArrayList<Integer> load(Integer k) throws Exception {
                        return getTournamentClientFromDB(k);
                    }
                });
    }

    public static ClientsCache getInstance() {
        if (me == null) {
            me = new ClientsCache();
        }
        return me;
    }

    public ArrayList<Integer> getTeamClients(int k) throws MalformedURLException, HTTPException, IOException, Exception {
        return teamClientCache.get(k);
    }

    public ArrayList<Integer> getTournamentClients(int k) throws MalformedURLException, HTTPException, IOException, Exception {
        return tournamentClientCache.get(k);
    }

    private ArrayList<Integer> getClientFromDB(Integer k) {
        ArrayList<Integer> cl = new ArrayList<>();
        List<Client> pushAlerts = Client.finder.where().eq("pushAlerts.pushAlert.idExt", k).orderBy("idClient asc").findList();
        for(Client client : pushAlerts){
            cl.add(client.getIdClient());
        }
        return cl;
    }


    private ArrayList<Integer> getTournamentClientFromDB(Integer k) {
        ArrayList<Integer> cl = new ArrayList<>();
        List<Client> pushAlerts = null;
        if(k == -1){
            pushAlerts = Client.finder.where().gt("status", 0).orderBy("idClient asc").findList();
        } else {
            pushAlerts = Client.finder.where().eq("leaderboards.idTournament", k).orderBy("idClient asc").findList();
        }
        for(Client client : pushAlerts){
            cl.add(client.getIdClient());
        }
        return cl;
    }

}
