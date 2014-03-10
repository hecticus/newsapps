package models.user;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.codehaus.jackson.node.ObjectNode;

import play.data.validation.Constraints.Required;
import play.db.ebean.Model;
import models.HecticusModel;

@Entity
public class U02_Profiles extends HecticusModel {

	/*
	 *	Las anotaciones @Required y @Email se utilizan para validar los campos del formulario
	 *  correspondientes al atributo del modelo.
	 *  
	 *   Para mayor información visitar:
	 *   	http://www.playframework.com/documentation/2.1.x/JavaForms
	 *   	
	 */
	private static final long serialVersionUID = 1L;
	
	
	@Id
	public Integer u02_Id;
	@Required
	public String u02_Name;

    @Override
    public ObjectNode toJson() {
        return null;
    }
    
    
    /*public static Model.Finder<Long,U02_Profiles> find = new Model.Finder<Long,U02_Profiles>(Long.class, U02_Profiles.class);

    public static Map<String,String> options() {
        LinkedHashMap<String,String> options = new LinkedHashMap<String,String>();
        for(U02_Profiles c: U02_Profiles.find.orderBy("u02_Name").findList()) {
            options.put(c.u02_Id.toString(), c.u02_Name);
        }
        return options;
    }*/
    
}
