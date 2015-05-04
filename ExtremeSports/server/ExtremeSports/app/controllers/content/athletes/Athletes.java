package controllers.content.athletes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.basic.Config;
import models.content.athletes.*;
import play.libs.Json;
import play.mvc.Result;
import play.mvc.Results;
import utils.Utils;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by plesse on 10/1/14.
 */
//@Security.Authenticated(Secured.class)
public class Athletes extends HecticusController {

    public static Result create() {
        ObjectNode athleteData = getJson();
        try{
            if(athleteData.has("name") && athleteData.has("default_photo")){
                Athlete athlete = createAthlete(athleteData);
                return created(buildBasicResponse(0, "OK", athlete.toJson()));
            } else {
                return badRequest(buildBasicResponse(1, "Faltan campos para crear el registro"));
            }
        } catch (Exception ex) {
            Utils.printToLog(Athletes.class, "Error manejando garotas", "error creando con params" + athleteData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        ObjectNode athleteData = getJson();
        try{
            Athlete athlete = Athlete.getByID(id);
            if(athlete != null){
                if(athleteData.has("name")){
                    athlete.setName(athleteData.get("name").asText());
                    athlete.update();
                }

                if(athleteData.has("default_photo")){
                    String file = athleteData.get("default_photo").asText();
                    String path = Utils.uploadAttachment(file, "Athlete-"+athlete.getIdAthlete());
                    athlete.setDefaultPhoto(path);
                    athlete.update();
                }

                if(athleteData.has("add_social_networks")){
                    Iterator<JsonNode> socialNetworks = athleteData.get("add_social_networks").elements();
                    while (socialNetworks.hasNext()){
                        ObjectNode next = (ObjectNode)socialNetworks.next();
                        if(next.has("social_network") && next.has("link")){
                            SocialNetwork socialNetwork = SocialNetwork.getByID(next.get("social_network").asInt());
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
                        SocialNetwork socialNetwork = SocialNetwork.getByID(next.asInt());
                        if(socialNetwork != null) {
                            AthleteHasSocialNetwork whsn = AthleteHasSocialNetwork.getForAthlete(athlete, socialNetwork);
                            if (whsn != null) {
                                whsn.delete();
                            }
                        }
                    }
                }

                return ok(buildBasicResponse(0, "OK", athlete.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a modificar"));
            }
        } catch (Exception ex) {
            Utils.printToLog(Athletes.class, "Error manejando garotas", "error creando con params" + athleteData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            Athlete athlete = Athlete.getByID(id);
            if(athlete != null) {
                athlete.delete();
                return ok(buildBasicResponse(0, "OK", athlete.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a eliminar"));
            }
        } catch (Exception ex) {
            Utils.printToLog(Athletes.class, "Error manejando athletes", "error eliminando la athlete " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id){
        try {
            Athlete athlete = Athlete.getByID(id);
            if(athlete != null) {
                return ok(buildBasicResponse(0, "OK", athlete.toJson()));
            } else {
                return notFound(buildBasicResponse(2, "no existe el registro a consultar"));
            }
        }catch (Exception e) {
            Utils.printToLog(Athletes.class, "Error manejando athletes", "error buscando la athlete " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page){
        try {
            Iterator<Athlete> athleteIterator = Athlete.getPage(pageSize, page);
            ArrayList<ObjectNode> athletes = new ArrayList<ObjectNode>();
            while(athleteIterator.hasNext()){
                athletes.add(athleteIterator.next().toJson());
            }
            return ok(buildBasicResponse(0, "OK", Json.toJson(athletes)));
        }catch (Exception e) {
            Utils.printToLog(Athletes.class, "Error manejando athletes", "error listando las athletes con pageSize " + pageSize + " y " + page, true, e, "support-level-1", Config.LOGGER_ERROR);
            return internalServerError(buildBasicResponse(1,"Error buscando el registro",e));
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
                    SocialNetwork socialNetwork = SocialNetwork.getByID(next.get("social_network").asInt());
                    if(socialNetwork != null){
                        AthleteHasSocialNetwork whsn = new AthleteHasSocialNetwork(athlete, socialNetwork, next.get("link").asText());
                        nets.add(whsn);
                    }
                }
            }
            athlete.setSocialNetworks(nets);
        }

        athlete.save();

        if(data.has("default_photo")){
            String file = data.get("default_photo").asText();
            String path = Utils.uploadAttachment(file, "Athlete-"+athlete.getIdAthlete());
            athlete.setDefaultPhoto(path);
        }

        athlete.update();
        return athlete;
    }


}
