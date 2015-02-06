package models.clients;

import com.fasterxml.jackson.databind.node.ObjectNode;
import models.HecticusModel;
import models.basic.Config;
import models.basic.Country;
import models.basic.Language;
import models.content.athletes.Athlete;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.libs.Json;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Iterator;
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

    @OneToOne
    @JoinColumn(name = "id_language")
    private Language language;

    @OneToMany(mappedBy="client", cascade = CascadeType.ALL)
    private List<ClientHasDevices> devices;

    @OneToMany(mappedBy="client", cascade = CascadeType.ALL)
    private List<ClientHasAthlete> athletes;//eliminar???

    private static Model.Finder<Integer, Client> finder = new Model.Finder<Integer, Client>(Integer.class, Client.class);

    public Client(Integer status, String login, String password, Country country, Language language) {
        this.status = status;
        this.login = login;
        this.password = password;
        this.country = country;
        this.language = language;
    }

    public Client(String userId, Integer status, String login, String password, Country country, Language language) {
        this.userId = userId;
        this.status = status;
        this.login = login;
        this.password = password;
        this.country = country;
        this.language = language;
    }

    public Client(Integer status, String login, String password, Country country, String lastCheckDate, Language language) {
        this.status = status;
        this.login = login;
        this.password = password;
        this.country = country;
        this.lastCheckDate = lastCheckDate;
        this.language = language;
    }

    public Client(String userId, Integer status, String login, String password, Country country, String lastCheckDate, Language language) {
        this.userId = userId;
        this.status = status;
        this.login = login;
        this.password = password;
        this.country = country;
        this.lastCheckDate = lastCheckDate;
        this.language = language;
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

    public List<ClientHasAthlete> getAthletes() {
        return athletes;
    }

    public void setAthletes(List<ClientHasAthlete> athletes) {
        this.athletes = athletes;
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

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public int getDeviceIndex(String registrationId, Device device) {
        ClientHasDevices clientHasDevice = ClientHasDevices.getByRegistrationIdDevice(registrationId, device);
        if(clientHasDevice == null){
            return -1;
        }
        return devices.indexOf(clientHasDevice);
    }

    public int getAthleteIndex(int athleteId) {
        Athlete athlete = Athlete.getByID(athleteId);
        if(athlete == null){
            return -1;
        }
        ClientHasAthlete clientHasAthlete = ClientHasAthlete.getByClientAthlete(this, athlete);
        if(clientHasAthlete == null){
            return -1;
        }
        return athletes.indexOf(clientHasAthlete);
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
        if(athletes != null && !athletes.isEmpty()){
            ArrayList<ObjectNode> apps = new ArrayList<>();
            for(ClientHasAthlete ad : athletes){
                apps.add(ad.toJsonWithoutClient());
            }
            response.put("athletes", Json.toJson(apps));
        }
        response.put("language", language.toJson());
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
        response.put("app", Config.getInt("pmc-app-id"));
        ArrayList<String> droid = new ArrayList<>();
        ArrayList<String> ios = new ArrayList<>();
        ArrayList<String> web = new ArrayList<>();
        for(ClientHasDevices chd : devices){
            if(chd.getDevice().getName().endsWith("droid")){
                droid.add(chd.getRegistrationId());
            } else if(chd.getDevice().getName().endsWith("ios")){
                ios.add(chd.getRegistrationId());
            } else if(chd.getDevice().getName().endsWith("web")){
                web.add(chd.getRegistrationId());
            }
        }
        response.put("droid", Json.toJson(droid));
        response.put("ios", Json.toJson(ios));
        response.put("web", Json.toJson(web));
        return response;
    }

    //Finder Operations

    public static Client getByID(int id){
        return finder.byId(id);
    }

    public static Iterator<Client> getPage(int pageSize, int page){
        Iterator<Client> iterator = null;
        if(pageSize == 0){
            iterator = finder.all().iterator();
        }else{
            iterator = finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
        }
        return  iterator;
    }

    public static Client getByLogin(String login){
        return finder.where().eq("login", login).findUnique();
    }

    public static Client getByUserId(String login){
        return finder.where().eq("user_id", login).findUnique();
    }
}
