package models.clients;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.basic.Country;
import models.leaderboard.ClientBets;
import models.leaderboard.Leaderboard;
import models.leaderboard.LeaderboardGlobal;
import models.pushalerts.ClientHasPushAlerts;
import models.pushalerts.PushAlerts;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private List<ClientHasPushAlerts> pushAlerts;

    @OneToMany(fetch = FetchType.LAZY, mappedBy="client", cascade = CascadeType.ALL)
    private List<Leaderboard> leaderboards;

    @OneToOne(fetch = FetchType.LAZY, mappedBy="client", cascade = CascadeType.ALL)
    private LeaderboardGlobal leaderboardGlobal;

    @OneToMany(mappedBy="client", cascade = CascadeType.ALL)
    private List<ClientBets> clientBets;

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

    public List<ClientHasPushAlerts> getPushAlerts() {
        return pushAlerts;
    }

    public void setPushAlerts(List<ClientHasPushAlerts> pushAlerts) {
        this.pushAlerts = pushAlerts;
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

    public List<Leaderboard> getLeaderboards() {
        return leaderboards;
    }

    public void setLeaderboards(List<Leaderboard> leaderboards) {
        this.leaderboards = leaderboards;
    }

    public LeaderboardGlobal getLeaderboardGlobal() {
        return leaderboardGlobal;
    }

    public void setLeaderboardGlobal(LeaderboardGlobal leaderboardGlobal) {
        this.leaderboardGlobal = leaderboardGlobal;
    }

    public List<ClientBets> getClientBets() {
        return clientBets;
    }

    public void setClientBets(List<ClientBets> clientBets) {
        this.clientBets = clientBets;
    }

    public int getDeviceIndex(String registrationId, int deviceId) {
        ClientHasDevices clientHasDevice = ClientHasDevices.finder.where().eq("registrationId", registrationId).eq("device.idDevice", deviceId).findUnique();
        if(clientHasDevice == null){
            return -1;
        }
        return devices.indexOf(clientHasDevice);
    }

    public int getPushAlertIndex(int pushAlertId) {
        PushAlerts pushAlert = PushAlerts.finder.byId(pushAlertId);
        if(pushAlert == null){
            return -1;
        }
        ClientHasPushAlerts clientHasPushAlert = ClientHasPushAlerts.finder.where().eq("client.idClient", idClient).eq("pushAlert.idPushAlert", pushAlert.getIdPushAlert()).findUnique();
        if(clientHasPushAlert == null){
            return -1;
        }
        return pushAlerts.indexOf(clientHasPushAlert);
    }

    public void addClientBet(ClientBets bet){
        if(bet.getIdClientBets() != null && clientBets.contains(bet)){
            clientBets.remove(bet);
        }
        clientBets.add(bet);
    }

    public Map<Integer, ClientBets> getClientBetsAsMap(){
        Map<Integer, ClientBets> betsMap = new HashMap<>();
        for(ClientBets clientBets1 : clientBets){
            betsMap.put(clientBets1.getIdGameMatch(), clientBets1);
        }
        return betsMap;
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

        ArrayList<ObjectNode> alerts = new ArrayList<>();
        if(pushAlerts != null && !pushAlerts.isEmpty()){
            for(ClientHasPushAlerts ad : pushAlerts){
                alerts.add(ad.toJson());
            }
        }
        response.put("push_alerts", Json.toJson(alerts));

        ArrayList<ObjectNode> leaderBoard = new ArrayList<>();
        if(leaderboards != null && !leaderboards.isEmpty()){
            for(Leaderboard ad : leaderboards){
                leaderBoard.add(ad.toJsonClean());
            }
        }
        response.put("leaderboards", Json.toJson(leaderBoard));

        if(leaderboardGlobal != null) {
            response.put("leaderbooard_global", leaderboardGlobal.toJsonClean());
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
