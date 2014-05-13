package controllers.matchesapi;

import controllers.HecticusController;
import models.matches.ClientPrediction;
import models.matches.Phase;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;
import play.mvc.Result;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by chrirod on 4/11/14.
 */
public class PredictionController extends HecticusController {
    public static Result storeClientPrediction(){
        try {
            ArrayList data = new ArrayList();
            ObjectNode jsonInfo = getJson();
            long idClient;
            String predictionString;
            if(jsonInfo.has("idClient") && jsonInfo.has("clientPrediction")){
                idClient = jsonInfo.get("idClient").asLong();                              
                predictionString = jsonInfo.get("clientPrediction").toString();
                if(predictionString.isEmpty()){
                    //error
                    return badRequest(buildBasicResponse(1,"no hay prediccion"));
                }
                ObjectNode predictionObj;
                try {
                    //hacemos decode de la data para ver si es un json
                    String predictionStringDecoded = java.net.URLDecoder.decode(predictionString, "UTF-8");
                    predictionObj = (ObjectNode) Json.parse(predictionStringDecoded);
                    if(predictionObj == null){
                        throw new Exception("json vacio");
                    }
                }catch (Exception e){
                    return badRequest(buildBasicResponse(2,"ocurrio un error parseando el json de prediccion: "+e.toString()));
                }

                ClientPrediction prediction = ClientPrediction.getClientPrediction(idClient);
                if(prediction == null){
                    //creamos una nueva
                    prediction = new ClientPrediction(idClient,predictionString);
                    prediction.save();
                }else{
                    //modificamos la existente
                    prediction.setPrediction(predictionString);
                    prediction.update();
                }
                data.add(prediction.toJson());
                //build response
                ObjectNode response = hecticusResponse(0, "ok", "prediction", data);
                return ok(response);
            }else{
                return badRequest(buildBasicResponse(1,"parametros incorrectos para la prediccion"));
            }


        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result getClientPrediction(){
        try {
            ArrayList data = new ArrayList();
            ObjectNode jsonInfo = getJson();
            long idClient = -1;
            long idClientPrediction = -1;
            if(jsonInfo.has("idClient") || jsonInfo.has("idPrediction")){
                if(jsonInfo.has("idClient"))idClient = jsonInfo.get("idClient").asLong();
                if(jsonInfo.has("idPrediction"))idClientPrediction = jsonInfo.get("idPrediction").asLong();
                if(idClient == -1 && idClientPrediction == -1){
                    //error
                    return badRequest(buildBasicResponse(1,"no hay criterio de busqueda"));
                }
                ClientPrediction prediction = null;
                if(idClient != -1){
                    prediction = ClientPrediction.getClientPrediction(idClient);
                }else{
                    prediction = ClientPrediction.getPrediction(idClientPrediction);
                }

                if(prediction != null){
                    ObjectNode node = prediction.toJson();
                    node.put("nick",""); //aqui hay que consultar a social clients cual es el nick
                    String predictionString = prediction.getPrediction();
                    ObjectNode predictionObj = (ObjectNode) Json.parse(predictionString);
                    ArrayNode matchesResults = (ArrayNode)predictionObj.get("matches");

                    ArrayList allPhases = PhaseController.getAllPhasesMatchesObj(true, matchesResults);

                    node.put("matches",Json.toJson(allPhases));
                    data.add(node);

                }else{
                    prediction = new ClientPrediction(idClient,"{}");
                    ObjectNode node = prediction.toJson();
                    node.put("nick",""); //aqui hay que consultar a social clients cual es el nick
                    //si no hay prediccion nos traemos todos los partidos y ya
                    ArrayList allPhases = PhaseController.getAllPhasesMatchesObj(true,null);
                    node.put("matches",Json.toJson(allPhases));
                    data.add(node);
                }

                //build response
                ObjectNode response = hecticusResponse(0, "ok", "prediction", data);
                return ok(response);
            }else{
                return badRequest(buildBasicResponse(1,"parametros incorrectos para la prediccion"));
            }


        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }

    public static Result convertClientPredictionToBet(){
        try {
            ArrayList data = new ArrayList();
            ObjectNode jsonInfo = getJson();
            long idClient = -1;
            long idClientPrediction = -1;
            if(jsonInfo.has("idClient") || jsonInfo.has("idPrediction")){
                if(jsonInfo.has("idClient"))idClient = jsonInfo.get("idClient").asLong();
                if(jsonInfo.has("idPrediction"))idClientPrediction = jsonInfo.get("idPrediction").asLong();
                if(idClient == -1 && idClientPrediction == -1){
                    //error
                    return badRequest(buildBasicResponse(1,"no hay criterio de busqueda"));
                }
                ClientPrediction prediction = null;
                if(idClient != -1){
                    prediction = ClientPrediction.getClientPrediction(idClient);
                }else{
                    prediction = ClientPrediction.getPrediction(idClientPrediction);
                }

                if(prediction != null){
                    
                }

                //build response
                ObjectNode response = hecticusResponse(0, "ok", "client_bets", data);
                return ok(response);
            }else{
                return badRequest(buildBasicResponse(1,"parametros incorrectos para la convertir la prediccion a apuesta del cliente"));
            }


        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }
    }
}
