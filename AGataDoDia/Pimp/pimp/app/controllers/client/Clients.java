package controllers.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import exceptions.InvalidLoginException;
import exceptions.InvalidPasswordException;
import exceptions.UpstreamTimeoutException;
import models.basic.Config;
import models.basic.Country;
import models.clients.Client;
import models.clients.ClientHasDevices;
import models.clients.ClientHasWoman;
import models.clients.Device;
import models.content.women.Woman;
import org.apache.commons.codec.binary.Base64;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSRequestHolder;
import play.mvc.Result;
import play.mvc.Results;
import utils.Utils;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by plesse on 9/30/14.
 */
public class Clients extends HecticusController {

    public static Result create() {
        ObjectNode clientData = getJson();
        try {
            ObjectNode response = null;
            Client client = null;
            String login = null;
            String password = null;
            //Obtenemos el canal por donde esta llegando el request
            String upstreamChannel;
            if(clientData.has("upstreamChannel")){
                upstreamChannel = clientData.get("upstreamChannel").asText();
            }else{
                upstreamChannel = "Android"; //"Android" o "Web"
            }
            if(clientData.has("login")){
                login = clientData.get("login").asText();
                password = clientData.get("password").asText();
            }
            if(login != null){
                client = Client.finder.where().eq("login",login).findUnique();
                boolean update = false;
                if(client != null){
                    if(client.getUserId() == null){
                        //si tenemos password tratamos de hacer login
                        if(password != null && !password.isEmpty()){
                            client.setPassword(password);
                            getUserIdFromUpstream(client,upstreamChannel);
                        }else{
                            //tratamos de crear al cliente
                            subscribeUserToUpstream(client,upstreamChannel);
                        }
                        update = true;
                    }
                    if(client.getStatus() <= 0){
                        getStatusFromUpstream(client,upstreamChannel);
                        update = true;
                    }
                    if(update){
                        client.update();
                    }
                }
            }
            //tratamos de buscar un cliente por registrationID si no existe se crea uno
            if(client == null){
                Iterator<JsonNode> devicesIterator = clientData.get("devices").elements();
                while (devicesIterator.hasNext()){
                    ObjectNode next = (ObjectNode)devicesIterator.next();
                    if(next.has("device_id") && next.has("registration_id")){
                        String registrationId = next.get("registration_id").asText();
                        int deviceId = next.get("device_id").asInt();
                        ClientHasDevices clientHasDevice = ClientHasDevices.finder.where().eq("registrationId", registrationId).eq("device.idDevice", deviceId).findUnique();
                        if(clientHasDevice != null){
                            client = clientHasDevice.getClient();
                            if(login != null && !login.isEmpty()){
                                if(password != null && !password.isEmpty()){
                                    client.setLogin(login);
                                    client.setPassword(password);
                                    getUserIdFromUpstream(client,upstreamChannel);
                                    getStatusFromUpstream(client,upstreamChannel);
                                    client.update();
                                }else{
                                    //si no tiene password tratamos de suscribirlo
                                    client.setLogin(login);
                                    client.setPassword(password);
                                    subscribeUserToUpstream(client,upstreamChannel);
                                    getStatusFromUpstream(client,upstreamChannel);
                                    client.update();
                                }
                            }
                            break;
                        }
                    }
                }
            }
            if(client != null){
                response = buildBasicResponse(0, "OK", client.toJson());
                return ok(response);
            }
            if (clientData.has("country")) {
                int countryId = clientData.get("country").asInt();
                Country country = Country.finder.byId(countryId);
                if (country != null) {
                    TimeZone tz = TimeZone.getDefault();
                    Calendar actualDate = new GregorianCalendar(tz);
                    SimpleDateFormat sf = new SimpleDateFormat("yyyyMMdd");
                    String date = sf.format(actualDate.getTime());

                    client = new Client(2, login, password, country, date);
                    getUserIdFromUpstream(client,upstreamChannel);
                    getStatusFromUpstream(client,upstreamChannel);
                    Iterator<JsonNode> devicesIterator = clientData.get("devices").elements();
                    ArrayList<ClientHasDevices> devices = new ArrayList<>();
                    while (devicesIterator.hasNext()){
                        ObjectNode next = (ObjectNode)devicesIterator.next();
                        if(next.has("device_id") && next.has("registration_id")){
                            String registrationId = next.get("registration_id").asText();
                            int deviceId = next.get("device_id").asInt();
                            Device device = Device.finder.byId(deviceId);
                            if(device != null) {
                                ClientHasDevices clientHasDevice = new ClientHasDevices(client, device, registrationId);
                                devices.add(clientHasDevice);
                            }
                        }
                    }
                    if(devices.isEmpty()){
                        response = buildBasicResponse(4, "Faltan campos para crear el registro");
                        return ok(response);
                    }
                    client.setDevices(devices);

                    if(clientData.has("women")){
                        Iterator<JsonNode> womenIterator = clientData.get("women").elements();
                        ArrayList<ClientHasWoman> women = new ArrayList<>();
                        while (womenIterator.hasNext()){
                            JsonNode next = womenIterator.next();
                            Woman woman = Woman.finder.byId(next.asInt());
                            if(woman != null){
                                ClientHasWoman chw = new ClientHasWoman(client, woman);
                                women.add(chw);
                            }
                        }
                        if(!women.isEmpty()){
                            client.setWomen(women);
                        }
                    }
                    client.save();
                    response = buildBasicResponse(0, "OK", client.toJson());
                } else {
                    response = buildBasicResponse(3, "pais invalido");
                }
            } else {
                response = buildBasicResponse(1, "Faltan campos para crear el registro");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error creando client con params " + clientData, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id, String upstreamChannel) {
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

                if(loginAgain && (client.getLogin() != null && !client.getLogin().isEmpty()) && (client.getPassword() != null && !client.getPassword().isEmpty())){
                    getUserIdFromUpstream(client,upstreamChannel);
                    getStatusFromUpstream(client,upstreamChannel);
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
                        }
                    }
                }

                if(clientData.has("remove_woman")){
                    Iterator<JsonNode> devicesIterator = clientData.get("remove_devices").elements();
                    ArrayList<ClientHasDevices> devices = new ArrayList<>();
                    while (devicesIterator.hasNext()) {
                        JsonNode next = devicesIterator.next();
                        int index = client.getWomanIndex(next.asInt());
                        if (index != -1) {
                            client.getWomen().remove(index);
                            update = true;
                        }
                    }
                }

                if(clientData.has("add_woman")) {
                    Iterator<JsonNode> devicesIterator = clientData.get("add_devices").elements();
                    while (devicesIterator.hasNext()) {
                        JsonNode next = devicesIterator.next();
                        int index = client.getWomanIndex(next.asInt());
                        if (index == -1) {
                            Woman woman = Woman.finder.byId(next.asInt());
                            if (woman != null) {
                                ClientHasWoman chw = new ClientHasWoman(client, woman);
                                client.getWomen().add(chw);
                                update = true;
                            }
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
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error actualizando el registro", ex));
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
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id, Boolean pmc, String upstreamChannel){
        try {
            ObjectNode response = null;
            Client client = Client.finder.byId(id);
            if(client != null) {
                if(client.getStatus() >= 0) {
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

    //FUNCIONES DE UPSTREAM

    /**
     * Funcion que permite suscribir al usuario en Upstream dado su msisdn(username)
     *
     * POST data as JSON:
     * msisdn       String  mandatory   msisdn from user (login)
     * google_id    String  optional    push id
     * password     String  mandatory   password sent from SMS to the user
     * service_id   String  mandatory   Upstream suscription service
     * metadata     JSON    optional    extra params
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 1-User already subscribed, 2-User cannot be identified, 3-User not Subscribed, 5-Invalid MSISDN, 6-google id already exists, 7-Upstream service no longer available
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
     * "msisdn":"999000000005","google_id":"wreuoi24lkjfdlkshjkjq4h35k13jh43kjhfkjqewhrtkqjrewht"}
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
     * googleID  optional, regID of user
     * channel   "Android" or "Web"
     *
     */
    private static void subscribeUserToUpstream(Client client, String upstreamChannel) throws Exception{
        if(client.getLogin() == null){
            client.setStatus(2);
        } else {
            String msisdn = client.getLogin();
            String password = client.getPassword();
            String googleID = null;

            if(upstreamChannel.equalsIgnoreCase("Android")){
                googleID = getGoogleID(client);
            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/subscribe";

            WSRequestHolder urlCall = setUpstreamRequest(url, msisdn, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, googleID);
            //agregamos el msisdn(username) y el password
            fields.put("password", password);
            fields.put("msisdn", msisdn);

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
            String errorMessage="";
            if(fResponse != null){
                int callResult = fResponse.findValue("result").asInt();
                errorMessage = getUpstreamError(callResult) + " - upstreamResult:"+callResult;
                //TODO: revisar si todos estos casos devuelven con exito la llamada o algunos si se consideran errores
                if(callResult == 0 || callResult == 1 || callResult == 0 || callResult == 6){
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

            client.setStatus(1);
        }
    }

    /**
     * Funcion que permite desuscribir al usuario en Upstream dado su user_id de upstream
     *
     * POST data as JSON:
     * user_id      String  mandatory   upstream user_id
     * google_id    String  optional    push id
     * service_id   String  mandatory   Upstream suscription service
     * metadata     JSON    optional    extra params
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 2-User cannot be identified, 3-User not Subscribed, 4-google id missing, 7-Upstream service no longer available
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
     * "user_id":8001,"google_id":"wreuoi24lkjfdlkshjkjq4h35k13jh43kjhfkjqewhrtkqjrewht"}
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
     * googleID  optional, regID of user
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
            String googleID = null;
            if(upstreamChannel.equalsIgnoreCase("Android")){
                googleID = getGoogleID(client);
            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/subscribe";

            WSRequestHolder urlCall = setUpstreamRequest(url, login, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, googleID);
            //agregamos el user_id
            fields.put("user_id", userID);

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
            if(fResponse != null){
                int callResult = fResponse.findValue("result").asInt();
                errorMessage = getUpstreamError(callResult) + " - upstreamResult:"+callResult;
                if(callResult == 0){
                    //TODO: Que se debe hacer en el caso que la desuscripcion sea exitosa, borrar al cliente, ponerlo en status 2 para que con la fecha se actualice?
                    client.setStatus(2);
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

            client.setStatus(1);
        }
    }

    /**
     * Funcion que permite hacer login del usuario en Upstream dado un username y un password
     *
     * POST data as JSON:
     * username     String  mandatory   user name
     * google_id    String  optional    push id
     * password     String  mandatory   password sent from SMS to the user
     * service_id   String  mandatory   Upstream suscription service
     * metadata     JSON    optional    extra params
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 2-User cannot be identified, 3-User not Subscribed, 6-google id already exists, 7-Upstream service no longer available
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
     * "username":"999000000005","google_id":"wreuoi24lkjfdlkshjkjq4h35k13jh43kjhfkjqewhrtkqjrewht"}
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
     * googleID  optional, regID of user
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
            String googleID = null;
            if(upstreamChannel.equalsIgnoreCase("Android")){
                googleID = getGoogleID(client);
            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/login";

            WSRequestHolder urlCall = setUpstreamRequest(url, username, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, googleID);
            //agregamos el username y el password
            fields.put("password", password);
            fields.put("username", username);

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
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

            client.setStatus(1);
        }
    }

    /**
     * Funcion que permite obtener el status de una suscripcion en Upstream
     *
     * POST data as JSON:
     * user_id      String  mandatory   upstream user_id
     * google_id    String  optional    push id
     * service_id   String  mandatory   Upstream suscription service
     * metadata     JSON    optional    extra params
     *
     * OUTPUT JSON FROM UPSTREAM:
     * result       int     0-Success, 2-User cannot be identified, 3-User not Subscribed, 4-google id missing, 7-Upstream service no longer available
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
     * "user_id":8001,"google_id":"wreuoi24lkjfdlk13jh45kjhfkjqewhrt34jrewh2"}
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
     * googleID  optional, regID of user
     * channel   "Android" or "Web"
     *
     */
    private static void getStatusFromUpstream(Client client, String upstreamChannel) throws Exception{
        if(client.getLogin() == null && client.getUserId() == null){
            String username = client.getLogin();
            String userID = client.getUserId();
            String password = client.getPassword();
            String googleID = null;
            if(upstreamChannel.equalsIgnoreCase("Android")){
                googleID = getGoogleID(client);
            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/status";

            //Hacemos la llamada con los headers de autenticacion
            WSRequestHolder urlCall = setUpstreamRequest(url, username, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, googleID);
            fields.put("user_id", userID); //agregamos el UserID al request

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
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
     * msisdn       String  mandatory   upstream user_id
     * google_id    String  optional    push id
     * service_id   String  mandatory   Upstream suscription service
     * metadata     JSON    optional    extra params
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
     * googleID  optional, regID of user
     * channel   "Android" or "Web"
     *
     */
    private static void resetPasswordForUpstream(Client client, String upstreamChannel) throws Exception{
        String errorMessage = "";
        if(client.getLogin() == null){
            String msisdn = client.getLogin();
            String userID = null;
            String password = null;
            String googleID = null;

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/password";

            //Hacemos la llamada con los headers de autenticacion
            WSRequestHolder urlCall = setUpstreamRequest(url, msisdn, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, googleID);
            fields.put("msisdn", msisdn); //agregamos el UserID al request

            //realizamos la llamada al WS
            F.Promise<play.libs.ws.WSResponse> resultWS = urlCall.post(fields);
            ObjectNode fResponse = Json.newObject();
            fResponse = (ObjectNode)resultWS.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
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

    //UPSTREAM COMMONS
    //set headers and url call
    private static WSRequestHolder setUpstreamRequest(String url, String username, String password){
        String upstreamAppVersion = Config.getString("upstreamAppVersion"); //gamingapi.v1
        String upstreamAppKey = Config.getString("upstreamAppKey"); //DEcxvzx98533fdsagdsfiou

        String authString = null;
        if(username != null && !username.isEmpty() && password != null & !password.isEmpty()){
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
        return urlCall;
    }
    //set basic POST data for UPSTREAM
    private static ObjectNode getBasicUpstreamPOSTRequestJSON(String upstreamChannel, String googleID){
        String upstreamServiceID = Config.getString("upstreamServiceID"); //prototype-app -SubscriptionDefault
        String upstreamAppVersion = Config.getString("upstreamAppVersion"); //gamingapi.v1

        ObjectNode fields = Json.newObject();
        ObjectNode metadata = Json.newObject();
        fields.put("service_id", upstreamServiceID);
        if(googleID != null && !googleID.isEmpty() && upstreamChannel.equalsIgnoreCase("Android")) fields.put("google_id",googleID);
        //"channel":"Android","result":null,"points":null, "app_version":"gamingapi.v1","session_id":null
        metadata.put("channel",upstreamChannel);
        metadata.put("app_version",upstreamAppVersion);
        fields.put("metadata",metadata);
        return fields;
    }
    //get googleID for upstream
    private static String getGoogleID(Client client){
        String googleID = null;
        try{
            List<ClientHasDevices> devices = client.getDevices();
            for (int i=0; i<devices.size(); i++){
                if(devices.get(i).getDevice().getName().equalsIgnoreCase("droid")){
                    //con el primer Google ID nos basta por ahora
                    googleID = devices.get(i).getRegistrationId();
                    break;
                }
            }
        }catch (Exception e){
            //no hacemos nada si esto falla
        }
        return googleID;
    }

    //0-Success, 2-User cannot be identified, 3-User not Subscribed, 4-google id missing, 6-google id already exists, 7-Upstream service no longer available
    private static String getUpstreamError(int errorCode){
        switch (errorCode){
            case 0: return "Success";
            case 1: return "User already subscribed";
            case 2: return "User cannot be identified";
            case 3: return "User not Subscribed";
            case 4: return "Google id missing";
            case 5: return "Invalid MSISDN";
            case 6: return "Google id already exists";
            case 7: return "Upstream service no longer available";
            default: return "Error not recognized";
        }
    }
      
    //FAKE UPSTREAM RESPONSE
    public static Result upstreamFakeCreate() {
        ObjectNode response = Json.newObject();
        response.put("result",0);
        response.put("user_id","324234345050505");
        return ok(response);
    }
    public static Result upstreamFakeLogin() {
        ObjectNode response = Json.newObject();
        response.put("result",0);
        response.put("user_id","324234345050505");
        return ok(response);
    }
    public static Result upstreamFakeStatus() {
        ObjectNode response = Json.newObject();
        response.put("result",0);
        response.put("eligible",true);
        response.put("credits_left",10);
        return ok(response);
    }
    public static Result upstreamFakeResetPass() {
        ObjectNode response = Json.newObject();
        response.put("result",0);
        return ok(response);
    }
}
