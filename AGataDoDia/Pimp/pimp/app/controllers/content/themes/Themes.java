package controllers.content.themes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import controllers.HecticusController;
import models.basic.Config;
import models.content.themes.*;
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
public class Themes extends HecticusController {

    public static Result create() {
        ObjectNode themeData = getJson();
        try{
            ObjectNode response = null;
            if(themeData.has("name") && themeData.has("default_photo")){
                Theme theme = createTheme(themeData);
                response = buildBasicResponse(0, "OK", theme.toJson());
            } else {
                response = buildBasicResponse(1, "Faltan campos para crear el registro");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Themes.class, "Error manejando garotas", "error creando con params" + themeData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result update(Integer id) {
        ObjectNode themeData = getJson();
        try{
            ObjectNode response = null;
            Theme theme = Theme.finder.byId(id);
            if(theme != null){
                if(themeData.has("name")){
                    theme.setName(themeData.get("name").asText());
                    theme.update();
                }

                if(themeData.has("default_photo")){
                    String file = themeData.get("default_photo").asText();
                    String path = Utils.uploadAttachment(file, theme.getIdTheme());
                    theme.setDefaultPhoto(path);
                    theme.update();
                }

                if(themeData.has("add_social_networks")){
                    Iterator<JsonNode> socialNetworks = themeData.get("add_social_networks").elements();
                    while (socialNetworks.hasNext()){
                        ObjectNode next = (ObjectNode)socialNetworks.next();
                        if(next.has("social_network") && next.has("link")){
                            SocialNetwork socialNetwork = SocialNetwork.finder.byId(next.get("social_network").asInt());
                            if(socialNetwork != null){
                                ThemeHasSocialNetwork whsn = new ThemeHasSocialNetwork(theme, socialNetwork, next.get("link").asText());
                                whsn.save();
                            }
                        }
                    }
                }

                if(themeData.has("remove_social_networks")){
                    Iterator<JsonNode> socialNetworks = themeData.get("remove_social_networks").elements();
                    while (socialNetworks.hasNext()){
                        JsonNode next = socialNetworks.next();
                        ThemeHasSocialNetwork whsn = ThemeHasSocialNetwork.finder.where().eq("woman.idWoman", theme.getIdTheme()).eq("idWomanHasSocialNetwork", next.asInt()).findUnique();
                        if(whsn != null){
                            whsn.delete();
                        }
                    }
                }

                if(themeData.has("add_categories")){
                    Iterator<JsonNode> categories = themeData.get("add_categories").elements();
                    while (categories.hasNext()){
                        JsonNode next = categories.next();
                        Category category = Category.finder.byId(next.asInt());
                        if(category != null){
                            ThemeHasCategory whc = new ThemeHasCategory(category, theme);
                            whc.save();
                        }
                    }
                }

                if(themeData.has("remove_categories")){
                    Iterator<JsonNode> categories = themeData.get("remove_categories").elements();
                    while (categories.hasNext()){
                        JsonNode next = categories.next();
                        ThemeHasCategory whc = ThemeHasCategory.finder.where().eq("woman.idWoman", theme.getIdTheme()).eq("idWomanHasCategory", next.asInt()).findUnique();
                        if(whc != null){
                            whc.delete();
                        }
                    }
                }
                response = buildBasicResponse(0, "OK", theme.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a modificar");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Themes.class, "Error manejando garotas", "error creando con params" + themeData.toString(), false, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(2, "ocurrio un error creando el registro", ex));
        }
    }

    public static Result delete(Integer id) {
        try{
            ObjectNode response = null;
            Theme theme = Theme.finder.byId(id);
            if(theme != null) {
                theme.delete();
                response = buildBasicResponse(0, "OK", theme.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a eliminar");
            }
            return ok(response);
        } catch (Exception ex) {
            Utils.printToLog(Themes.class, "Error manejando themes", "error eliminando la theme " + id, true, ex, "support-level-1", Config.LOGGER_ERROR);
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error eliminando el registro", ex));
        }
    }

    public static Result get(Integer id){
        try {
            ObjectNode response = null;
            Theme theme = Theme.finder.byId(id);
            if(theme != null) {
                response = buildBasicResponse(0, "OK", theme.toJson());
            } else {
                response = buildBasicResponse(2, "no existe el registro a consultar");
            }
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Themes.class, "Error manejando themes", "error buscando la theme " + id, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Result list(Integer pageSize,Integer page){
        try {

            Iterator<Theme> womanIterator = null;
            if(pageSize == 0){
                womanIterator = Theme.finder.all().iterator();
            }else{
                womanIterator = Theme.finder.where().setFirstRow(page).setMaxRows(pageSize).findList().iterator();
            }

            ArrayList<ObjectNode> women = new ArrayList<ObjectNode>();
            while(womanIterator.hasNext()){
                women.add(womanIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(women));
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Themes.class, "Error manejando themes", "error listando las themes con pageSize " + pageSize + " y " + page, true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }

    public static Theme createTheme(ObjectNode data) throws IOException, NoSuchAlgorithmException {
        Theme theme = new Theme(data.get("name").asText());
        if(data.has("social_networks")){
            Iterator<JsonNode> socialNetworks = data.get("social_networks").elements();
            ArrayList<ThemeHasSocialNetwork> nets = new ArrayList<>();
            while (socialNetworks.hasNext()){
                ObjectNode next = (ObjectNode)socialNetworks.next();
                if(next.has("social_network") && next.has("link")){
                    SocialNetwork socialNetwork = SocialNetwork.finder.byId(next.get("social_network").asInt());
                    if(socialNetwork != null){
                        ThemeHasSocialNetwork whsn = new ThemeHasSocialNetwork(theme, socialNetwork, next.get("link").asText());
                        nets.add(whsn);
                    }
                }
            }
            theme.setSocialNetworks(nets);
        }

        if(data.has("categories")){
            Iterator<JsonNode> categories = data.get("categories").elements();
            ArrayList<ThemeHasCategory> cats = new ArrayList<>();
            while (categories.hasNext()){
                JsonNode next = categories.next();
                Category category = Category.finder.byId(next.asInt());
                if(category != null){
                    ThemeHasCategory whc = new ThemeHasCategory(category, theme);
                    cats.add(whc);
                }
            }
            theme.setCategories(cats);
        }

        if(data.has("default_photo")){
            String file = data.get("default_photo").asText();
            String path = Utils.uploadAttachment(file, theme.getIdTheme());
            theme.setDefaultPhoto(path);
        }

        theme.save();
        return theme;
    }

    public static Result hallOfFame(){
        try {
            Iterator<Theme> womanIterator = Theme.finder.fetch("categories").where().eq("categories.category.idCategory", Config.getInt("id-hall-of-fame")).setFirstRow(0).setMaxRows(10).findList().iterator();
            ArrayList<ObjectNode> women = new ArrayList<ObjectNode>();
            while(womanIterator.hasNext()){
                women.add(womanIterator.next().toJson());
            }
            ObjectNode response = buildBasicResponse(0, "OK", Json.toJson(women));
            return ok(response);
        }catch (Exception e) {
            Utils.printToLog(Themes.class, "Error manejando themes", "error listando hall de la fama ", true, e, "support-level-1", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(1,"Error buscando el registro",e));
        }
    }
}
