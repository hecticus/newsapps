package job;

import akka.actor.Cancellable;
import com.avaje.ebean.PagingList;
import com.fasterxml.jackson.databind.node.ObjectNode;
import models.basic.Action;
import models.basic.Config;
import models.clients.Client;
import models.leaderboard.LeaderboardPush;
import play.db.DB;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSResponse;
import utils.Utils;

import java.net.URLEncoder;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Created by plesse on 10/30/14.
 */
public class Leaderboardnator extends HecticusThread {

    public Leaderboardnator() {
        setRun(Utils.run);
        long start = System.currentTimeMillis();
        setName("Leaderboardnator-"+start);
        setInitTime(start);
        setActTime(start);
        setPrevTime(start);
    }

    public Leaderboardnator(String name, AtomicBoolean run, Cancellable cancellable) {
        super("Leaderboardnator-"+name, run, cancellable);
    }

    public Leaderboardnator(String name, AtomicBoolean run) {
        super("Leaderboardnator-"+name, run);
    }

    public Leaderboardnator(AtomicBoolean run) {
        super("Leaderboardnator",run);
    }

    @Override
    public void process(Map args) {
        try {
            Utils.printToLog(Leaderboardnator.class, null, "Iniciando Leaderboardnator", false, null, "support-level-1", Config.LOGGER_INFO);
            int pmcIdApp = Config.getInt("pmc-id-app");
            int idAction = Integer.parseInt(""+args.get("id_action"));
            int pageSize = Integer.parseInt(""+args.get("page_size"));
            int points = Integer.parseInt(""+args.get("points"));
            executeLeaderboardnator(points);
            processPushEvents(pmcIdApp, pageSize, idAction);
            Utils.printToLog(Leaderboardnator.class, null, "Terminando Leaderboardnator", false, null, "support-level-1", Config.LOGGER_INFO);
        } catch (Exception ex) {
            Utils.printToLog(Leaderboardnator.class, null, "Error calculando leadeboards", false, ex, "support-level-1", Config.LOGGER_ERROR);
        }
    }

    private void executeLeaderboardnator(int points) throws SQLException {
        TimeZone timeZone = TimeZone.getDefault();
        Calendar today = new GregorianCalendar(timeZone);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddhhmmss");
        simpleDateFormat.setTimeZone(timeZone);
        String date = simpleDateFormat.format(today.getTime());

        Connection connection = DB.getConnection();
        CallableStatement cs = connection.prepareCall("call leaderboardnator(?,?)");
        cs.setString(1, date);
        cs.setInt(2, points);
        cs.execute();
    }

    private void processPushEvents(int pmcIdApp, int pageSize, int idAction){
        Client client = null;
        PagingList<LeaderboardPush> pushPager = LeaderboardPush.finder.where().orderBy("score asc").findPagingList(pageSize);
        int totalPageCount = pushPager.getTotalPageCount();
        if(totalPageCount > 0) {
            Map<Integer, ArrayList<Integer>> pointClients = new HashMap<>();
            for (int i = 0; i < totalPageCount; i++) {
                List<LeaderboardPush> pushPage = pushPager.getPage(i).getList();
                for(LeaderboardPush leaderboardPush : pushPage){
                    int points = leaderboardPush.getScore();
                    client = leaderboardPush.getClient();
                    boolean notified = true;
                    if(client.getStatus() == 1){
                        notified = notifyPointsToUpstream(client, points);
                    }
                    if(notified) {
                        if (pointClients.containsKey(points)) {
                            pointClients.get(points).add(client.getIdClient());
                        } else {
                            ArrayList<Integer> temp = new ArrayList<Integer>();
                            temp.add(client.getIdClient());
                            pointClients.put(points, temp);
                        }
                        leaderboardPush.delete();
                    }
                }

                ObjectNode event = Json.newObject();
                ObjectNode extraParams = Json.newObject();
                Set<Integer> points = pointClients.keySet();
                for(int point : points){
                    try {
                        String msg = resolvePointsMessage(point, idAction);
                        event.put("msg", URLEncoder.encode(msg, "UTF-8"));
                        event.put("clients", Json.toJson(pointClients.get(point)));
                        event.put("app", pmcIdApp);
                        extraParams.put("is_news", false);
                        extraParams.put("is_info", true);
                        event.put("extra_params", extraParams);
                        sendPush(event);
                    } catch (Exception e){
                        e.printStackTrace();
                    } finally {
                        event.removeAll();
                        extraParams.removeAll();
                    }
                }
                pointClients.clear();
            }
        }
    }

    private boolean notifyPointsToUpstream(Client client, int points) {
        try {
            ObjectNode event = Json.newObject();
            ObjectNode metadata = Json.newObject();
            metadata.put("points", points);
            event.put("event_type", "UPD_POINTS");
            event.put("metadata", metadata);
            F.Promise<WSResponse> result = WS.url("http://" + Config.getHost() + "/futbolbrasil/v2/client/" + client.getIdClient() + "/upstream").post(event);
            ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
            return response.get("error").asInt() == 0;
        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    private String resolvePointsMessage(int point, int idAction) {
        Action action = Action.finder.where().eq("idAction", idAction).findUnique();
        String msg = action.getMsg();
        msg = msg.replaceFirst("%POINTS%", ""+point);
        return msg;
    }

    private void sendPush(ObjectNode event) {
        F.Promise<WSResponse> result = WS.url("http://" + Config.getPMCHost() + "/events/v1/insert").post(event);
        ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
    }


}
