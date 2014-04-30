package models.news;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.EbeanServer;
import com.avaje.ebean.Page;
import exceptions.TrendingTopicException;
import models.HecticusModel;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;
import play.data.validation.Constraints;
import play.libs.Json;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="trendingTopics")
public class TrendingTopics extends HecticusModel{

	@Id
	private Long idTrendingTopics;

	@Constraints.Required
	private String category;

    @Constraints.Required
    private String title;

	@Constraints.Pattern(value = "(@)?(href=')?(HREF=')?(HREF=\")?(href=\")?(http://)?[a-zA-Z_0-9\\-]+(\\.\\w[a-zA-Z_0-9\\-]+)+(/[#&\\n\\-=?\\+\\%/\\.\\w]+)?", message="Example: http://www.hecticus.com")
    private String image;

	public static Finder<Long,TrendingTopics> finder =
			  new Finder<Long, TrendingTopics>(Long.class, TrendingTopics.class);

	public TrendingTopics() {}

	public TrendingTopics(JsonNode data) throws TrendingTopicException{
        if (data.has("categoria")) {
            category = data.get("categoria").asText();
        } else {
            throw new TrendingTopicException("categoria faltante");
        }

        if (data.has("titulo")) {
            title = data.get("titulo").asText();
        } else {
            throw new TrendingTopicException("titulo faltante");
        }

        image = "";
        if (data.has("imagen")) {
            image = data.get("imagen").asText();
        }
	}

    @Override
    public ObjectNode toJson() {
        ObjectNode tr = Json.newObject();
        tr.put("ID", Long.parseLong(category));
        tr.put("Title",title);
        tr.put("ImageUrl",image);
        return tr;
    }

    public static List<TrendingTopics> getAllTrendingTopics(){
        return finder.all();
    }

    public static void insertBatch(ArrayList<TrendingTopics> list, List<TrendingTopics> listOld){
        EbeanServer server = Ebean.getServer("default");
        try {
            server.beginTransaction();
            //borramos los viejos si hay nuevos
            if(list.size() > 0){
                for (int i =0; i < listOld.size(); i++){
                   server.delete(listOld.get(i));
                }
            }
            //insertamos los nuevos
            for (int i =0; i < list.size(); i++){
                server.insert(list.get(i));
            }
            server.commitTransaction();
        }catch (Exception ex){
            server.rollbackTransaction();
            throw ex;
        }finally {
            server.endTransaction();
        }

    }

}
