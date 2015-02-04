package controllers.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import exceptions.UpstreamAuthenticationFailureException;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.clients.Client;
import models.clients.ClientHasDevices;
import models.clients.Device;
import models.leaderboard.ClientBets;
import models.pushalerts.ClientHasPushAlerts;
import models.pushalerts.PushAlerts;
import org.apache.commons.codec.binary.Base64;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSRequestHolder;
import play.libs.ws.WSResponse;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Results;
import utils.DateAndTime;
import utils.Utils;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;


/**
 * Created by plesse on 9/30/14.
 */
public class Clients extends HecticusController {

    //private static final String upstreamUserIDSubscriptionResponseTag = "user_id"; //segun documentacion
    private static final String upstreamUserIDSubscriptionResponseTag = "userId"; //segun pruebas

    public static Result create() {
        ObjectNode clientData = getJson();
        try {
            ObjectNode response = null;
            Client client = null;
            String login = null;
            String password = null;
            //Obtenemos el canal por donde esta llegando el request
            String upstreamChannel;
            List<ClientHasDevices> otherRegsIDs = null;
            if(clientData.has("upstreamChannel")){
                upstreamChannel = clientData.get("upstreamChannel").asText();
            }else{
                upstreamChannel = "Android"; //"Android" o "Web"
            }
            if(clientData.has("login")){
                login = clientData.get("login").asText();

            }
            if(clientData.has("password")){
                password = clientData.get("password").asText();
            }
            if(login != null) {
                client = Client.finder.where().eq("login", login).findUnique();
                boolean update = false;
                if (client != null) {
                    if (client.getUserId() == null) {
                        //si tenemos password tratamos de hacer login
                        if (password != null && !password.isEmpty()) {
                            client.setPassword(password);
                            getUserIdFromUpstream(client, upstreamChannel);
                        } else {
                            //tratamos de crear al cliente
                            subscribeUserToUpstream(client, upstreamChannel);
                        }
                        update = true;
                    }
                    //siempre que tengamos login y pass debemos revisar el status de upstream
                    if (password != null && !password.isEmpty()) {
                        client.setPassword(password);
                        getStatusFromUpstream(client, upstreamChannel);
                        update = true;
                    }
                    if (update) {
                        client.update();
                    }
                }

                if (client != null) {
                    //actualizar regID
                    if (clientData.has("devices")) {

                        Iterator<JsonNode> devicesIterator = clientData.get("devices").elements();
                        update = false;
                        while (devicesIterator.hasNext()) {
                            ObjectNode next = (ObjectNode) devicesIterator.next();
                            if (next.has("device_id") && next.has("registration_id")) {
                                String registrationId = next.get("registration_id").asText();
                                int deviceId = next.get("device_id").asInt();
                                Device device = Device.finder.byId(deviceId);
                                ClientHasDevices clientHasDevice = ClientHasDevices.finder.where().eq("client.idClient", client.getIdClient()).eq("registrationId", registrationId).eq("device.idDevice", device.getIdDevice()).findUnique();
                                if (clientHasDevice == null) {
                                    clientHasDevice = new ClientHasDevices(client, device, registrationId);
                                    client.getDevices().add(clientHasDevice);
                                    update = true;
                                }
                                otherRegsIDs = ClientHasDevices.finder.where().ne("client.idClient", client.getIdClient()).eq("registrationId", registrationId).eq("device.idDevice", device.getIdDevice()).findList();
                                if (otherRegsIDs != null && !otherRegsIDs.isEmpty()) {
                                    for (ClientHasDevices clientHasDevices : otherRegsIDs) {
                                        clientHasDevices.delete();
                                    }
                                }
                            }
                        }
                        if (update) {
                            client.update();
                        }
                    }
                    response = buildBasicResponse(0, "OK", client.toJson());
                    return ok(response);
                }
                if (clientData.has("country") && clientData.has("language")) {
                    int countryId = clientData.get("country").asInt();
                    Country country = Country.finder.byId(countryId);
                    int languageId = clientData.get("language").asInt();
                    Language language = Language.finder.byId(languageId);
                    if (country != null) {
                        TimeZone tz = TimeZone.getDefault();
                        Calendar actualDate = new GregorianCalendar(tz);
                        SimpleDateFormat sf = new SimpleDateFormat("yyyyMMdd");
                        String date = sf.format(actualDate.getTime());

                        client = new Client(2, login, password, country, date, language);
                        ArrayList<ClientHasDevices> devices = new ArrayList<>();
                        Iterator<JsonNode> devicesIterator = clientData.get("devices").elements();
                        while (devicesIterator.hasNext()) {
                            ObjectNode next = (ObjectNode) devicesIterator.next();
                            if (next.has("device_id") && next.has("registration_id")) {
                                String registrationId = next.get("registration_id").asText();
                                int deviceId = next.get("device_id").asInt();
                                Device device = Device.finder.byId(deviceId);
                                if (device != null) {
                                    ClientHasDevices clientHasDevice = new ClientHasDevices(client, device, registrationId);
                                    devices.add(clientHasDevice);
                                    otherRegsIDs = ClientHasDevices.finder.where().eq("registrationId", registrationId).eq("device.idDevice", device.getIdDevice()).findList();
                                    if (otherRegsIDs != null && !otherRegsIDs.isEmpty()) {
                                        for (ClientHasDevices clientHasDevices : otherRegsIDs) {
                                            clientHasDevices.delete();
                                        }
                                    }
                                }
                            }
                        }
                        if (devices.isEmpty()) {
                            response = buildBasicResponse(4, "Faltan campos para crear el registro");
                            return ok(response);
                        }
                        client.setDevices(devices);

                        if (client.getPassword() != null && !client.getPassword().isEmpty()) {
                            getUserIdFromUpstream(client, upstreamChannel);
                        } else {
                            subscribeUserToUpstream(client, upstreamChannel);
                        }
                        getStatusFromUpstream(client, upstreamChannel);

                        ArrayList<ClientHasPushAlerts> pushAlerts = new ArrayList<>();
                        if (clientData.has("push_alerts")) {
                            Iterator<JsonNode> pushAlertIterator = clientData.get("pushAlerts").elements();
                            while (pushAlertIterator.hasNext()) {
                                JsonNode next = pushAlertIterator.next();
                                PushAlerts pushAlert = PushAlerts.finder.byId(next.asInt());
                                if (pushAlert != null) {
                                    ClientHasPushAlerts chpa = new ClientHasPushAlerts(client, pushAlert);
                                    pushAlerts.add(chpa);
                                }
                            }
                        }


                        int newsPushId = Config.getInt("news-push-id");
                        int betsPushId = Config.getInt("bets-push-id");
                        PushAlerts newsPushAlert = PushAlerts.finder.byId(newsPushId);
                        if (newsPushAlert != null) {
                            ClientHasPushAlerts chpa = new ClientHasPushAlerts(client, newsPushAlert);
                            pushAlerts.add(chpa);
                        }
                        PushAlerts betsPushAlert = PushAlerts.finder.byId(betsPushId);
                        if (betsPushAlert != null) {
                            ClientHasPushAlerts chpa = new ClientHasPushAlerts(client, betsPushAlert);
                            pushAlerts.add(chpa);
                        }


                        if (!pushAlerts.isEmpty()) {
                            client.setPushAlerts(pushAlerts);
                        }


                        client.save();
                        response = buildBasicResponse(0, "OK", client.toJson());
                    } else {
                        response = buildBasicResponse(3, "pais invalido");
                    }
                } else {
                    response = buildBasicResponse(1, "Faltan campos para crear el registro");
                }
            } else {
                response = buildBasicResponse(1, "Faltan campos para crear el registro");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error creando client con params " + clientData, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        ObjectNode clientData = getJson();
        try{
            ObjectNode response = null;
            Client client = Client.finder.byId(id);
            if(client != null) {
                boolean update = false;
                boolean loginAgain = false;
                if(clientData.has("login")){
                    client.setLogin(clientData.get("login").asText());
                    loginAgain = true;
                    update = true;
                }

                if(clientData.has("password")){
                    client.setPassword(clientData.get("password").asText());
                    loginAgain = true;
                    update = true;
                }

                String upstreamChannel = "Android"; //default Android
                if(clientData.has("upstreamChannel")){
                    upstreamChannel = clientData.get("upstreamChannel").asText();
                }

                if(loginAgain && (client.getLogin() != null && !client.getLogin().isEmpty()) && (client.getPassword() != null && !client.getPassword().isEmpty())){
                    getUserIdFromUpstream(client,upstreamChannel);
                    getStatusFromUpstream(client,upstreamChannel);
                }

                if(clientData.has("language")){
                    int languageId = clientData.get("language").asInt();
                    Language language = Language.finder.byId(languageId);
                    if(language != null){
                        client.setLanguage(language);
                        update = true;
                    }
                }

                if(clientData.has("remove_devices")){
                    Iterator<JsonNode> devicesIterator = clientData.get("remove_devices").elements();
                    ArrayList<ClientHasDevices> devices = new ArrayList<>();
                    while (devicesIterator.hasNext()) {
                        ObjectNode next = (ObjectNode) devicesIterator.next();
                        if (next.has("device_id") && next.has("registration_id")) {
                            String registrationId = next.get("registration_id").asText();
                            int deviceId = next.get("device_id").asInt();
                            Device device = Device.finder.byId(deviceId);
                            if (device != null) {
                                int index = client.getDeviceIndex(registrationId, deviceId);
                                if(index != -1) {
                                    client.getDevices().remove(index);
                                    update = true;
                                }
                            }
                        }
                    }
                }

                if(clientData.has("add_devices")) {
                    Iterator<JsonNode> devicesIterator = clientData.get("add_devices").elements();
                    List<ClientHasDevices> otherRegsIDs = null;
                    while (devicesIterator.hasNext()) {
                        ObjectNode next = (ObjectNode) devicesIterator.next();
                        if (next.has("device_id") && next.has("registration_id")) {
                            String registrationId = next.get("registration_id").asText();
                            int deviceId = next.get("device_id").asInt();
                            Device device = Device.finder.byId(deviceId);
                            if (device != null) {
                                if(client.getDeviceIndex(registrationId, deviceId) == -1) {
                                    ClientHasDevices clientHasDevice = new ClientHasDevices(client, device, registrationId);
                                    client.getDevices().add(clientHasDevice);
                                    update = true;
                                }
                            }
                            otherRegsIDs = ClientHasDevices.finder.where().ne("client.idClient", client.getIdClient()).eq("registrationId", registrationId).eq("device.idDevice", device.getIdDevice()).findList();
                            if(otherRegsIDs != null && !otherRegsIDs.isEmpty()){
                                for(ClientHasDevices clientHasDevices : otherRegsIDs){
                                    clientHasDevices.delete();
                                }
                            }
                        }
                    }
                }

                if(clientData.has("remove_push_alert")){
                    Iterator<JsonNode> alertsIterator = clientData.get("remove_push_alert").elements();
                    while (alertsIterator.hasNext()) {
                        JsonNode next = alertsIterator.next();
                        PushAlerts pushAlert = PushAlerts.finder.byId(next.asInt());
                        if(pushAlert == null){
                            continue;
                        }
                        List<ClientHasPushAlerts> clientHasPushAlerts = ClientHasPushAlerts.finder.where().eq("client.idClient", client.getIdClient()).eq("pushAlert.idPushAlert", pushAlert.getIdPushAlert()).findList();
                        if(clientHasPushAlerts != null && !clientHasPushAlerts.isEmpty()){
                            for(ClientHasPushAlerts clientHasPushAlert : clientHasPushAlerts) {
                                client.getPushAlerts().remove(clientHasPushAlert);
                                clientHasPushAlert.delete();
                            }
                            update = true;
                        }
                    }
                }

                if(clientData.has("add_push_alert")) {
                    Iterator<JsonNode> alertsIterator = clientData.get("add_push_alert").elements();
                    while (alertsIterator.hasNext()) {
                        JsonNode next = alertsIterator.next();
                        int index = client.getPushAlertIndex(next.asInt());
                        if (index == -1) {
                            PushAlerts pushAlert = PushAlerts.finder.where().eq("idExt", next.asInt()).findUnique();
                            if (pushAlert != null) {
                                ClientHasPushAlerts chpa = new ClientHasPushAlerts(client, pushAlert);
                                client.getPushAlerts().add(chpa);
                                update = true;
                            }
                        }
                    }
                }

                int betsPushId = Config.getInt("bets-push-id");
                int newsPushId = Config.getInt("news-push-id");

                if(clientData.has("receive_news")) {
                    boolean receiveNews = clientData.get("receive_news").asBoolean();
                    int index = client.getPushAlertIndex(newsPushId);
                    client.getPushAlerts().get(index).setStatus(receiveNews);
                    update = true;
                }

                if(clientData.has("receive_bets")) {
                    boolean receiveBets = clientData.get("receive_bets").asBoolean();
                    int index = client.getPushAlertIndex(betsPushId);
                    client.getPushAlerts().get(index).setStatus(receiveBets);
                    update = true;
                }

                if(clientData.has("receive_min")) {
                    boolean receiveMin = clientData.get("receive_min").asBoolean();
                    for(ClientHasPushAlerts clientHasPushAlerts : client.getPushAlerts()){
                        if(clientHasPushAlerts.getIdClientHasPushAlert() != betsPushId && clientHasPushAlerts.getIdClientHasPushAlert() != newsPushId) {
                            clientHasPushAlerts.setStatus(receiveMin);
                            update = true;
                        }
                    }
                }

                //si pedimos que se suscriba debe hacerse
                if(clientData.has("subscribe") && clientData.has("login")){
                    if(client != null){
                        if(client.getUserId() == null){
                            //tratamos de crear al cliente
                            subscribeUserToUpstream(client,upstreamChannel);
                            update = true;
                        }
                        if(client.getStatus() <= 0){
                            getStatusFromUpstream(client,upstreamChannel);
                            update = true;
                        }
                    }
                }

                if(update){
                    client.update();
                }
                response = buildBasicResponse(0, "OK", client.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a eliminar");
            }
            return ok(response);
//        } catch (InvalidLoginException ex) {
//            Utils.printToLog(Clients.class, "Error manejando clients", "Login invalido " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
//            return Results.badRequest(buildBasicResponse(4, "ocurrio un error actualizando el registro", ex));
//        } catch (InvalidPasswordException ex) {
//            Utils.printToLog(Clients.class, "Error manejando clients", "Login invalido " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
//            return Results.badRequest(buildBasicResponse(5, "ocurrio un error actualizando el registro", ex));
//        } catch (UpstreamTimeoutException ex) {
//            Utils.printToLog(Clients.class, "Error manejando clients", "Login invalido " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
//            return Results.badRequest(buildBasicResponse(6, "ocurrio un error actualizando el registro", ex));
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error actualizando el client " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(3, "ocurrio un error actualizando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            ObjectNode response = null;
            Client client = Client.finder.byId(id);
            if(client != null) {
                client.delete();
                response = buildBasicResponse(0, "OK", client.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a eliminar");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error eliminando el client " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id, String upstreamChannel, Boolean pmc){
        try {
            ObjectNode response = null;
            Client client = Client.finder.byId(id);
            if(client != null) {
                if(client.getStatus() >= 0 && !pmc) {
                    String lcd = client.getLastCheckDate();
                    Calendar lastCheckDate = new GregorianCalendar(Integer.parseInt(lcd.substring(0, 4)), Integer.parseInt(lcd.substring(4, 6)) - 1, Integer.parseInt(lcd.substring(6)));
                    TimeZone tz = TimeZone.getDefault();
                    Calendar actualDate = new GregorianCalendar(tz);
                    if ((actualDate.get(Calendar.YEAR) > lastCheckDate.get(Calendar.YEAR)) || (actualDate.get(Calendar.MONTH) > lastCheckDate.get(Calendar.MONTH)) || (actualDate.get(Calendar.DATE) > lastCheckDate.get(Calendar.DATE))) {
                        SimpleDateFormat sf = new SimpleDateFormat("yyyyMMdd");
                        if (client.getLogin() != null) {
                            getStatusFromUpstream(client,upstreamChannel);
                            client.setLastCheckDate(sf.format(actualDate.getTime()));
                            client.update();
                        } else {
                            long daysBetween = Utils.daysBetween(lastCheckDate, actualDate);
                            if (daysBetween >= Config.getInt("free-days")) {
                                client.setStatus(-1);
                                client.setLastCheckDate(sf.format(actualDate.getTime()));
                                client.update();
                            }
                        }
                    }
                }
                response = buildBasicResponse(0, "OK", pmc?client.toPMCJson():client.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error obteniendo el client " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page, Boolean pmc){
        try {

            Iterator<Client> clientIterator = null;
            if(pageSize == 0){
                clientIterator = Client.finder.all().iterator();
            }else{
                clientIterator = Client.finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
            }

            ArrayList<ObjectNode> clients = new ArrayList<ObjectNode>();
            while(clientIterator.hasNext()){
                clients.add(pmc?clientIterator.next().toPMCJson():clientIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(clients));
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error listando clients con pageSize " + pageSize + " y " + page, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result cleanDevices(){
        ObjectNode json = getJson();
        try{
            Iterator<JsonNode> operations = json.get("operations").elements();
            while(operations.hasNext()) {
                ObjectNode operation = (ObjectNode) operations.next();
                if(operation.has("type") && operation.has("actual_id") && operation.has("operation")) {
                    String type = operation.get("type").asText();
                    String actualId = operation.get("actual_id").asText();
                    String action = operation.get("operation").asText();
                    List<ClientHasDevices> devs = ClientHasDevices.finder.where().eq("registrationId", actualId).eq("device.name",type).findList();
                    for(ClientHasDevices d : devs) {
                        if(action.equalsIgnoreCase("UPDATE")){
                            d.setRegistrationId(operation.get("new_id").asText());
                            d.update();
                        } else if(action.equalsIgnoreCase("DELETE")){
                            d.delete();
                        }
                    }
                    if(operation.has("new_id")) {
                        devs = ClientHasDevices.finder.where().eq("registrationId", operation.get("new_id").asText()).eq("device.name",type).findList();
                        if(devs != null && !devs.isEmpty()){
                            for(int i = 1; i < devs.size(); ++i){
                                devs.get(i).delete();
                            }
                        }
                    }
                }
            }
            return ok(buildBasicResponse(0,"ok"));
        }catch(Exception ex){
            Utils.printToLog(Clients.class, "Error manejando clients", "Ocurrio un error limpiando los devices " + json, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",ex));
        }
    }

    public static Result getPushAlertsForClient(Integer id) {
        try {
            ObjectNode response = null;
            Client client = Client.finder.byId(id);
            if(client != null) {
                if(client.getStatus() >= 0) {
                    List<ClientHasPushAlerts> pushAlerts = client.getPushAlerts();
                    ArrayList jsonAlerts = new ArrayList();
                    for(int i=0; i<pushAlerts.size(); i++){
                        jsonAlerts.add(pushAlerts.get(i).toJson());
                    }
                    response = buildBasicResponse(0, "OK", Json.toJson(jsonAlerts));
                }else{
                    response = buildBasicResponse(3, "cliente no se encuentra en status valido");
                }

            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error obteniendo la lista de alertas para el client " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1, "Error buscando el registro", e));
        }
    }

    //ClientBetsWS


    public static Result createBet(Integer idClient) {
        ObjectNode betsData = getJson();
        try {
            ObjectNode response = null;
            Client client = Client.finder.byId(idClient);
            if(client != null) {
                Iterator<JsonNode> bets = betsData.get("bets").elements();
                Map<Integer, ObjectNode> betsMap = new HashMap<>();
                StringBuilder matchesRequest = new StringBuilder();
                matchesRequest.append("http://").append(Config.getFootballManagerHost()).append("/footballapi/v1/matches/get/ids/").append(Config.getInt("football-manager-id-app")).append("?");
                int idTournament = -1, idGameMatch = -1, clientBet = -1;
                ClientBets clientBets = null;
                while(bets.hasNext()){
                    JsonNode bet = bets.next();
                    idTournament = bet.get("id_tournament").asInt();
                    idGameMatch = bet.get("id_game_match").asInt();
                    clientBet = bet.get("client_bet").asInt();
                    ObjectNode betElement = Json.newObject();
                    betElement.put("id_tournament", idTournament);
                    betElement.put("id_game_match", idGameMatch);
                    betElement.put("client_bet", clientBet);
                    betsMap.put(idGameMatch, betElement);
                    matchesRequest.append("match[]=" + idGameMatch + "&");
                }

                F.Promise<WSResponse> result = WS.url(matchesRequest.toString()).get();
                ObjectNode footballResponse = (ObjectNode) result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();

                int error = footballResponse.get("error").asInt();
                if(error == 0) {
                    Map<Integer, ClientBets> clientBetsAsMap = client.getClientBetsAsMap();
                    JsonNode data = footballResponse.get("response");
                    Iterator<JsonNode> matches = data.get("matches").elements();
                    while (matches.hasNext()) {
                        JsonNode match = matches.next();
                        idGameMatch = match.get("id_game_matches").asInt();
                        if (betsMap.containsKey(idGameMatch)) {
                            ObjectNode betElement = betsMap.get(idGameMatch);
                            idTournament = betElement.get("id_tournament").asInt();
                            idGameMatch = betElement.get("id_game_match").asInt();
                            clientBet = betElement.get("client_bet").asInt();
                            String dateText = match.get("date").asText();
                            Date date = DateAndTime.getDate(dateText, dateText.length() == 8 ? "yyyyMMdd" : "yyyyMMddhhmmss");
                            Date today = new Date(System.currentTimeMillis());
                            if (date.after(today)) {
                                if (clientBetsAsMap.containsKey(idGameMatch)) {
                                    clientBets = clientBetsAsMap.get(idGameMatch);
                                    clientBets.setClientBet(clientBet);
                                    client.addClientBet(clientBets);
                                } else {
                                    clientBets = new ClientBets(client, idTournament, idGameMatch, clientBet);
                                    client.addClientBet(clientBets);
                                }
                            }
                        }
                    }
                    client.update();
                    response = buildBasicResponse(0, "done");
                } else{
                    response = buildBasicResponse(1, "error vaidando partidos");
                }
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error creando clientbets para el client " + idClient, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1, "Error buscando el registro", e));
        }
    }


    public static Result getBets(Integer idClient) {
        ObjectNode response = null;
        try {
            Client client = Client.finder.byId(idClient);
            if(client != null) {
                String teams = "http://" + Config.getFootballManagerHost() + "/footballapi/v1/matches/date/grouped/" + Config.getInt("football-manager-id-app");
                F.Promise<WSResponse> result = WS.url(teams.toString()).get();
                ObjectNode footballResponse = (ObjectNode) result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
                int error = footballResponse.get("error").asInt();
                if(error == 0) {
                    JsonNode data = footballResponse.get("response");
                    ArrayList<ObjectNode> finalData = new ArrayList<>();
                    ObjectNode responseData = Json.newObject();
                    ArrayList<Integer> matchesIDs = new ArrayList<>();
                    ArrayList<ObjectNode> modifiedFixtures = new ArrayList<>();
                    Map<Integer, ObjectNode> matches = new HashMap<>();
                    Iterator<JsonNode> leagues = data.get("leagues").elements();
                    while (leagues.hasNext()) {
                        int maxBetsCount = 0;
                        int clientBetsCount = 0;
                        ObjectNode league = (ObjectNode) leagues.next();
                        Iterator<JsonNode> fixtures = league.get("fixtures").elements();
                        while (fixtures.hasNext()) {
                            ObjectNode fixture = (ObjectNode) fixtures.next();
                            Iterator<JsonNode> externalMatches = fixture.get("matches").elements();
                            while (externalMatches.hasNext()){
                                ObjectNode externalMatch = (ObjectNode) externalMatches.next();
                                int idGameMatches = externalMatch.get("id_game_matches").asInt();
                                matchesIDs.add(idGameMatches);
                                matches.put(idGameMatches, externalMatch);
                            }
                        }
                        maxBetsCount = matchesIDs.size();
                        List<ClientBets> list = ClientBets.finder.where().eq("client", client).eq("idTournament", league.get("id_competitions").asInt()).in("idGameMatch", matchesIDs).orderBy("idGameMatch asc").findList();
                        if (list != null && !list.isEmpty()) {
                            clientBetsCount+=list.size();
                            ArrayList<ObjectNode> dataFixture = new ArrayList();
                            ArrayList<ObjectNode> orderedFixtures = new ArrayList<>();
                            for (ClientBets clientBets : list) {
                                ObjectNode fixture = matches.get(clientBets.getIdGameMatch());
                                fixture.put("bet", clientBets.toJsonNoClient());
                                modifiedFixtures.add(fixture);
                                matches.remove(clientBets.getIdGameMatch());
                            }
                            Set<Integer> keys = matches.keySet();
                            for (int key : keys) {
                                ObjectNode fixture = matches.get(key);
                                modifiedFixtures.add(fixture);
                            }
                            Collections.sort(modifiedFixtures, new FixturesComparator());

                            String pivot = modifiedFixtures.get(0).get("date").asText().substring(0, 8);
                            for (ObjectNode gameMatch : modifiedFixtures){
                                if(gameMatch.get("date").asText().startsWith(pivot)){
                                    orderedFixtures.add(gameMatch);
                                } else {
                                    ObjectNode round = Json.newObject();
                                    round.put("date", pivot);
                                    round.put("matches", Json.toJson(orderedFixtures));
                                    dataFixture.add(round);
                                    orderedFixtures.clear();
                                    orderedFixtures.add(gameMatch);
                                    pivot = gameMatch.get("date").asText().substring(0, 8);
                                }
                            }
                            if(!orderedFixtures.isEmpty()){
                                ObjectNode round = Json.newObject();
                                round.put("date", pivot);
                                round.put("matches", Json.toJson(orderedFixtures));
                                dataFixture.add(round);
                                orderedFixtures.clear();
                            }

                            league.remove("fixtures");
                            league.put("fixtures", Json.toJson(dataFixture));
                            orderedFixtures.clear();
                            dataFixture.clear();
                        }
                        league.put("total_bets", maxBetsCount);
                        league.put("client_bets", clientBetsCount);
                        finalData.add(league);
                        modifiedFixtures.clear();
                        matchesIDs.clear();
                        matches.clear();
                    }
                    responseData.put("leagues", Json.toJson(finalData));
                    response = buildBasicResponse(0, "OK", responseData);
                } else {
                    response = buildBasicResponse(3, "error llamando a footballmanager");
                }
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error creando clientbets para el client " + idClient, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1, "Error buscando el registro", e));
        }
    }

    public static class FixturesComparator implements Comparator<ObjectNode> {
        @Override
        public int compare(ObjectNode o1, ObjectNode o2) {
            int result = o1.get("date").asText().compareTo(o2.get("date").asText());
            if(result == 0){
                return o1.get("id_game_matches").asInt() - o2.get("id_game_matches").asInt();
            }
            return result;
        }
    }


    public static Result getActiveLanguages(){
        try {
            ObjectNode response = null;
            List<Language> activeLanguages = Language.finder.where().eq("active", 1).findList();
            if(activeLanguages != null && !activeLanguages.isEmpty()) {
                ArrayList<ObjectNode> languages = new ArrayList<>();
                for(Language language : activeLanguages){
                    languages.add(language.toJson());
                }
                ObjectNode responseData = Json.newObject();
                responseData.put("languages", Json.toJson(languages));
                response = buildBasicResponse(0, "OK", responseData);
            } else {
                response = buildBasicResponse(2, "no hay idiomas activos");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error obteniendo los idiomas activos ", true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }








    //Reset Upstream pass and they send MT to client with new one
    public static Result resetUpstreamPass() {
        String msisdn = "";
        try{
            ObjectNode response = null;
            ObjectNode clientData = getJson();
            Client client = null;
            //Obtenemos el canal por donde esta llegando el request
            String upstreamChannel;
            if(clientData.has("upstreamChannel")){
                upstreamChannel = clientData.get("upstreamChannel").asText();
            }else{
                upstreamChannel = "Android"; //"Android" o "Web"
            }
            //buscamos el msisdn
            if(clientData.has("msisdn")){
                msisdn = clientData.get("msisdn").asText();
                client = Client.finder.where().eq("login",msisdn).findUnique();
            }
            if(client != null) {
                resetPasswordForUpstream(client,upstreamChannel);
                client.setPassword("");
                client.update();
                response = buildBasicResponse(0, "OK", client.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro para hacer reset del pass");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error recuperando el password de upstream del client " + msisdn, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error recuperando password", ex));
        }
    }

    //Events for Upstream
    public static Result sendEvent() {
        String user_id = "";
        String event_type = "";
        try{
            ObjectNode response = null;
            ObjectNode clientData = getJson();
            Client client = null;
            //Obtenemos el canal por donde esta llegando el request
            String upstreamChannel;
            if(clientData.has("upstreamChannel")){
                upstreamChannel = clientData.get("upstreamChannel").asText();
            }else{
                upstreamChannel = "Android"; //"Android" o "Web"
            }
            //buscamos el user_id
            if(clientData.has("user_id")){
                user_id = clientData.get("user_id").asText();
                client = Client.finder.where().eq("user_id",user_id).findUnique();
            }
            //buscamos el event_type
            if(clientData.has("event_type")){
                event_type = clientData.get("event_type").asText();
            }
            if(client != null && (event_type != null || !event_type.isEmpty())) {
                sendEventForUpstream(client,upstreamChannel,event_type);
                response = buildBasicResponse(0, "OK", client.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro para enviar el evento");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error enviando evento", "error al enviar un evento a Upstream del client " + user_id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error enviando evento", ex));
        }
    }

    //FUNCIONES DE UPSTREAM

    /**
     * Funcion que permite suscribir al usuario en Upstream dado su msisdn(username)
     *
     * POST data as JSON:
     * msisdn                   String  mandatory   msisdn from user (login)
     * push_notification_id     String  optional    push id
     * password                 String  mandatory   password sent from SMS to the user
     * service_id               String  mandatory   Upstream suscription service
     * metadata                 JSON    optional    extra params
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 1-User already subscribed, 2-User cannot be identified, 3-User not Subscribed, 5-Invalid MSISDN, 6-push_notification_id already exists, 7-Upstream service no longer available
     * user_id      String
     *
     * Example:
     *
     * Headers:
     * Content-Type : application/json
     * Accept : application/gamingapi.v1+json
     * x-gameapi-app-key : DEcxvzx98533fdsagdsfiou
     * Body:
     * {"password":"CMSLJMWD","metadata":{"channel":"Android","result":null,"points":null,
     * "app_version":"gamingapi.v1","session_id":null},"service_id":"prototype-app -SubscriptionDefault",
     * "msisdn":"999000000005","push_notification_id":"wreuoi24lkjfdlkshjkjq4h35k13jh43kjhfkjqewhrtkqjrewht"}
     *
     * Response:
     * {
     * "result" : 0
     * "user_id" : "324234345050505"
     * }
     *
     *
     * Parametros necesarios
     * username  user from the app
     * password  password from the app
     * push_notification_id  optional, regID of user
     * channel   "Android" or "Web"
     *
     */
    private static void subscribeUserToUpstream(Client client, String upstreamChannel) throws Exception{
        if(client.getLogin() == null){
            client.setStatus(2);
        } else {
            String msisdn = client.getLogin();
            String password = client.getPassword();
            String push_notification_id = null;

            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client);
            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/subscribe";

            WSRequestHolder urlCall = setUpstreamRequest(url, msisdn, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id);
            //agregamos el msisdn(username) y el password
            fields.put("password", password);
            fields.put("msisdn", msisdn);

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            WSResponse wsResponse = resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS);
            checkUpstreamResponseStatus(wsResponse,client);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)wsResponse.asJson();
            String errorMessage="";
            if(fResponse != null){
                int callResult = fResponse.findValue("result").asInt();
                errorMessage = getUpstreamError(callResult) + " - upstreamResult:"+callResult;
                //TODO: revisar si todos estos casos devuelven con exito la llamada o algunos si se consideran errores
                if(callResult == 0 || callResult == 1 || callResult == 0 || callResult == 6){
                    //Se trajo la informacion con exito
                    String userID = fResponse.findValue(upstreamUserIDSubscriptionResponseTag).asText();
                    //TODO: guardar el userID en la info del cliente
                    client.setUserId(userID);
                }else{
                    //ocurrio un error en la llamada
                    throw new Exception(errorMessage);
                }
            }else{
                errorMessage = "Web service call to Upstream failed";
                throw new Exception(errorMessage);
            }

            //client.setStatus(1);//no lo debemos colocar en status 1 hasta que no obtengamos el status del cliente
        }
    }

    /**
     * Funcion que permite desuscribir al usuario en Upstream dado su user_id de upstream
     *
     * POST data as JSON:
     * user_id                  String  mandatory   upstream user_id
     * push_notification_id     String  optional    push id
     * service_id               String  mandatory   Upstream suscription service
     * metadata                 JSON    optional    extra params
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 2-User cannot be identified, 3-User not Subscribed, 4-push_notification_id missing, 7-Upstream service no longer available
     *
     * Example:
     *
     * Headers:
     * Content-Type : application/json
     * Accept : application/gamingapi.v1+json
     * x-gameapi-app-key : DEcxvzx98533fdsagdsfiou
     * Body:
     * {"metadata":{"channel":"Android","result":null,"points":null,
     * "app_version":"gamingapi.v1","session_id":null},"service_id":"prototype-app -SubscriptionDefault",
     * "user_id":8001,"push_notification_id":"wreuoi24lkjfdlkshjkjq4h35k13jh43kjhfkjqewhrtkqjrewht"}
     *
     * Response:
     * {
     * "result" : 0
     * }
     *
     *
     * Parametros necesarios
     * user_id   upstream user_id
     * username  user from the app
     * password  password from the app
     * push_notification_id  optional, regID of user
     * channel   "Android" or "Web"
     *
     */
    private static void unsubscribeUserToUpstream(Client client, String upstreamChannel) throws Exception{
        String errorMessage="";
        if(client.getLogin() == null || client.getUserId() == null){
            errorMessage = "El cliente no posee login o user_id";
            throw new Exception(errorMessage);
        } else {
            String login = client.getLogin();
            String userID = client.getUserId();
            String password = client.getPassword();
            String push_notification_id = null;
            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client);
            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/subscribe";

            WSRequestHolder urlCall = setUpstreamRequest(url, login, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id);
            //agregamos el user_id
            fields.put("user_id", userID);

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            WSResponse wsResponse = resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS);
            checkUpstreamResponseStatus(wsResponse,client);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)wsResponse.asJson();
            if(fResponse != null){
                int callResult = fResponse.findValue("result").asInt();
                errorMessage = getUpstreamError(callResult) + " - upstreamResult:"+callResult;
                if(callResult == 0){
                    //TODO: Que se debe hacer en el caso que la desuscripcion sea exitosa, borrar al cliente, ponerlo en status 2 para que con la fecha se actualice?
                    client.setStatus(0);
                    client.setUserId("");
                    client.setPassword("");
                }else{
                    //ocurrio un error en la llamada
                    throw new Exception(errorMessage);
                }
            }else{
                errorMessage = "Web service call to Upstream failed";
                throw new Exception(errorMessage);
            }
        }
    }

    /**
     * Funcion que permite hacer login del usuario en Upstream dado un username y un password
     *
     * POST data as JSON:
     * username                 String  mandatory   user name
     * push_notification_id     String  optional    push id
     * password                 String  mandatory   password sent from SMS to the user
     * service_id               String  mandatory   Upstream suscription service
     * metadata                 JSON    optional    extra params
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 2-User cannot be identified, 3-User not Subscribed, 6-push_notification_id already exists, 7-Upstream service no longer available
     * user_id      String
     *
     * Example:
     *
     * Headers:
     * Content-Type : application/json
     * Accept : application/gamingapi.v1+json
     * x-gameapi-app-key : DEcxvzx98533fdsagdsfiou
     * Body:
     * {"password":"CMSLJMWD","metadata":{"channel":"Android","result":null,"points":null,
     * "app_version":"gamingapi.v1","session_id":null},"service_id":"prototype-app -SubscriptionDefault",
     * "username":"999000000005","push_notification_id":"wreuoi24lkjfdlkshjkjq4h35k13jh43kjhfkjqewhrtkqjrewht"}
     *
     * Response:
     * {
     * "result" : 0
     * "user_id" : "324234345050505"
     * }
     *
     * Parameters required
     * username  user from the app
     * password  password from the app
     * push_notification_id  optional, regID of user
     * channel   "Android" or "Web"
     *
     */
    private static void getUserIdFromUpstream(Client client, String upstreamChannel) throws Exception{
        if(client.getLogin() == null){
            client.setStatus(2);
        } else {
            String username = client.getLogin();
            String password = client.getPassword();
            //String channel = "Android";
            String push_notification_id = null;
            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client);
            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/login";

            WSRequestHolder urlCall = setUpstreamRequest(url, username, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id);
            //agregamos el username y el password
            fields.put("password", password);
            fields.put("username", username);

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            WSResponse wsResponse = resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS);
            checkUpstreamResponseStatus(wsResponse,client);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)wsResponse.asJson();
            String errorMessage="";
            if(fResponse != null){
                int callResult = fResponse.findValue("result").asInt();
                errorMessage = getUpstreamError(callResult) + " - upstreamResult:"+callResult;
                if(callResult == 0 || callResult == 6){
                    //Se trajo la informacion con exito
                    String userID = fResponse.findValue("user_id").asText();
                    //TODO: guardar el userID en la info del cliente
                    client.setUserId(userID);
                }else{
                    //ocurrio un error en la llamada
                    throw new Exception(errorMessage);
                }
            }else{
                errorMessage = "Web service call to Upstream failed";
                throw new Exception(errorMessage);
            }
        }
    }

    /**
     * Funcion que permite obtener el status de una suscripcion en Upstream
     *
     * POST data as JSON:
     * user_id                  String  mandatory   upstream user_id
     * push_notification_id     String  optional    push id
     * service_id               String  mandatory   Upstream suscription service
     * metadata                 JSON    optional    extra params
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 2-User cannot be identified, 3-User not Subscribed, 4-push_notification_id missing, 7-Upstream service no longer available
     * user_id      String
     *
     * Example:
     *
     * Headers:
     * Content-Type : application/json
     * Accept : application/gamingapi.v1+json
     * x-gameapi-app-key : DEcxvzx98533fdsagdsfiou
     * Authorization : Basic OTk5MDAwMDIzMzE1OlNSUTcyRktT
     * Body:
     * {"metadata":{"channel":"Android","result":null,"points":null,"app_version":"gamingapi.v1",
     * "session_id":null},"service_id":"prototype-app -SubscriptionDefault",
     * "user_id":8001,"push_notification_id":"wreuoi24lkjfdlk13jh45kjhfkjqewhrt34jrewh2"}
     *
     * Response:
     * {
     * "result" : 0,
     * "eligible" : "true",
     * "credits_left" : "10"
     * }
     *
     * Parametros necesarios
     * userID    upstream user id
     * username  user from the app
     * password  password from the app
     * push_notification_id  optional, regID of user
     * channel   "Android" or "Web"
     *
     */
    private static void getStatusFromUpstream(Client client, String upstreamChannel) throws Exception{
        if(client.getLogin() != null && client.getUserId() != null && client.getPassword() != null){
            String username = client.getLogin();
            String userID = client.getUserId();
            String password = client.getPassword();
            String push_notification_id = null;
            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client);
            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/status";

            //Hacemos la llamada con los headers de autenticacion
            WSRequestHolder urlCall = setUpstreamRequest(url, username, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id);
            fields.put("user_id", userID); //agregamos el UserID al request

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            WSResponse wsResponse = resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS);
            checkUpstreamResponseStatus(wsResponse,client);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)wsResponse.asJson();
            String errorMessage = "";
            if(fResponse != null){
                int callResult = fResponse.findValue("result").asInt();
                errorMessage = getUpstreamError(callResult) + " - upstreamResult:"+callResult;
                if(callResult == 0 || callResult == 4){
                    //Se trajo la informacion con exito
                    Boolean eligible = fResponse.findValue("eligible").asBoolean();
                    //TODO: guardar en el userID la info de si esta activo o no
                    client.setStatus(eligible ? 1 : 0);
                }else{
                    //ocurrio un error en la llamada
                    throw new Exception(errorMessage);
                }
            }else{
                errorMessage = "Web service call to Upstream failed";
                throw new Exception(errorMessage);
            }
        }else{
            //deberia estar en periodo de pruebas 2 o desactivado por tiempo -1 la verificacion se hace despues de la llamada
            client.setStatus(2);
        }
    }

    /**
     * Funcion que permite que Upstream envie un MT con el password nuevamente al cliente
     *
     * POST data as JSON:
     * msisdn                   String  mandatory   upstream user_id
     * push_notification_id     String  optional    push id
     * service_id               String  mandatory   Upstream suscription service
     * metadata                 JSON    optional    extra params
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 2-User cannot be identified, 3-User not Subscribed, 7-Upstream service no longer available
     *
     * Example:
     *
     * Headers:
     * Content-Type : application/json
     * Accept : application/gamingapi.v1+json
     * x-gameapi-app-key : DEcxvzx98533fdsagdsfiou
     * Authorization : Basic OTk5MDAwMDIzMzE1OlNSUTcyRktT
     * Body:
     * {"metadata":{"channel":"Android","result":null,"points":null,"app_version":"gamingapi.v1",
     * "session_id":null},"service_id":"prototype-app -SubscriptionDefault",
     * "msisdn":"999000000005"}
     *
     * Response:
     * {
     * "result" : 0
     * }
     *
     * msisdn    msisdn for upstream client
     * push_notification_id  optional, regID of user
     * channel   "Android" or "Web"
     *
     */
    private static void resetPasswordForUpstream(Client client, String upstreamChannel) throws Exception{
        String errorMessage = "";
        if(client.getLogin() != null){
            String msisdn = client.getLogin();
            String userID = null;
            String password = null;
            String push_notification_id = null;

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/password";

            //Hacemos la llamada con los headers de autenticacion
            WSRequestHolder urlCall = setUpstreamRequest(url, msisdn, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id);
            fields.put("msisdn", msisdn); //agregamos el UserID al request

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            WSResponse wsResponse = resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS);
            checkUpstreamResponseStatus(wsResponse,client);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)wsResponse.asJson();
            if(fResponse != null){
                int callResult = fResponse.findValue("result").asInt();
                errorMessage = getUpstreamError(callResult) + " - upstreamResult:"+callResult;
                if(callResult == 0){
                    //everything is OK, do nothing but wait for MT
                }else{
                    //ocurrio un error en la llamada
                    throw new Exception(errorMessage);
                }
            }else{
                errorMessage = "Web service call to Upstream failed";
                throw new Exception(errorMessage);
            }
        }else{
            errorMessage = "No MSISDN for client";
            throw new Exception(errorMessage);
        }
    }

    /**
     * Funcion que permite enviar un evento de la app a Upstream
     *
     * POST data as JSON:
     * user_id                  String  mandatory   upstream user_id
     * push_notification_id     String  optional    push id
     * service_id               String  mandatory   Upstream suscription service
     * metadata                 JSON    optional    extra params
     * timestamp                String  mandatory   “dd/MM/yy HH:mm:ss.SSS UTC” (TZ is always UTC)
     * device_id                String  mandatory   device ID for upstream
     * event_type               String  optional    String with one of the following
     *
     * EVENTS
     *
     * APP_LAUNCH: Application Launch
     * LOGIN: Login attempt
     * GAME_LAUNCH: Game Launch
     * GAME_END: Game End
     * APP_CLOSE: Application Close
     * UPD_POINTS: Points Update
     * VIEW_SP: View subscription prompt
     * CLICK_SP: Clicked subscription prompt
     * CLICK_PN: Clicked Push Notification
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 2-User cannot be identified, 3-User not Subscribed, 4-push_notification_id missing, 7-Upstream service no longer available
     *
     * Example:
     *
     * Headers:
     * Content-Type: application/json
     * Accept: application/gamingapi.v1+json
     * x-gameapi-app-key: DEcxvzx98533fdsagdsfiou
     * Authorization : Basic OTk5MDAwMDIzMzE1OlNSUTcyRktT
     *
     * Body:
     * {"timestamp":"01/01/14 00:00:01.001
     * UTC","metadata":{"channel":"Android","result":"win","points":[{"type":"expe
     * rience","value":"100"}],"app_version":"gamingapi.v1","session_id":null},"se
     * rvice_id":"prototype-app -
     * SubscriptionDefault","user_id":8001,"push_notification_id":"wreuoi24lkjfdlk
     * 13jh45kjhfkjqewhrt34jrewh2","event_type":"APP_LAUNCH", "device_id":"user-device-id"}
     *
     * Response:
     * {
     * "result" : 0
     * }
     *
     * Parametros necesarios
     * userID    upstream user id
     * username  user from the app
     * password  password from the app
     * push_notification_id  optional, regID of user
     * channel   "Android" or "Web"
     *
     */
    private static void sendEventForUpstream(Client client, String upstreamChannel, String event_type) throws Exception{
        if(client.getLogin() != null && client.getUserId() != null && client.getPassword() != null){
            String username = client.getLogin();
            String userID = client.getUserId();
            String password = client.getPassword();
            String push_notification_id = null;
            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client);
            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/event";

            //Hacemos la llamada con los headers de autenticacion
            WSRequestHolder urlCall = setUpstreamRequest(url, username, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id);
            fields.put("user_id", userID); //agregamos el UserID al request
            fields.put("event_type", event_type); //agregamos el evento
            fields.put("timestamp", formatDateUpstream()); //agregamos el time

            System.out.println("STATUS FIELDS " + fields.toString());

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            WSResponse wsResponse = resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS);
            checkUpstreamResponseStatus(wsResponse,client);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)wsResponse.asJson();
            String errorMessage = "";
            if(fResponse != null){
                int callResult = fResponse.findValue("result").asInt();
                errorMessage = getUpstreamError(callResult) + " - upstreamResult:"+callResult;
                if(callResult == 0 || callResult == 4){
                    //Se trajo la informacion con exito
                    Boolean eligible = fResponse.findValue("eligible").asBoolean();
                    //TODO: guardar en el userID la info de si esta activo o no
                    client.setStatus(eligible ? 1 : 0);
                }else{
                    //ocurrio un error en la llamada
                    throw new Exception(errorMessage);
                }
            }else{
                errorMessage = "Web service call to Upstream failed";
                throw new Exception(errorMessage);
            }
        }else{
            //deberia estar en periodo de pruebas 2 o desactivado por tiempo -1 la verificacion se hace despues de la llamada
            client.setStatus(2);
        }
    }

    //UPSTREAM COMMONS
    //set headers and url call
    private static WSRequestHolder setUpstreamRequest(String url, String username, String password){
        String upstreamAppVersion = Config.getString("upstreamAppVersion"); //gamingapi.v1
        String upstreamAppKey = Config.getString("upstreamAppKey"); //DEcxvzx98533fdsagdsfiou

        String authString = null;
        if(username != null && !username.isEmpty() && password != null && !password.isEmpty()){
            authString = username+":"+password;
            byte[] encodedBytes = Base64.encodeBase64(authString.getBytes());
            authString = new String(encodedBytes);
        }

        //Hacemos la llamada con los headers de autenticacion
        WSRequestHolder urlCall = WS.url(url).setContentType("application/json");
        //FORMAT:  "Authentication: username:password" //BASE64
        //urlCall.setHeader("Authorization","Basic AW4rRRcpbjpvcGVuIHNlc2FtZQ==");
        if(authString != null) urlCall.setHeader("Authorization","Basic "+authString);
        urlCall.setHeader("x-gameapi-app-key",upstreamAppKey);

        //The different versions of the API are defined in the HTTPS Accept header.
        urlCall.setHeader("Accept"," application/"+upstreamAppVersion+"+json");
        urlCall.setMethod("POST");
        return urlCall;
    }
    //set basic POST data for UPSTREAM
    private static ObjectNode getBasicUpstreamPOSTRequestJSON(String upstreamChannel, String push_notification_id){
        String upstreamServiceID = Config.getString("upstreamServiceID"); //prototype-app -SubscriptionDefault
        String upstreamAppVersion = Config.getString("upstreamAppVersion"); //gamingapi.v1

        ObjectNode fields = Json.newObject();
        ObjectNode metadata = Json.newObject();
        fields.put("service_id", upstreamServiceID);
        if(push_notification_id != null && !push_notification_id.isEmpty() && upstreamChannel.equalsIgnoreCase("Android")){
            fields.put("push_notification_id",push_notification_id);
            fields.put("device_id",push_notification_id);
        }
        //"channel":"Android","result":null,"points":null, "app_version":"gamingapi.v1","session_id":null
        metadata.put("channel",upstreamChannel);
        metadata.put("app_version",upstreamAppVersion);
        fields.put("metadata",metadata);
        return fields;
    }
    //get push_notification_id for upstream
    private static String getPushNotificationID(Client client){
        String push_notification_id = null;
        try{
            List<ClientHasDevices> devices = client.getDevices();
            for (int i=0; i<devices.size(); i++){
                if(devices.get(i).getDevice().getName().equalsIgnoreCase("droid")){
                    //con el primer push_notification_id nos basta por ahora
                    push_notification_id = devices.get(i).getRegistrationId();
                    break;
                }
            }
        }catch (Exception e){
            //no hacemos nada si esto falla
        }
        return push_notification_id;
    }

    //0-Success, 2-User cannot be identified, 3-User not Subscribed, 4-push_notification_id missing, 6-push_notification_id already exists, 7-Upstream service no longer available
    private static String getUpstreamError(int errorCode){
        switch (errorCode){
            case 0: return "Success";
            case 1: return "User already subscribed";
            case 2: return "User cannot be identified";
            case 3: return "User not Subscribed";
            case 4: return "Push_notification_id missing";
            case 5: return "Invalid MSISDN";
            case 6: return "Push_notification_id already exists";
            case 7: return "Upstream service no longer available";
            default: return "Error not recognized";
        }
    }

    //check response status
    private static void checkUpstreamResponseStatus(WSResponse wsResponse, Client client) throws Exception {
        int wsStatus = wsResponse.getStatus();
        if(wsStatus == 200){
            //all OK
        }else{
            if(wsStatus == 400 || wsStatus == 403 || wsStatus == 404 || wsStatus == 500 || wsStatus == 503){
                throw new Exception("Upstream service: "+ wsResponse.getUri() +" fails with status: "+wsStatus);
            }else{
                if(wsStatus == 401){
                    //la combinacion login:password es incorrecta, borramos el password
                    client.setPassword("");
                    throw new UpstreamAuthenticationFailureException("Upstream service: "+ wsResponse.getUri() +" fails authentication");
                }else{
                    throw new Exception("Upstream service: "+ wsResponse.getUri() +" fails with unknown status: "+wsStatus);
                }
            }
        }
    }

    //“dd/MM/yy HH:mm:ss.SSS UTC” (TZ is always UTC)
    private static String formatDateUpstream() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yy HH:mm:ss.SSS");
        String date = sdf.format(new Date());
        date = date+" UTC";
        return date;
    }
      
    //FAKE UPSTREAM RESPONSE
    public static Result upstreamFakeCreate() {
        Http.Request req = Http.Context.current().request();
        Map<String, String[]> headerMap = req.headers();
        boolean hasAuth = false;
        for (String headerKey : headerMap.keySet()) {
            if(headerKey.equals("Authorization")){
                hasAuth = true;
            }
            //System.out.println("Key: " + headerKey + " - Value: " + headerMap.get(headerKey)[0]);
        }
        ObjectNode response = Json.newObject();
        response.put("result",0);
        response.put(upstreamUserIDSubscriptionResponseTag,"324234345050505");
        return ok(response);
    }
    public static Result upstreamFakeLogin() {
        Http.Request req = Http.Context.current().request();
        Map<String, String[]> headerMap = req.headers();
        boolean hasAuth = false;
        for (String headerKey : headerMap.keySet()) {
            if(headerKey.equals("Authorization")){
                hasAuth = true;
            }
            //System.out.println("Key: " + headerKey + " - Value: " + headerMap.get(headerKey)[0]);
        }
        ObjectNode response = Json.newObject();
        if(!hasAuth){
            response.put("result",2);
        }else{
            response.put("result",0);
        }
        response.put("user_id","324234345050505");
        return ok(response);
    }
    public static Result upstreamFakeStatus() {
        Http.Request req = Http.Context.current().request();
        Map<String, String[]> headerMap = req.headers();
        boolean hasAuth = false;
        for (String headerKey : headerMap.keySet()) {
            if(headerKey.equals("Authorization")){
                hasAuth = true;
            }
            //System.out.println("Key: " + headerKey + " - Value: " + headerMap.get(headerKey)[0]);
        }
        ObjectNode response = Json.newObject();
        if(!hasAuth){
            response.put("eligible",false);
        }else{
            response.put("eligible",true);
        }
        response.put("result",0);

        response.put("credits_left",10);
        return ok(response);
    }
    public static Result upstreamFakeResetPass() {
        ObjectNode response = Json.newObject();
        response.put("result",0);
        return ok(response);
    }
    public static Result upstreamFakeEventSend() {
        ObjectNode response = Json.newObject();
        response.put("result",0);
        return ok(response);
    }
}
