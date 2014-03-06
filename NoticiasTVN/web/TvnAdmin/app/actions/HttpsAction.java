package actions;

import play.Logger;
import play.Play;
import play.mvc.Action;
import play.mvc.Http.Request;
import play.mvc.Result;
import play.mvc.Http.Context;


public class HttpsAction extends Action.Simple {
	
	private static final String SSL_HEADER = "x-forwarded-proto";
    private static String httpsPort;
    
	@Override
	public Result call(Context ctx) throws Throwable {
		// TODO Auto-generated method stub
		Logger.info("paso por HttpsAction");
		//return delegate.call(ctx);
	
		if (!isHttpsRequest(ctx.request())) {
			Logger.info("paso por HttpsAction !isHttpsRequest");
            String url = redirectHostHttps(ctx) + ctx.request().uri() + "login";
            
            Logger.info(url);
            return redirect(url);
        } else {
        	Logger.info("paso por HttpsAction isHttpsRequest");
            // Let request proceed.
        	return delegate.call(ctx);
        }
		
	}
	
	public static String redirectHostHttps( Context ctx) {
		 
        String[] pieces = ctx.request().host().split(":");
        String ret = "https://" + pieces[0];
 
        // In Dev mode we want to append the port.  
        // In Prod mode, no need to append the port as we use the standard https port, 443.
        if(Play.isDev() ) {
            ret += ":" + getHttpsPort();
        }
 
        return ret;
    }
 
    public static boolean isHttpsRequest( Request request ) {
        return (request.getHeader(SSL_HEADER) != null
            && request.getHeader(SSL_HEADER).contains("https")) 
            || isOverHttpsPort(request.host());  
    }
 
    public static boolean isOverHttpsPort( String host ) {
        boolean ret = false;
        String[] hostParts = host.split(":");
 
        if( hostParts.length > 1 ) {
            ret = hostParts[1].equalsIgnoreCase(getHttpsPort());
        }
 
        return ret;
    }
 
    private synchronized static String getHttpsPort() {
        if( httpsPort == null ) 
            httpsPort = (String) Play.application().configuration().getString("https.port"); 
        return httpsPort;  
    }
	
}
