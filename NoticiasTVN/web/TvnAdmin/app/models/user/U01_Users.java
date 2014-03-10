package models.user;


import java.util.LinkedHashMap;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.codehaus.jackson.node.ObjectNode;
import org.mindrot.jbcrypt.BCrypt;

import com.avaje.ebean.Page;

import models.HecticusModel;
import play.Play;
import play.data.validation.*;
import play.db.ebean.Model;
import scala.Option;
import securesocial.core.AuthenticationMethod;
import securesocial.core.Identity;
import securesocial.core.IdentityId;
import securesocial.core.OAuth1Info;
import securesocial.core.OAuth2Info;
import securesocial.core.PasswordInfo;
import securesocial.core.providers.utils.BCryptPasswordHasher;

@Entity
@Table(name="u01_users")
public class U01_Users extends HecticusModel implements Identity {

	/*
	 *	Las anotaciones @Required y @Email se utilizan para validar los campos del formulario
	 *  correspondientes al atributo del modelo.
	 *  
	 *   Para mayor información visitar:
	 *   	http://www.playframework.com/documentation/2.1.x/JavaForms
	 *   	
	 */
	//private static final long serialVersionUID = 1L;
	
	@Id
	public Long u01_Id;
	
	@Constraints.Required
	@Constraints.MinLength(6)	
	public String u01_Login;
		
	@Constraints.Required
	@Constraints.MinLength(6)
	public String u01_Password;

	@Constraints.Required
	@Constraints.Email
	public String u01_Email;

	
	public static Model.Finder<Long, U01_Users> finder =
			  new Model.Finder<Long, U01_Users>(Long.class, U01_Users.class);
	
	public U01_Users() {}
	
	public U01_Users(String u01_Login, String u01_Password, String u01_Email) {
		this.u01_Login = u01_Login;
		this.u01_Password = u01_Password;
		this.u01_Login = u01_Login;		
	}		  
	
	
  	public Long getU01_Id() {
        return u01_Id;
    }

    public void setU01_Id(Long u01_Id) {
        this.u01_Id = u01_Id;
    }

    public String getU01_Login() {
        return u01_Login;
    }

    public void setU01_Login(String u01_Login) {
        this.u01_Login = u01_Login;
    }

    public String getU01_Password() {
        return u01_Password;
    }

    public void setU01_Password(String u01_Password) {
        this.u01_Password = u01_Password;
    }

    public String getU01_Email() {
        return u01_Email;
    }

    public void setU01_Email(String u01_Email) {
        this.u01_Email = u01_Email;
    }
    		  
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
    
    
    
    public static List<U01_Users> getUsers(String u01_login){
        return finder.where().eq("u01_login", u01_login).findList();
    }
    
    public static List<U01_Users> getAllUsers(){
        return finder.all();
    }
    
    
    /**
     * Return a page of computer
     *
     * @param page Page to display
     * @param pageSize Number of computers per page
     * @param sortBy Computer property used for sorting
     * @param order Sort order (either or asc or desc)
     * @param filter Filter applied on the name column
     */
    public static Page<U01_Users> page(int page, int pageSize, String sortBy, String order, String filter) {
        return 
        	finder.where()
                .ilike("u01_login", "%" + filter + "%")
                .orderBy(sortBy + " " + order)
                .findPagingList(pageSize)
                .getPage(page);
    }
    
    
}
