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

//import com.hecticus.rackspacecloud.RackspaceCreate;
//import com.hecticus.rackspacecloud.RackspacePublish;
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
            Http.MultipartFormData.FilePart picture = getImage();
            if (picture != null) {
                String fileName = picture.getFilename();
                String contentType = picture.getContentType();
                File file = picture.getFile();
                UUID idFile = UUID.randomUUID();
                File dest = new File(imageDir+""+idFile+".jpeg");
                file.renameTo(dest);
               // if(uploadAndPublish(file)){
                    ArrayList data = new ArrayList();
                    data.add(Config.getString("img-WS-Route")+idFile+".jpeg");
                    //build answer
                    ObjectNode response = hecticusResponse(0, "ok", "urlimage", data);
                    return ok(response);
//                }else{
//                    //return badRequest(buildBasicResponse(-3, "no se pudo subir la imagen"));
//                    return ok("no se pudo subir la imagen");
//                }
            }else{
                return badRequest(buildBasicResponse(-2, "no hay imagen a subir"));
                //return ok("no hay imagen a subir");
            }
        }catch (Exception ex){
            return badRequest(buildBasicResponse(-1, "ocurrio un error:" + ex.toString()));
            //return ok("ocurrio un error:" + ex.toString());
        }
//        return ok("ok");
    }

    /*private static boolean uploadAndPublish(File file){

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
            //resources

            uploadFile(upload, retry, containerName, file, "yoinformo", init);
            //publish
            pub.enableCdnContainer(containerName, TTL);
            return true;
        }catch (Exception ex){
//            Utils.printToLog(null, "FUUUUUUUUUUUUUUUUUUUUUU" + (System.currentTimeMillis() - init) + " ms", "FUUUUUUUUUUUUUUUUU", false, ex, "", 3);
            //String emsg = "error subiendo los archivos a los cloudFiles, el proceso no se completo";
            return false;
        }
//        return true;
    }*/

    public static Result getImg(String name){
        File file = null;
        File f2 = new File(imageDir + name);
        if(f2.exists()){
            file = Play.application(play.api.Play.current()).getFile(imageDir + name);
        } else {
            file = Play.application(play.api.Play.current()).getFile(imageDir + Config.getString("default-img"));
        }
        return ok(file);
    }
}
