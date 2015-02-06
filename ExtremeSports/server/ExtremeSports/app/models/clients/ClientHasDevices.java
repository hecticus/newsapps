package models.clients;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.content.athletes.Athlete;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.Iterator;
import java.util.List;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="client_has_devices")
public class ClientHasDevices extends HecticusModel {

    @Id
    private Integer idClientHasDevices;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "id_device")
    private Device device;

    @Constraints.Required
    private String registrationId;

    private static Model.Finder<Integer, ClientHasDevices> finder = new Model.Finder<Integer, ClientHasDevices>(Integer.class, ClientHasDevices.class);

    public ClientHasDevices(Client client, Device device, String registrationId) {
        this.client = client;
        this.device = device;
        this.registrationId = registrationId;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public String getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(String registrationId) {
        this.registrationId = registrationId;
    }

    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_devices", idClientHasDevices);
        response.put("client", client.toJsonWithoutRelations());
        response.put("device", device.toJson());
        response.put("registration_id", registrationId);
        return response;
    }

    public ObjectNode toJsonWithoutClient() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_devices", idClientHasDevices);
        response.put("device", device.toJson());
        response.put("registration_id", registrationId);
        return response;
    }

    public ObjectNode toJsonWithoutDevice() {
        ObjectNode response = Json.newObject();
        response.put("id_client_has_devices", idClientHasDevices);
        response.put("client", client.toJsonWithoutRelations());
        response.put("registration_id", registrationId);
        return response;
    }

    //Finder Operations

    public static ClientHasDevices getByID(int id){
        return finder.byId(id);
    }

    public static Iterator<ClientHasDevices> getPage(int pageSize, int page){
        Iterator<ClientHasDevices> iterator = null;
        if(pageSize == 0){
            iterator = finder.all().iterator();
        }else{
            iterator = finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
        }
        return  iterator;
    }

    public static ClientHasDevices getByRegistrationIdDevice(String registrationId, Device device){
        return ClientHasDevices.finder.where().eq("registrationId", registrationId).eq("device", device).findUnique();
    }

    public static ClientHasDevices getByForClientRegistrationIdDevice(Client client, String registrationId, Device device) {
        return finder.where().eq("client", client).eq("registrationId", registrationId).eq("device", device).findUnique();
    }

    public static List<ClientHasDevices> getByNotForClientRegistrationIdDevice(Client client, String registrationId, Device device) {
        return finder.where().ne("client", client).eq("registrationId", registrationId).eq("device", device).findList();
    }

    public static List<ClientHasDevices> getListByRegistrationIdDevice(String registrationId, Device device) {
        return finder.where().eq("registrationId", registrationId).eq("device.idDevice", device.getIdDevice()).findList();
    }

    public static List<ClientHasDevices> getListByRegistrationIdDeviceName(String registrationId, String device) {
        return finder.where().eq("registrationId", registrationId).eq("device.name", device).findList();
    }
}
