package controllers.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import exceptions.UpstreamAuthenticationFailureException;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.clients.*;
import models.content.athletes.Athlete;
import models.content.posts.Category;
import org.apache.commons.codec.binary.Base64;
import play.libs.ws.WSResponse;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;
import play.libs.ws.WSRequestHolder;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Results;
import utils.Utils;

import java.io.File;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by plesse on 9/30/14.
 */
//@Security.Authenticated(Secured.class)
public class Clients extends HecticusController {

    //private static final String upstreamUserIDSubscriptionResponseTag = "user_id"; //segun documentacion
    private static final String upstreamUserIDSubscriptionResponseTag = "userId"; //segun pruebas

    public static Result create() {
        ObjectNode clientData = getJson();
        try {
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
            boolean update = false;
            if(login != null) {
                client = Client.getByLogin(login);
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
            }
            UUID session = UUID.randomUUID();
            if (client != null) {
                //actualizar regID
                if (clientData.has("devices")) {
                    Iterator<JsonNode> devicesIterator = clientData.get("devices").elements();
                    while (devicesIterator.hasNext()) {
                        ObjectNode next = (ObjectNode) devicesIterator.next();
                        if (next.has("device_id") && next.has("registration_id")) {
                            String registrationId = next.get("registration_id").asText();
                            int deviceId = next.get("device_id").asInt();
                            Device device = Device.getByID(deviceId);
                            ClientHasDevices clientHasDevice = ClientHasDevices.getByForClientRegistrationIdDevice(client, registrationId, device);
                            if (clientHasDevice == null) {
                                clientHasDevice = new ClientHasDevices(client, device, registrationId);
                                client.getDevices().add(clientHasDevice);
                            }
                            otherRegsIDs = ClientHasDevices.getByNotForClientRegistrationIdDevice(client, registrationId, device);
                            if (otherRegsIDs != null && !otherRegsIDs.isEmpty()) {
                                for (ClientHasDevices clientHasDevices : otherRegsIDs) {
                                    clientHasDevices.delete();
                                }
                            }
                        }
                    }
                    client.setSession(session.toString());
                    client.update();
                }
                return ok(buildBasicResponse(0, "OK", client.toJson()));
            } else if (clientData.has("country") && clientData.has("language")) {
                int countryId = clientData.get("country").asInt();
                Country country = Country.getByID(countryId);
                int languageId = clientData.get("language").asInt();
                Language language = Language.getByID(languageId);
                if (country != null && language != null) {
                    TimeZone tz = TimeZone.getDefault();
                    Calendar actualDate = new GregorianCalendar(tz);
                    SimpleDateFormat sf = new SimpleDateFormat("yyyyMMdd");
                    String date = sf.format(actualDate.getTime());

                    client = new Client(2, login, password, country, date, language);
                    ArrayList<ClientHasDevices> devices = new ArrayList<>();

                    if(clientData.has("devices")) {
                        Iterator<JsonNode> devicesIterator = clientData.get("devices").elements();
                        while (devicesIterator.hasNext()) {
                            ObjectNode next = (ObjectNode) devicesIterator.next();
                            if (next.has("device_id") && next.has("registration_id")) {
                                String registrationId = next.get("registration_id").asText();
                                int deviceId = next.get("device_id").asInt();
                                Device device = Device.getByID(deviceId);
                                if (device != null) {
                                    ClientHasDevices clientHasDevice = new ClientHasDevices(client, device, registrationId);
                                    devices.add(clientHasDevice);
                                    otherRegsIDs = ClientHasDevices.getListByRegistrationIdDevice(registrationId, device);
                                    if (otherRegsIDs != null && !otherRegsIDs.isEmpty()) {
                                        for (ClientHasDevices clientHasDevices : otherRegsIDs) {
                                            clientHasDevices.delete();
                                        }
                                    }
                                }
                            }
                        }
                        client.setDevices(devices);
                    }
                    if (client.getPassword() != null && !client.getPassword().isEmpty()) {
                        getUserIdFromUpstream(client, upstreamChannel);
                    } else {
                        subscribeUserToUpstream(client, upstreamChannel);
                    }
                    getStatusFromUpstream(client, upstreamChannel);

                    if (clientData.has("athletes")) {
                        Iterator<JsonNode> athletesIterator = clientData.get("athletes").elements();
                        ArrayList<ClientHasAthlete> athletes = new ArrayList<>();
                        while (athletesIterator.hasNext()) {
                            JsonNode next = athletesIterator.next();
                            Athlete athlete = Athlete.getByID(next.asInt());
                            if (athlete != null) {
                                ClientHasAthlete chw = new ClientHasAthlete(client, athlete);
                                athletes.add(chw);
                            }
                        }
                        if (!athletes.isEmpty()) {
                            client.setAthletes(athletes);
                        }
                    }

                    if (clientData.has("categories")) {
                        Iterator<JsonNode> categoriesIterator = clientData.get("categories").elements();
                        ArrayList<ClientHasCategory> categories = new ArrayList<>();
                        while (categoriesIterator.hasNext()) {
                            JsonNode next = categoriesIterator.next();
                            Category category = Category.getByID(next.asInt());
                            if (category != null) {
                                ClientHasCategory clientHasCategory = new ClientHasCategory(client, category);
                                categories.add(clientHasCategory);
                            }
                        }
                        if (!categories.isEmpty()) {
                            client.setCategories(categories);
                        }
                    }
                    client.setSession(session.toString());
                    if(clientData.has("facebook_id")){
                        client.setFacebookId(clientData.get("facebook_id").asText());
                    }
                    if(clientData.has("nickname")){
                        client.setNickname(clientData.get("nickname").asText());
                    }
                    client.save();
                    return created(buildBasicResponse(0, "OK", client.toJson()));
                } else {
                    return notFound(buildBasicResponse(3, "pais invalido"));
                }
            } else {
                return badRequest(buildBasicResponse(2, "Faltan campos para crear el registro"));
            }
        } catch (UpstreamAuthenticationFailureException ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error creando client por autenticacion con params " + clientData, false, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-1, "ocurrio un error creando el registro", ex));
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error creando client con params " + clientData, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        ObjectNode clientData = getJson();
        try{
            Client client = Client.getByID(id);
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
                    Language language = Language.getByID(languageId);
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
                            Device device = Device.getByID(deviceId);
                            if (device != null) {
                                int index = client.getDeviceIndex(registrationId, device);
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
                            Device device = Device.getByID(deviceId);
                            if (device != null) {
                                if(client.getDeviceIndex(registrationId, device) == -1) {
                                    ClientHasDevices clientHasDevice = new ClientHasDevices(client, device, registrationId);
                                    client.getDevices().add(clientHasDevice);
                                    update = true;
                                }
                            }
                            otherRegsIDs = ClientHasDevices.getByNotForClientRegistrationIdDevice(client, registrationId, device);
                            if(otherRegsIDs != null && !otherRegsIDs.isEmpty()){
                                for(ClientHasDevices clientHasDevices : otherRegsIDs){
                                    clientHasDevices.delete();
                                }
                            }
                        }
                    }
                }

                if(clientData.has("remove_athlete")){
                    Iterator<JsonNode> athletesIterator = clientData.get("remove_athlete").elements();
                    while (athletesIterator.hasNext()) {
                        JsonNode next = athletesIterator.next();
                        Athlete athlete = Athlete.getByID(next.asInt());
                        if(athlete == null){
                            continue;
                        }
                        ClientHasAthlete clientHasAthlete = client.getAthleteRelation(athlete);
                        if(clientHasAthlete != null){
                            client.getAthletes().remove(clientHasAthlete);
                            clientHasAthlete.delete();
                            update = true;
                        }
                    }
                }

                if(clientData.has("add_athlete")) {
                    Iterator<JsonNode> athletesIterator = clientData.get("add_athlete").elements();
                    while (athletesIterator.hasNext()) {
                        JsonNode next = athletesIterator.next();
                        Athlete athlete = Athlete.getByID(next.asInt());
                        int index = client.getAthleteIndex(athlete);
                        if (index == -1 && athlete != null) {
                            ClientHasAthlete chw = new ClientHasAthlete(client, athlete);
                            client.getAthletes().add(chw);
                            update = true;
                        }
                    }
                }

                if(clientData.has("remove_category")){
                    Iterator<JsonNode> categoriesIterator = clientData.get("remove_category").elements();
                    while (categoriesIterator.hasNext()) {
                        JsonNode next = categoriesIterator.next();
                        Category category = Category.getByID(next.asInt());
                        if(category == null){
                            continue;
                        }
                        ClientHasCategory clientHasCategory = client.getCategoryRealtion(category);
                        if(clientHasCategory != null){
                            client.getCategories().remove(clientHasCategory);
                            clientHasCategory.delete();
                            update = true;
                        }
                    }
                }

                if(clientData.has("add_category")) {
                    Iterator<JsonNode> categoriesIterator = clientData.get("add_category").elements();
                    while (categoriesIterator.hasNext()) {
                        JsonNode next = categoriesIterator.next();
                        Category category = Category.getByID(next.asInt());
                        int index = client.getCategoryIndex(category);
                        if (index == -1 && category != null) {
                            ClientHasCategory clientHasCategory = new ClientHasCategory(client, category);
                            client.getCategories().add(clientHasCategory);
                            update = true;
                        }
                    }
                }

                if(clientData.has("facebook_id")){
                    String facebookId = clientData.get("facebook_id").asText();
                    String clientFacebookId = client.getFacebookId();
                    if(clientFacebookId == null || !facebookId.equalsIgnoreCase(clientFacebookId)) {
                        client.setFacebookId(facebookId);
                        update = true;
                    }
                }

                if(clientData.has("nickname")){
                    client.setNickname(clientData.get("nickname").asText());
                    update = true;
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
                return ok(buildBasicResponse(0, "OK", client.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a eliminar"));
            }
//        } catch (InvalidLoginException ex) {
//            Utils.printToLog(Clients.class, "Error manejando clients", "Login invalido " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
//            return Results.badRequest(buildBasicResponse(4, "ocurrio un error actualizando el registro", ex));
//        } catch (InvalidPasswordException ex) {
//            Utils.printToLog(Clients.class, "Error manejando clients", "Login invalido " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
//            return Results.badRequest(buildBasicResponse(5, "ocurrio un error actualizando el registro", ex));
//        } catch (UpstreamTimeoutException ex) {
//            Utils.printToLog(Clients.class, "Error manejando clients", "Login invalido " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
//            return Results.badRequest(buildBasicResponse(6, "ocurrio un error actualizando el registro", ex));

        } catch (UpstreamAuthenticationFailureException ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error actualizando client por autenticacion con params " + clientData, false, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(2, "ocurrio un error actualizando el registro", ex));
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error actualizando el client " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(3, "ocurrio un error actualizando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            Client client = Client.getByID(id);
            if(client != null) {
                client.delete();
                return ok(buildBasicResponse(0, "OK", client.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a eliminar"));
            }
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error eliminando el client " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id, String upstreamChannel, Boolean pmc){
        try {
            Client client = Client.getByID(id);
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
                return ok(buildBasicResponse(0, "OK", pmc?client.toPMCJson():client.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a consultar"));
            }
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error obteniendo el client " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page, Boolean pmc){
        try {
            Iterator<Client> clientIterator = Client.getPage(pageSize, page);
            ArrayList<ObjectNode> clients = new ArrayList<ObjectNode>();
            while(clientIterator.hasNext()){
                clients.add(pmc?clientIterator.next().toPMCJson():clientIterator.next().toJson());
            }
            return ok(buildBasicResponse(0, "OK", Json.toJson(clients)));
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error listando clients con pageSize " + pageSize + " y " + page, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-1,"Error buscando el registro",e));
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
                    List<ClientHasDevices> devs = ClientHasDevices.getListByRegistrationIdDeviceName(actualId,type);
                    for(ClientHasDevices d : devs) {
                        if(action.equalsIgnoreCase("UPDATE")){
                            d.setRegistrationId(operation.get("new_id").asText());
                            d.update();
                        } else if(action.equalsIgnoreCase("DELETE")){
                            d.delete();
                        }
                    }
                    if(operation.has("new_id")) {
                        devs = ClientHasDevices.getListByRegistrationIdDeviceName(operation.get("new_id").asText(), type);
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
            return internalServerError(buildBasicResponse(1, "Error buscando el registro", ex));
        }
    }

    public static Result getLocale(String lang){
        try {
            Language language = Language.getLanguageByShortName(lang);
            if(language != null) {
                String filePath = Config.getString("locales-path") + language.getAppLocalizationFile();
                if(filePath != null && !filePath.isEmpty()){
                    File file = new File(filePath);
                    if(file != null && file.exists()){
                        byte[] encoded = Files.readAllBytes(Paths.get(filePath));
                        String localization =  new String(encoded, StandardCharsets.UTF_8);
                        response().setHeader("Content-Type", "application/json");
                        return ok(localization);
                    } else {
                        return notFound();
                    }
                }else {
                    return notFound();
                }
            }else {
                return notFound();
            }
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando Idiomas", "error obteniendo localizacion ", true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando localizacion",e));
        }
    }

    public static Result setLocale(String lang){
        try {
            ObjectNode locale = getJson();
            Language language = Language.getLanguageByShortName(lang);
            if(language != null) {
                StringBuilder filePath = new StringBuilder();
                filePath.append(Config.getString("locales-path"));
                String appLocalizationFile = language.getAppLocalizationFile();
                boolean update = false;
                if(appLocalizationFile != null && !appLocalizationFile.isEmpty()){
                    filePath.append(appLocalizationFile);
                } else {
                    filePath.append("locale-").append(lang).append(".json");
                    language.setAppLocalizationFile("locale-"+lang+".json");
                    update = true;
                }
                PrintWriter writer = new PrintWriter(filePath.toString(), "UTF-8");
                writer.println(locale);
                writer.close();
                if(update){
                    language.update();
                }
                return created(locale);
            }else {
                return notFound();
            }
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando Idiomas", "error creando localizacion ", true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando localizacion",e));
        }
    }

    public static Result getFavorites(Integer id, Boolean categories) {
        try {
            Client client = Client.getByID(id);
            if(client != null) {
                if(client.getStatus() >= 0) {
                    ArrayList favorites = new ArrayList();
                    if(categories){
                        ArrayList<Category> realCategories = client.getRealCategories();
                        for(int i=0; i<realCategories.size(); i++){
                            favorites.add(realCategories.get(i).toJson());
                        }
                    } else {
                        List<ClientHasAthlete> athletes = client.getAthletes();
                        for (int i = 0; i < athletes.size(); i++) {
                            favorites.add(athletes.get(i).getAthlete().toJson());
                        }
                    }
                    return ok(buildBasicResponse(0, "OK", Json.toJson(favorites)));
                }else{
                    return forbidden(buildBasicResponse(3, "cliente no se encuentra en status valido"));
                }

            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a consultar"));
            }
        }catch (Exception e) {
            Utils.printToLog(Clients.class, "Error manejando clients", "error obteniendo la lista de mujeres para el client " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
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
                client = Client.getByLogin(msisdn);
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
            ObjectNode metadata = null;
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
                client = Client.getByUserId(user_id);
            }
            //buscamos el event_type
            if(clientData.has("event_type")){
                event_type = clientData.get("event_type").asText();
            }

            if(clientData.has("metadata")){
                metadata = (ObjectNode) clientData.get("metadata");
            }

            if(client != null && (event_type != null || !event_type.isEmpty())) {
                sendEventForUpstream(client,upstreamChannel,event_type, metadata);
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

    public static Result sendClientEvent(Integer id) {
        String user_id = null;
        String event_type = null;
        try{
            ObjectNode clientData = getJson();
            if(clientData == null){
                return badRequest(buildBasicResponse(1, "Falta el json con los parametros del request"));
            }
            Client client = Client.getByID(id);
            if(client != null) {
                user_id = client.getUserId();
                ObjectNode metadata = null;
                //Obtenemos el canal por donde esta llegando el request
                String upstreamChannel;
                if (clientData.has("upstreamChannel")) {
                    upstreamChannel = clientData.get("upstreamChannel").asText();
                } else {
                    upstreamChannel = "Android"; //"Android" o "Web"
                }
                //buscamos el event_type
                if (clientData.has("event_type")) {
                    event_type = clientData.get("event_type").asText();
                }

                if (clientData.has("metadata")) {
                    metadata = (ObjectNode) clientData.get("metadata");
                }

                if (event_type != null || !event_type.isEmpty()) {
                    sendEventForUpstream(client, upstreamChannel, event_type, metadata);
                    return ok(buildBasicResponse(0, "OK", client.toJson()));
                } else {
                    return badRequest(buildBasicResponse(3, "Falta el tipo de evento"));
                }
            } else {
                return notFound(buildBasicResponse(2, "no existe el cliente " + id));
            }
        } catch (Exception ex) {
            Utils.printToLog(Clients.class, "Error enviando evento", "error al enviar un evento a Upstream del client " + user_id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(-1, "ocurrio un error enviando evento", ex));
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
        String upstreamGuestUser = Config.getString("upstreamGuestUser");
        if(client.getLogin() == null || client.getLogin().equalsIgnoreCase(upstreamGuestUser)){
            if(client.getLogin() == null){
                client.setLogin(upstreamGuestUser);
            }
            if(client.getPassword() == null){
                client.setPassword(Config.getString("upstreamGuestPassword"));
            }
            if(client.getUserId() == null){
                client.setUserId(Config.getString("upstreamUserID"));
            }
            client.setStatus(2);
        } else {
            String msisdn = client.getLogin();
            String password = client.getPassword();
            String push_notification_id = null;

//            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client, upstreamChannel);
//            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/subscribe";

            WSRequestHolder urlCall = setUpstreamRequest(url, msisdn, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id, null);
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
//            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client, upstreamChannel);
//            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/subscribe";

            WSRequestHolder urlCall = setUpstreamRequest(url, login, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id, null);
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
        String upstreamGuestUser = Config.getString("upstreamGuestUser");
        if(client.getLogin() == null || client.getLogin().equalsIgnoreCase(upstreamGuestUser)){
            if(client.getLogin() == null){
                client.setLogin(upstreamGuestUser);
            }
            if(client.getPassword() == null){
                client.setPassword(Config.getString("upstreamGuestPassword"));
            }
            if(client.getUserId() == null){
                client.setUserId(Config.getString("upstreamUserID"));
            }
            client.setStatus(2);
        } else {
            String username = client.getLogin();
            String password = client.getPassword();
            //String channel = "Android";
            String push_notification_id = null;
//            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client, upstreamChannel);
//            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/login";

            WSRequestHolder urlCall = setUpstreamRequest(url, username, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id, null);
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
        String upstreamGuestUser = Config.getString("upstreamGuestUser");
        if(client.getLogin() != null && client.getUserId() != null && client.getPassword() != null && !client.getLogin().equalsIgnoreCase(upstreamGuestUser)){
            String username = client.getLogin();
            String userID = client.getUserId();
            String password = client.getPassword();
            String push_notification_id = null;
//            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client, upstreamChannel);
//            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/status";

            //Hacemos la llamada con los headers de autenticacion
            WSRequestHolder urlCall = setUpstreamRequest(url, username, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id, null);
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
                    client.setStatus(eligible ? 1 : -1);
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
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id, null);
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
    private static void sendEventForUpstream(Client client, String upstreamChannel, String event_type, ObjectNode metadata) throws Exception{
        if(client.getLogin() != null && client.getUserId() != null && client.getPassword() != null){
            String username = client.getLogin();
            String userID = client.getUserId();
            String password = client.getPassword();
            String push_notification_id = null;
//            if(upstreamChannel.equalsIgnoreCase("Android")){
                push_notification_id = getPushNotificationID(client, upstreamChannel);
//            }

            //Data from configs
            String upstreamURL = Config.getString("upstreamURL");
            String url = upstreamURL+"/game/user/event";

            //Hacemos la llamada con los headers de autenticacion
            WSRequestHolder urlCall = setUpstreamRequest(url, username, password);

            //llenamos el JSON a enviar
            ObjectNode fields = getBasicUpstreamPOSTRequestJSON(upstreamChannel, push_notification_id, metadata);
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
                    if(fResponse.has("eligible")) {
                        //Se trajo la informacion con exito
                        Boolean eligible = fResponse.findValue("eligible").asBoolean();
                        //TODO: guardar en el userID la info de si esta activo o no
                        client.setStatus(eligible ? 1 : 0);
                    }
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
        urlCall.setHeader("Accept","application/"+upstreamAppVersion+"+json");
        urlCall.setMethod("POST");
        return urlCall;
    }
    //set basic POST data for UPSTREAM
    private static ObjectNode getBasicUpstreamPOSTRequestJSON(String upstreamChannel, String push_notification_id, ObjectNode metadata){
        String upstreamServiceID = Config.getString("upstreamServiceID"); //prototype-app -SubscriptionDefault
        String upstreamAppVersion = Config.getString("upstreamAppVersion"); //gamingapi.v1

        ObjectNode fields = Json.newObject();
        if(metadata == null) {
            metadata = Json.newObject();
        }
        fields.put("service_id", upstreamServiceID);
        if(push_notification_id != null && !push_notification_id.isEmpty()){// && upstreamChannel.equalsIgnoreCase("Android")){
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
    private static String getPushNotificationID(Client client, String channel){
        String push_notification_id = null;
        try{
            List<ClientHasDevices> devices = client.getDevices();
            for (int i=0; i<devices.size(); i++){
                if(devices.get(i).getDevice().getName().equalsIgnoreCase(channel)){
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
