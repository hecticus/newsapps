package controllers;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ning.http.client.FluentCaseInsensitiveStringsMap;
import com.ning.http.multipart.FilePart;
import com.ning.http.multipart.MultipartRequestEntity;
import com.ning.http.multipart.Part;

import models.basic.Config;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import play.libs.F;
import play.libs.Json;
import play.libs.ws.WS;

import play.libs.ws.WSRequestHolder;
import play.libs.ws.WSResponse;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Results;
import play.mvc.Security;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Created by plesse on 3/19/15.
 */
public class Wistia extends HecticusController {

    public static ObjectNode uploadVideo(File file, String name){
        String wistiaURL = Config.getString("wistia-upload-url");
        String wistiaAPIPwd = Config.getString("wistia-api-password");
        String wistiaAPIProjectId = Config.getString("wistia-api-project-id");
        try {

            CloseableHttpClient httpClient = HttpClients.createDefault();
            HttpPost uploadFile = new HttpPost(wistiaURL);

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addTextBody("api_password", wistiaAPIPwd, ContentType.TEXT_PLAIN);
            builder.addTextBody("name", name, ContentType.TEXT_PLAIN);
            builder.addTextBody("project_id", wistiaAPIProjectId, ContentType.TEXT_PLAIN);
            builder.addBinaryBody("file", file, ContentType.APPLICATION_OCTET_STREAM, name);
            HttpEntity multipart = builder.build();

            uploadFile.setEntity(multipart);

            CloseableHttpResponse response = httpClient.execute(uploadFile);
            HttpEntity responseEntity = response.getEntity();

            ObjectNode res = (ObjectNode) Json.parse(responseEntity.getContent());//guardar hashed_id
            return res;
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public static ObjectNode getVideo(String id){
        String wistiaURL = Config.getString("wistia-url");
        String wistiaAPIPwd = Config.getString("wistia-api-password");
        try {
            F.Promise<WSResponse> result = WS.url(wistiaURL + "medias/" + id + ".json?api_password=" + wistiaAPIPwd).get();
            ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
            return response;
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @Security.Authenticated(Secured.class)
    public static Result upload(){
        try {
            Http.MultipartFormData body = request().body().asMultipartFormData();
            Http.MultipartFormData.FilePart filePart = body.getFile("file");
            File file = filePart.getFile();
            ObjectNode res = uploadVideo(file, filePart.getFilename());
            return ok(res);
        } catch (Exception e){
            e.printStackTrace();
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error enviando evento", e));
        }
    }

    public static Result get(String id){
        try {
            ObjectNode response = getVideo(id);
            return ok(response);
        } catch (Exception e){
            e.printStackTrace();
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error enviando evento", e));
        }
    }

    public static Result list(){
        String wistiaURL = Config.getString("wistia-url");
        String wistiaAPIPwd = Config.getString("wistia-api-password");
        String wistiaAPIProjectId = Config.getString("wistia-api-project-id");
        try {
            F.Promise<WSResponse> result = WS.url(wistiaURL + "medias.json?api_password=" + wistiaAPIPwd + "&project_id=" + wistiaAPIProjectId).get();
            ArrayNode response = (ArrayNode) result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
            return ok(response);
        } catch (Exception e){
            e.printStackTrace();
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error enviando evento", e));
        }
    }

    @Security.Authenticated(Secured.class)
    public static ObjectNode deleteVideo(String id) {
        String wistiaURL = Config.getString("wistia-url");
        String wistiaAPIPwd = Config.getString("wistia-api-password");
        try {
            F.Promise<WSResponse> result = WS.url(wistiaURL + "medias/" + id + ".json?api_password=" + wistiaAPIPwd).delete();
            ObjectNode response = (ObjectNode)result.get(Config.getLong("ws-timeout-millis"), TimeUnit.MILLISECONDS).asJson();
            return response;
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public static Result delete(String id){
        try {
            ObjectNode response = deleteVideo(id);
            return ok(response);
        } catch (Exception e){
            e.printStackTrace();
            return Results.badRequest(buildBasicResponse(3, "ocurrio un error enviando evento", e));
        }
    }
}
