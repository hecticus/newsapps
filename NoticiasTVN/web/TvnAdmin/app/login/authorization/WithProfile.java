package login.authorization;



import play.Logger;
import models.user.U01_Users;
import securesocial.core.Identity;
import securesocial.core.java.Authorization;

public class WithProfile implements Authorization {

	@Override
	public boolean isAuthorized(Identity user,String[] params) {
		// TODO Auto-generated method stub
		Logger.info("paso por WithProfile");
		for(int i=0;i<params.length;i++){
			int size = ((U01_Users)user).profiles.size();
			for(int j =0; j<size;j++){
				
				String profile = ((U01_Users)user).profiles.get(j).u02_Name;

				if(profile.equals(params[i])){
					return true;
				}
			}
		}
		return false;
	}

}
