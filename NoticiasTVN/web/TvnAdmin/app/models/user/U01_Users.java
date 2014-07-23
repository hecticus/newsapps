package models.user;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.avaje.ebean.Page;

import models.HecticusModel;
import play.data.validation.*;
import play.db.ebean.Model;
import play.libs.Json;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Entity
@Table(name="u01_users")
public class U01_Users extends HecticusModel {

	@Id
	public Long u01_Id;
	
	@Constraints.Required(message ="Este campo es requerido")
	@Constraints.MinLength(value = 5, message ="Longitud mínima es de 5 caracteres." )	
	public String u01_Login;
		
	@Constraints.Required(message ="Este campo es requerido")
	@Constraints.MinLength(value = 6, message ="Longitud mínima es de 6 caracteres.")
	public String u01_Password;

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
    		  

    public static U01_Users getUsers(String u01_login){
        return finder.where().eq("u01_login", u01_login).findUnique();
    }
    
    public static List<U01_Users> getAllUsers(){
        return finder.all();
    }
   
    
    @Override
    public ObjectNode toJson() {
        return null;
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
