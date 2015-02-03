package controllers.content.athletes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import controllers.Secured;
import models.basic.Config;
import models.content.athletes.*;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;
import play.mvc.Security;
import utils.Utils;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by plesse on 10/1/14.
 */
@Security.Authenticated(Secured.class)
public class Athletes extends HecticusController {

    public static Result create() {
        ObjectNode athleteData = getJson();
        try{
            ObjectNode response = null;
            if(athleteData.has("name") && athleteData.has("default_photo")){
                Athlete athlete = createAthlete(athleteData);
                response = buildBasicResponse(0, "OK", athlete.toJson());
            } else {
                response = buildBasicResponse(1, "Faltan campos para crear el registro");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Athletes.class, "Error manejando garotas", "error creando con params" + athleteData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        ObjectNode athleteData = getJson();
        try{
            ObjectNode response = null;
            Athlete athlete = Athlete.finder.byId(id);
            if(athlete != null){
                if(athleteData.has("name")){
                    athlete.setName(athleteData.get("name").asText());
                    athlete.update();
                }

                if(athleteData.has("default_photo")){
                    String file = athleteData.get("default_photo").asText();
                    String path = Utils.uploadAttachment(file, athlete.getIdAthlete());
                    athlete.setDefaultPhoto(path);
                    athlete.update();
                }

                if(athleteData.has("add_social_networks")){
                    Iterator<JsonNode> socialNetworks = athleteData.get("add_social_networks").elements();
                    while (socialNetworks.hasNext()){
                        ObjectNode next = (ObjectNode)socialNetworks.next();
                        if(next.has("social_network") && next.has("link")){
                            SocialNetwork socialNetwork = SocialNetwork.finder.byId(next.get("social_network").asInt());
                            if(socialNetwork != null){
                                AthleteHasSocialNetwork whsn = new AthleteHasSocialNetwork(athlete, socialNetwork, next.get("link").asText());
                                whsn.save();
                            }
                        }
                    }
                }

                if(athleteData.has("remove_social_networks")){
                    Iterator<JsonNode> socialNetworks = athleteData.get("remove_social_networks").elements();
                    while (socialNetworks.hasNext()){
                        JsonNode next = socialNetworks.next();
                        AthleteHasSocialNetwork whsn = AthleteHasSocialNetwork.finder.where().eq("athlete.idAthlete", athlete.getIdAthlete()).eq("idWomanHasSocialNetwork", next.asInt()).findUnique();
                        if(whsn != null){
                            whsn.delete();
                        }
                    }
                }

                if(athleteData.has("add_categories")){
                    Iterator<JsonNode> categories = athleteData.get("add_categories").elements();
                    while (categories.hasNext()){
                        JsonNode next = categories.next();
                        Sport category = Sport.finder.byId(next.asInt());
                        if(category != null){
                            AthleteHasSport whc = new AthleteHasSport(category, athlete);
                            whc.save();
                        }
                    }
                }

                if(athleteData.has("remove_categories")){
                    Iterator<JsonNode> categories = athleteData.get("remove_categories").elements();
                    while (categories.hasNext()){
                        JsonNode next = categories.next();
                        AthleteHasSport whc = AthleteHasSport.finder.where().eq("athlete.idAthlete", athlete.getIdAthlete()).eq("idWomanHasSport", next.asInt()).findUnique();
                        if(whc != null){
                            whc.delete();
                        }
                    }
                }
                response = buildBasicResponse(0, "OK", athlete.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a modificar");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Athletes.class, "Error manejando garotas", "error creando con params" + athleteData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            ObjectNode response = null;
            Athlete athlete = Athlete.finder.byId(id);
            if(athlete != null) {
                athlete.delete();
                response = buildBasicResponse(0, "OK", athlete.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a eliminar");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Athletes.class, "Error manejando athletes", "error eliminando la athlete " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id){
        try {
            ObjectNode response = null;
            Athlete athlete = Athlete.finder.byId(id);
            if(athlete != null) {
                response = buildBasicResponse(0, "OK", athlete.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Athletes.class, "Error manejando athletes", "error buscando la athlete " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page){
        try {

            Iterator<Athlete> athleteIterator = null;
            if(pageSize == 0){
                athleteIterator = Athlete.finder.all().iterator();
            }else{
                athleteIterator = Athlete.finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
            }

            ArrayList<ObjectNode> athletes = new ArrayList<ObjectNode>();
            while(athleteIterator.hasNext()){
                athletes.add(athleteIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(athletes));
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Athletes.class, "Error manejando athletes", "error listando las athletes con pageSize " + pageSize + " y " + page, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Athlete createAthlete(ObjectNode data) throws IOException, NoSuchAlgorithmException {
        Athlete athlete = new Athlete(data.get("name").asText());
        if(data.has("social_networks")){
            Iterator<JsonNode> socialNetworks = data.get("social_networks").elements();
            ArrayList<AthleteHasSocialNetwork> nets = new ArrayList<>();
            while (socialNetworks.hasNext()){
                ObjectNode next = (ObjectNode)socialNetworks.next();
                if(next.has("social_network") && next.has("link")){
                    SocialNetwork socialNetwork = SocialNetwork.finder.byId(next.get("social_network").asInt());
                    if(socialNetwork != null){
                        AthleteHasSocialNetwork whsn = new AthleteHasSocialNetwork(athlete, socialNetwork, next.get("link").asText());
                        nets.add(whsn);
                    }
                }
            }
            athlete.setSocialNetworks(nets);
        }

        if(data.has("categories")){
            Iterator<JsonNode> categories = data.get("categories").elements();
            ArrayList<AthleteHasSport> cats = new ArrayList<>();
            while (categories.hasNext()){
                JsonNode next = categories.next();
                Sport category = Sport.finder.byId(next.asInt());
                if(category != null){
                    AthleteHasSport whc = new AthleteHasSport(category, athlete);
                    cats.add(whc);
                }
            }
            athlete.setSports(cats);
        }

        if(data.has("default_photo")){
            String file = data.get("default_photo").asText();
            String path = Utils.uploadAttachment(file, athlete.getIdAthlete());
            athlete.setDefaultPhoto(path);
        }

        athlete.save();
        return athlete;
    }


}
