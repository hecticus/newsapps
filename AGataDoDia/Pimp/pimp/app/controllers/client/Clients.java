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
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;
import utils.Utils;

import java.text.SimpleDateFormat;
import java.util.*;

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
            if(clientData.has("login")){
                login = clientData.get("login").asText();
                password = clientData.get("password").asText();
            }
            if(login != null){
                client = Client.finder.where().eq("login",login).findUnique();
                boolean update = false;
                if(client.getUserId() == null){
                    getUserIdFromUpstream(client);
                    update = true;
                }
                if(client.getStatus() <= 0){
                    getStatusFromUpstream(client);
                    update = true;
                }
                if(update){
                    client.update();
                }
            }
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
                            if(login != null && !login.isEmpty() && password != null && !password.isEmpty()){
                                client.setLogin(login);
                                client.setPassword(password);
                                getUserIdFromUpstream(client);
                                getStatusFromUpstream(client);
                                client.update();
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
                    getUserIdFromUpstream(client);
                    getStatusFromUpstream(client);
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

                if(loginAgain && (client.getLogin() != null && !client.getLogin().isEmpty()) && (client.getPassword() != null && !client.getPassword().isEmpty())){
                    getUserIdFromUpstream(client);
                    getStatusFromUpstream(client);
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

    public static Result get(Integer id, Boolean pmc){
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
                            int status = getStatusFromUpstream(client);
                            client.setStatus(status);
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

    private static void getUserIdFromUpstream(Client client) {
        if(client.getLogin() == null){
            client.setStatus(2);
        } else {
            //TODO: llamar a upstream
            client.setStatus(1);
            client.setUserId("FAKE_ID");
        }
    }

    private static int getStatusFromUpstream(Client client) {
        if(client.getLogin() == null){
            return -1;
        }
        return 1;
    }
}
