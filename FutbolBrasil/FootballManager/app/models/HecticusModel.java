package models;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.codec.digest.DigestUtils;
import play.db.ebean.Model;

import javax.persistence.MappedSuperclass;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

@MappedSuperclass
@SuppressWarnings("serial")
public abstract class HecticusModel extends Model {

    public static final int MAX_SIZE = 20;

    public static final String CDN_URL = "http://9412fdf6c01bc9771bc2-f7308435bd9ae7a6ffc150d7e895a463.r87.cf1.rackcdn.com/img/";

	/**
	 * Metodo para retornar la data como un json, es necesario para aquellos modelos que tienen un objeto interno que
     * establece una relacion.
	 * ObjectNode no puede resolver los ciclos en las relaciones y si se intenta insertar un modelo en un
     * ObjectNode explota porque se queda
	 * resolviendo la relacion hasta el infinito. La solucion sin cambiar la version de la libreria actual
     * es usar este metodo
	 * 
	 * @return un objeto con todos los valores del modelo 
	 */
	public abstract ObjectNode toJson();

    public String decode(String val){
        String tr = null;
        try {
            tr= URLDecoder.decode(val, "UTF-8");
        }catch (Exception ex){

        }
        return tr;
    }

    public String encode(String val){
        String tr = null;
        try {
            tr= URLEncoder.encode(val, "UTF-8");
        }catch (Exception ex){

        }
        return tr;
    }

    public String createMd5(String message){
        String tr = DigestUtils.md5Hex(message);
        return tr;
    }

    public static final String DEFAULT_TIMEZONE = "America/Caracas";
}
