package models.user;


import java.util.LinkedHashMap;
import java.util.List;











import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;


import org.codehaus.jackson.node.ObjectNode;
import org.mindrot.jbcrypt.BCrypt;

import models.HecticusModel;
import play.Play;
import play.data.validation.Constraints.Email;
import play.data.validation.Constraints.Required;

import scala.Option;
import securesocial.core.AuthenticationMethod;
import securesocial.core.Identity;
import securesocial.core.IdentityId;
import securesocial.core.OAuth1Info;
import securesocial.core.OAuth2Info;
import securesocial.core.PasswordInfo;
import securesocial.core.providers.utils.BCryptPasswordHasher;

@Entity
public class U01_Users extends HecticusModel implements Identity {

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
	public Integer u01_Id;
	@Required
	public String u01_Login;
	public String u01_Password;
	@Email
	public String u01_Email;
	public Boolean u01_AllCountries;
	
	/*
	 *  Se usa (fetch=FetchType.EAGER) para desabilitar la evaluacion perezosa de
	 *  los elementos de la relacion. Esto es necesario para poder cargar la lista
	 *  con sus relaciones en el grid de extjs, de lo contrario, al modificar un
	 *  campo en el grid las relaciones se eliminan.
	 */
	@ManyToMany(fetch=FetchType.EAGER) 
	public List<U02_Profiles> profiles;
			
	@Override
	public AuthenticationMethod authMethod() {
		// TODO Auto-generated method stub
		return AuthenticationMethod.UserPassword();
	}

	@Override
	public Option<String> avatarUrl() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Option<String> email() {
		// TODO Auto-generated method stub
		return Option.apply(this.u01_Email);
	}

	@Override
	public String firstName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String fullName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public IdentityId identityId() {
		// TODO Auto-generated method stub
		IdentityId boj = new IdentityId(this.u01_Login.toString(),"");
		
		return  boj;
	}

	@Override
	public String lastName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Option<OAuth1Info> oAuth1Info() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Option<OAuth2Info> oAuth2Info() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Option<PasswordInfo> passwordInfo() {
		// TODO Auto-generated method stub
		Integer rouds = Play.application().configuration().getInt("securesocial.passwordHasher.bcrypt.rounds");
		if (rouds == null){
			rouds = new Integer(10);
		}
		String salt = BCrypt.gensalt(rouds);
		Option<PasswordInfo> x = Option.apply(new PasswordInfo(BCryptPasswordHasher.BCryptHasher(), this.u01_Password, Option.apply(salt)));
		
		return x;//Option.apply(new PasswordInfo(BCryptPasswordHasher.BCryptHasher(), this.u01_Password, Option.apply((String)null)));
	}

    @Override
    public ObjectNode toJson() {
        return null;
    }
}
