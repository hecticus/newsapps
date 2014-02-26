package login.services;

import java.util.HashMap;
import java.util.Map;

import play.Logger;
import play.api.Application;
import play.api.data.Form;
import play.api.mvc.Cookie;
import play.api.mvc.Request;
import play.api.templates.Html;
import play.libs.Json;
import scala.Option;
import scala.Tuple2;
import scala.collection.mutable.StringBuilder;
import securesocial.controllers.DefaultTemplatesPlugin;
import securesocial.controllers.TemplatesPlugin;
import views.html.*;


public class MyTemplatePlugin extends DefaultTemplatesPlugin implements TemplatesPlugin{

	public MyTemplatePlugin(Application application) {
		super(application);
		// TODO Auto-generated constructor stub
	}

	/*@Override
	public <A> Html getLoginPage(Request<A> request,
			Form<Tuple2<String, String>> form, Option<String> msg) {
		// TODO Auto-generated method stub
		Option<Cookie> x = request.cookies().get("extjs");
		if(x != null && !x.isEmpty()){
			Logger.info(x.get().value());
			Map<String, Object> map = new HashMap<String,Object>();
		      map.put("success", true);
		      map.put("message", "You must login");
			return extjsexception.render(Json.toJson(map).toString());
		}
		return super.getLoginPage(request, form, msg);
	}*/
	
	@Override
	public <A> Html getNotAuthorizedPage(Request<A> arg0) {
		//arg0.host();
		Logger.info("paso por WithProfile");
		Logger.info(arg0.host());
		Logger.info(arg0.path());
		Logger.info(arg0.rawQueryString());
		Logger.info(arg0.body().getClass().getCanonicalName());
		Option<Cookie> x = arg0.cookies().get("extjs");
		if(x != null && !x.isEmpty()){
			Logger.info(x.get().value());
			Map<String, Object> map = new HashMap<String,Object>();
		      map.put("success", true);
		      map.put("message", "Not Authorized");
			//return extjsexception.render(Json.toJson(map).toString());
		}
		return super.getNotAuthorizedPage(arg0);
		
	}

}
