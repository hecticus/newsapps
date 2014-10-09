package models.clients;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.basic.Country;
import models.content.women.Woman;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by plesse on 9/30/14.
 */
@Entity
@Table(name="clients")
public class Client extends HecticusModel {


    @Id
    private Integer idClient;
    @Constraints.Required
    private String userId;
    @Constraints.Required
    private Integer status;
    @Constraints.Required
    private String login;
    @Constraints.Required
    private String password;
    @Constraints.Required
    @Constraints.MaxLength(value = 10)
    private String lastCheckDate;

    @OneToOne
    @JoinColumn(name = "id_country")
    private Country country;

    @OneToMany(mappedBy="client", cascade = CascadeType.ALL)
    private List<ClientHasDevices> devices;

    @OneToMany(mappedBy="client", cascade = CascadeType.ALL)
    private List<ClientHasWoman> women;

    public static Model.Finder<Integer, Client> finder = new Model.Finder<Integer, Client>(Integer.class, Client.class);

    public Client(Integer status, String login, String password, Country country) {
        this.status = status;
        this.login = login;
        this.password = password;
        this.country = country;
    }

    public Client(String userId, Integer status, String login, String password, Country country) {
        this.userId = userId;
        this.status = status;
        this.login = login;
        this.password = password;
        this.country = country;
    }

    public Client(Integer status, String login, String password, Country country, String lastCheckDate) {
        this.status = status;
        this.login = login;
        this.password = password;
        this.country = country;
        this.lastCheckDate = lastCheckDate;
    }

    public Client(String userId, Integer status, String login, String password, Country country, String lastCheckDate) {
        this.userId = userId;
        this.status = status;
        this.login = login;
        this.password = password;
        this.country = country;
        this.lastCheckDate = lastCheckDate;
    }

    public Integer getIdClient() {
        return idClient;
    }

    public void setIdClient(Integer idClient) {
        this.idClient = idClient;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public List<ClientHasDevices> getDevices() {
        return devices;
    }

    public void setDevices(List<ClientHasDevices> devices) {
        this.devices = devices;
    }

    public List<ClientHasWoman> getWomen() {
        return women;
    }

    public void setWomen(List<ClientHasWoman> women) {
        this.women = women;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getLastCheckDate() {
        return lastCheckDate;
    }

    public void setLastCheckDate(String lastCheckDate) {
        this.lastCheckDate = lastCheckDate;
    }

    public int getDeviceIndex(String registrationId, int deviceId) {
        ClientHasDevices clientHasDevice = ClientHasDevices.finder.where().eq("registrationId", registrationId).eq("device.idDevice", deviceId).findUnique();
        if(clientHasDevice == null){
            return -1;
        }
        return devices.indexOf(clientHasDevice);
    }

    public int getWomanIndex(int womanId) {
        Woman woman = Woman.finder.byId(womanId);
        if(woman == null){
            return -1;
        }
        return women.indexOf(woman);
    }


    @Override
    public ObjectNode toJson() {
        ObjectNode response = Json.newObject();
        response.put("id_client", idClient);
        response.put("user_id", userId);
        response.put("login", login);
        response.put("status", status);
        response.put("last_check_date", lastCheckDate);
        response.put("country", country.toJson());
        if(devices != null && !devices.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(ClientHasDevices ad : devices){
                apps.add(ad.toJsonWithoutClient());
            }
            response.put("devices", Json.toJson(apps));
        }
        if(women != null && !women.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(ClientHasWoman ad : women){
                apps.add(ad.toJsonWithoutClient());
            }
            response.put("women", Json.toJson(apps));
        }
        return response;
    }

    public ObjectNode toJsonWithoutRelations() {
        ObjectNode response = Json.newObject();
        response.put("id_client", idClient);
        response.put("user_id", userId);
        response.put("login", login);
        response.put("status", status);
        response.put("last_check_date", lastCheckDate);
        response.put("country", country.toJson());
        return response;
    }

    public ObjectNode toPMCJson() {
        ObjectNode response = Json.newObject();
        response.put("idClient", idClient);
        ArrayList<String> droid = new ArrayList<>();
        ArrayList<String> ios = new ArrayList<>();
        for(ClientHasDevices chd : devices){
            if(chd.getDevice().getName().endsWith("droid")){
                droid.add(chd.getRegistrationId());
            } else if(chd.getDevice().getName().endsWith("ios")){
                ios.add(chd.getRegistrationId());
            }
        }
        response.put("droid", Json.toJson(droid));
        response.put("ios", Json.toJson(ios));
        return response;
    }
}
