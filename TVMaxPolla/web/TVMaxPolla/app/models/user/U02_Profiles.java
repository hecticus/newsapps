package models.user;

import java.util.LinkedHashMap;
import java.util.Map;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.db.ebean.Model.Finder;
import models.HecticusModel;


@Entity
@Table(name="u02_profiles")
public class U02_Profiles extends Model {

	@Id
	public Long u02_Id;
	
	@Constraints.Required(message ="Este campo es requerido")	
	public String u02_Name;
	

	public static Model.Finder<Long, U02_Profiles> finder =
			new Model.Finder<Long, U02_Profiles>(Long.class, U02_Profiles.class);
		
	public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        for(U02_Profiles c: U02_Profiles.finder.orderBy("u02_Name").findList()) {
            options.put(c.u02_Id.toString(), c.u02_Name);
        }
	    return options;
	}
	
    
}
