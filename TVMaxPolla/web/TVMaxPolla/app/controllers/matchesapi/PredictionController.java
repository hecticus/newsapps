package controllers.matchesapi;

import controllers.HecticusController;
import models.matches.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import play.mvc.Result;

import java.io.UnsupportedEncodingException;
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

                /*ClientPrediction prediction = ClientPrediction.getClientPrediction(idClient);
                if(prediction == null){
                    //creamos una nueva
                    prediction = new ClientPrediction(idClient,predictionString);
                    convertClientPredictionToBet(prediction);
                    prediction.save();
                }else{
                    //modificamos la existente
                    prediction.setPrediction(predictionString);
                    convertClientPredictionToBet(prediction);
                    prediction.update();
                }
                data.add(prediction.toJson());*/
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

                    //ArrayList allPhases = PhaseController.getAllPhasesMatchesObj(true, matchesResults);
                    ArrayList allPhases = PhaseController.getAllPhasesMatchesObjPrediction(true, matchesResults);

                    node.put("matches",Json.toJson(allPhases));
                    data.add(node);

                }else{
                    prediction = new ClientPrediction(idClient,"{}");
                    ObjectNode node = prediction.toJson();
                    node.put("nick",""); //aqui hay que consultar a social clients cual es el nick
                    //si no hay prediccion nos traemos todos los partidos y ya
                    //ArrayList allPhases = PhaseController.getAllPhasesMatchesObj(true,null);
                    ArrayList allPhases = PhaseController.getAllPhasesMatchesObjPrediction(true,null);
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

    public static Result convertOldDataToNewOne(int page, int size){
        try {
            ArrayList data = new ArrayList();
            /*ObjectNode jsonInfo = getJson();
            long idClient = -1;
            long idClientPrediction = -1;
            if(jsonInfo.has("idClient"))idClient = jsonInfo.get("idClient").asLong();
            if(jsonInfo.has("idPrediction"))idClientPrediction = jsonInfo.get("idPrediction").asLong();*/
            List<ClientPrediction> allpredictions = ClientPrediction.getAllPaged(size,page);
            for(int i=0;i<allpredictions.size();i++){
                ClientPrediction prediction = allpredictions.get(i);
                convertClientPredictionToBet(prediction);

                /*if(idClient != -1 || idClientPrediction != -1){
                    ClientPrediction prediction = null;
                    if(idClient != -1){
                        prediction = ClientPrediction.getClientPrediction(idClient);
                    }else{
                        prediction = ClientPrediction.getPrediction(idClientPrediction);
                    }
                    convertClientPredictionToBet(prediction);
                    //build response
                    ObjectNode response = buildBasicResponse(0, "ok");
                    return ok(response);
                }else{
                    return badRequest(buildBasicResponse(1, "parametros incorrectos para la conversion"));
                }*/
            }
        }catch(Exception ex){
            return badRequest(buildBasicResponse(-1,"ocurrio un error:"+ex.toString()));
        }

        //build response
        ObjectNode response = buildBasicResponse(0, "ok");
        return ok(response);
    }

    public static void convertClientPredictionToBet(ClientPrediction prediction) throws UnsupportedEncodingException {
        if(prediction != null){
            long idClient = prediction.getIdClient();
            String predictionString = prediction.getPrediction();
            ObjectNode predictionObj = (ObjectNode) Json.parse(predictionString);
            ArrayNode matchesResults = (ArrayNode)predictionObj.get("matches");

            if(matchesResults != null){
                for(int y=0;y<matchesResults.size();y++){
                    ObjectNode obj = (ObjectNode) matchesResults.get(y);
                    int matchID = obj.get("id_match").asInt();
                    GameMatch match = GameMatch.getMatch(matchID);
                    if(match.getIdGroup()<9){
                        ClientBet clientBet = ClientBet.getClientBetForMatch(idClient,matchID);
                        if(clientBet != null){
                            clientBet.initClientBetData(idClient,1,obj);
                            clientBet.update();
                        }else{
                            clientBet = new ClientBet(idClient,1,obj);
                            clientBet.save();
                        }
                    }
                }
            }
        }
    }
}
