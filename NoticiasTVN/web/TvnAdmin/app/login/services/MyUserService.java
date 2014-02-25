package login.services;



import org.joda.time.DateTime;

import models.user.U01_Users;
import play.Application;

import play.db.ebean.Model.Finder;
import securesocial.core.Identity;
import securesocial.core.IdentityId;
import securesocial.core.SocialUser;
import securesocial.core.java.BaseUserService;
import securesocial.core.java.Token;

public class MyUserService extends BaseUserService {

	private InMemoryUserService memoryUserService = new InMemoryUserService();
	
	public MyUserService(Application application) {
		super(application);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void doDeleteExpiredTokens() {
		// TODO Auto-generated method stub
		memoryUserService.doDeleteExpiredTokens();;
	}

	@Override
	public void doDeleteToken(String arg0) {
		// TODO Auto-generated method stub
		memoryUserService.doDeleteToken(arg0);
	}

	@Override
	public Identity doFind(IdentityId arg0) {
		// TODO Auto-generated method stub
		Finder<Long, U01_Users> finder = new Finder<Long, U01_Users>(Long.class, U01_Users.class);
		return finder.where().eq("u01_login", arg0.userId()).findUnique();
		
	}

	@Override
	public Identity doFindByEmailAndProvider(String arg0, String arg1) {
		// TODO Auto-generated method stub
		Finder<Long, U01_Users> finder = new Finder<Long, U01_Users>(Long.class, U01_Users.class);
		return finder.where().eq("u01_email", arg0).findUnique();
	}

	@Override
	public Token doFindToken(String arg0) {
		// TODO Auto-generated method stub
		return memoryUserService.doFindToken(arg0);

	}

	@Override
	public Identity doSave(Identity arg0) {
		// TODO Auto-generated method stub

		SocialUser users = (SocialUser) arg0;
		U01_Users entityUser = new U01_Users();
		entityUser.u01_Login = users.identityId().userId();
		entityUser.u01_Password = users.passwordInfo().get().password();
		
		//controllers.Application.test = entityUser.u01_Login;
		entityUser.u01_Email = users.email().get();
		entityUser.u01_AllCountries = true;
		Finder<Long, U01_Users> finder = new Finder<Long, U01_Users>(Long.class, U01_Users.class);
		U01_Users bdUsers = finder.where().eq("u01_login", entityUser.u01_Login).findUnique();
		if(bdUsers == null){
			entityUser.save();
		}else if(entityUser.u01_Password != bdUsers.u01_Password
				||entityUser.u01_Email != bdUsers.u01_Email
				||entityUser.u01_AllCountries != bdUsers.u01_AllCountries){
			entityUser.u01_Id = bdUsers.u01_Id;
			entityUser.update();
		}
		return entityUser;
	}

	@Override
	public void doSave(Token arg0) {
		// TODO Auto-generated method stub
		Token token = new Token();
		token.expirationTime = new DateTime();

		memoryUserService.doSave(arg0);
	}

}
