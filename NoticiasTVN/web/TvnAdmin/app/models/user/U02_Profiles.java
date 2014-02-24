package models.user;

import java.util.LinkedHashMap;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints.Required;
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
	
}
