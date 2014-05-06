package controllers.newsapi;

import com.jolbox.bonecp.BoneCPDataSource;
import controllers.Application;
import controllers.HecticusController;
import models.Config;
import org.apache.commons.codec.binary.Base64;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.api.Play;
import play.mvc.Http;
import play.mvc.Result;

import java.io.File;
import java.io.FileOutputStream;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import com.hecticus.rackspacecloud.RackspaceCreate;
import com.hecticus.rackspacecloud.RackspacePublish;
import utils.Utils;


/**
 * Created by chrirod on 4/29/14.
 */
public class YoInformoController extends HecticusController {
    public static final String imageDir = "files/yoinformouploader/";

    private static final String containerName = "noticiastvn";

    private static final int TTL = 900;

    public static Result uploadImage(){
        try {
            Utils.printToLog(YoInformoController.class, "", "entrando a uploadImage()", false, null, "", Config.LOGGER_ERROR);
            Http.MultipartFormData.FilePart picture = getImage();
            if (picture != null) {
                String fileName = picture.getFilename();
                String contentType = picture.getContentType();
                File file = picture.getFile();
                UUID idFile = UUID.randomUUID();
                File dest = new File(Config.getString("img-Folder-Route")+idFile+".jpeg");
                file.renameTo(dest);
                boolean useCDN = Config.getInt("use-cdn")==1;
                if(useCDN && !uploadAndPublish(dest)){
                    return badRequest(buildBasicResponse(-3, "no se pudo subir la imagen"));
                }
                ArrayList data = new ArrayList();
                String urlPrefix = useCDN?Config.getString("rks-CDN-URL"):Config.getString("img-WS-Route");
                data.add(urlPrefix+idFile+".jpeg");
                Utils.printToLog(YoInformoController.class, "", urlPrefix+idFile+".jpeg", false, null, "", Config.LOGGER_ERROR);
                if(useCDN) dest.delete();
                ObjectNode response = hecticusResponse(0, "ok", "urlimage", data);
                return ok(response);
            }else{
                Utils.printToLog(YoInformoController.class, "", "no hay imagen a subir", false, null, "", Config.LOGGER_ERROR);
                return badRequest(buildBasicResponse(-2, "no hay imagen a subir"));
            }
        }catch (Exception ex){
            Utils.printToLog(YoInformoController.class, "", "ocurrio un error:" + ex.toString(), false, null, "", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
        }
    }

    private static boolean uploadAndPublish(File file){

        //String username = Config.getRackspaceUser();
        //String apiKey = Config.getRackspaceApiKey();
        //String provider = Config.getRackspaceProvider();
        String username = "hctcsproddfw";
        String apiKey = "276ef48143b9cd81d3bef7ad9fbe4e06";
        String provider = "cloudfiles-us";
        RackspaceCreate upload = new RackspaceCreate(username, apiKey, provider);
        RackspacePublish pub = new RackspacePublish(username, apiKey, provider);
        long init = System.currentTimeMillis();
        int retry = 3;
        if(upload == null || pub == null){
            return false;
        }
        try {
            upload.createContainer(containerName);
            Utils.printToLog(YoInformoController.class, "", "Creado container " + containerName, false, null, "", Config.LOGGER_ERROR);
            //resources
            uploadFile(upload, retry, containerName, file, "yoinformo", init);
            Utils.printToLog(YoInformoController.class, "", "Archivo subido " + file.getAbsolutePath(), false, null, "", Config.LOGGER_ERROR);
            //publish
            pub.enableCdnContainer(containerName, TTL);
            Utils.printToLog(YoInformoController.class, "", "Container CDN enabled", false, null, "", Config.LOGGER_ERROR);

            return true;
        }catch (Exception ex){
            Utils.printToLog(null, "", "Error subiendo el archivo al CDN", false, ex, "", Config.LOGGER_ERROR);
            return false;
        }
    }

    public static Result getImg(String name){
        try{
            File file = Play.application(play.api.Play.current()).getFile(imageDir + name);
            return ok(file);
        }catch (Exception ex){
            Utils.printToLog(YoInformoController.class, "", "Error en la imagen", false, ex, "", Config.LOGGER_ERROR);
            return badRequest(buildBasicResponse(-2, "Error en la imagen " + imageDir + name));
        }
    }
}
