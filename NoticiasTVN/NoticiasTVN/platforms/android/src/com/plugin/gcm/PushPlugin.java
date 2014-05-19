package com.plugin.gcm;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;

import org.apache.http.message.BasicNameValuePair;

import com.google.android.gcm.*;

/**
 * @author awysocki
 */

public class PushPlugin extends CordovaPlugin {
	public static final String TAG = "PushPlugin";
	
	public static final String REGISTER = "register";
	public static final String UNREGISTER = "unregister";
	public static final String EXIT = "exit";
	
	public static final String PROPERTY_REG_ID = "registration_id";
    private static final String PROPERTY_APP_VERSION = "appVersion";

	private static CordovaWebView gWebView;
	private static String gECB;
	private static String gSenderID;
	private static Bundle gCachedExtras = null;
    private static boolean gForeground = false;
    
    public static final String PUSH_PREFS_NAME = "NoticiasTVNPushPrefsFile";

	/**
	 * Gets the application context from cordova's main activity.
	 * @return the application context
	 */
	private Context getApplicationContext() {
		return this.cordova.getActivity().getApplicationContext();
	}

	@Override
	public boolean execute(String action, JSONArray data, CallbackContext callbackContext) {

		boolean result = false;

		//Log.v(TAG, "execute: action=" + action);

		if (REGISTER.equals(action)) {

			//Log.v(TAG, "execute: data=" + data.toString());

			try {
				JSONObject jo = data.getJSONObject(0);
				
				gWebView = this.webView;
				//Log.v(TAG, "execute: jo=" + jo.toString());

				gECB = (String) jo.get("ecb");
				gSenderID = (String) jo.get("senderID");

				//Log.v(TAG, "execute: ECB=" + gECB + " senderID=" + gSenderID);
				
				//revisar si todo esta bien configurado
				GCMRegistrar.checkDevice(getApplicationContext());
			    GCMRegistrar.checkManifest(getApplicationContext());
				
			    final String regId = GCMRegistrar.getRegistrationId(getApplicationContext());
			    
			    //Log.v(TAG, "execute: REGID?" + regId);
			    
			    // Check if app was updated; if so, it must clear the registration ID
		        // since the existing regID is not guaranteed to work with the new
		        // app version.
			    SharedPreferences settings = getApplicationContext().getSharedPreferences(PUSH_PREFS_NAME, Context.MODE_PRIVATE);
		        int registeredVersion = settings.getInt(PROPERTY_APP_VERSION, Integer.MIN_VALUE);
		        int currentVersion = getAppVersion(getApplicationContext());

		        //Log.v(TAG, "regId=" + regId);
				//GCMRegistrar.register(getApplicationContext(), gSenderID);
				if (regId.equals("") || currentVersion!=registeredVersion) {
		            // Automatically registers application on startup.
			    	GCMRegistrar.register(getApplicationContext(), gSenderID);
		        } else {
		            // Device is already registered on GCM, check server.
		            if (GCMRegistrar.isRegisteredOnServer(getApplicationContext())) {
		                // Skips registration.
		            	//GCMRegistrar.unregister(getApplicationContext());
		            } else {
		                // Try to register again, but not in the UI thread.
				    	GCMRegistrar.register(getApplicationContext(), gSenderID);
		            }
		        }
			    result = true;
		    	callbackContext.success();
			} catch (JSONException e) {
				Log.e(TAG, "execute: Got JSON Exception " + e.getMessage());
				result = false;
				callbackContext.error(e.getMessage());
			}

			if ( gCachedExtras != null) {
				//Log.v(TAG, "sending cached extras");
				sendExtras(gCachedExtras);
				gCachedExtras = null;
			}
			
		} else if (UNREGISTER.equals(action)) {

			GCMRegistrar.unregister(getApplicationContext());

			//Log.v(TAG, "UNREGISTER");
			result = true;
			callbackContext.success();
		} else {
			result = false;
			//Log.e(TAG, "Invalid action : " + action);
			callbackContext.error("Invalid action : " + action);
		}

		return result;
	}

	/*
	 * Sends a json object to the client as parameter to a method which is defined in gECB.
	 */
	public static void sendJavascript(JSONObject _json) {
		String _d = "javascript:" + gECB + "(" + _json.toString() + ")";
		//Log.v(TAG, "sendJavascript: " + _d);

		if (gECB != null && gWebView != null) {
			gWebView.sendJavascript(_d); 
		}
	}

	/*
	 * Sends the pushbundle extras to the client application.
	 * If the client application isn't currently active, it is cached for later processing.
	 */
	public static void sendExtras(Bundle extras)
	{
		if (extras != null) {
			if (gECB != null && gWebView != null) {
				sendJavascript(convertBundleToJson(extras));
			} else {
				//Log.v(TAG, "sendExtras: caching extras to send at a later time.");
				gCachedExtras = extras;
			}
		}
	}
	
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        gForeground = true;
    }
	
	@Override
    public void onPause(boolean multitasking) {
        super.onPause(multitasking);
        gForeground = false;
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        gForeground = true;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        gForeground = false;
		gECB = null;
		gWebView = null;
    }

    /*
     * serializes a bundle to JSON.
     */
    private static JSONObject convertBundleToJson(Bundle extras)
    {
		try
		{
			JSONObject json;
			json = new JSONObject().put("event", "message");
        
			JSONObject jsondata = new JSONObject();
			Iterator<String> it = extras.keySet().iterator();
			while (it.hasNext())
			{
				String key = it.next();
				Object value = extras.get(key);	
        	
				// System data from Android
				if (key.equals("from") || key.equals("collapse_key"))
				{
					json.put(key, value);
				}
				else if (key.equals("foreground"))
				{
					json.put(key, extras.getBoolean("foreground"));
				}
				else if (key.equals("coldstart"))
				{
					json.put(key, extras.getBoolean("coldstart"));
				}
				else
				{
					// Maintain backwards compatibility
					if (key.equals("message") || key.equals("msgcnt") || key.equals("soundname"))
					{
						json.put(key, value);
					}
        		
					if ( value instanceof String ) {
					// Try to figure out if the value is another JSON object
						
						String strValue = (String)value;
						if (strValue.startsWith("{")) {
							try {
								JSONObject json2 = new JSONObject(strValue);
								jsondata.put(key, json2);
							}
							catch (Exception e) {
								jsondata.put(key, value);
							}
							// Try to figure out if the value is another JSON array
						}
						else if (strValue.startsWith("["))
						{
							try
							{
								JSONArray json2 = new JSONArray(strValue);
								jsondata.put(key, json2);
							}
							catch (Exception e)
							{
								jsondata.put(key, value);
							}
						}
						else
						{
							jsondata.put(key, value);
						}
					}
				}
			} // while
			json.put("payload", jsondata);
        
			//Log.v(TAG, "extrasToJSON: " + json.toString());

			return json;
		}
		catch( JSONException e)
		{
			Log.e(TAG, "extrasToJSON: JSON exception");
		}        	
		return null;      	
    }

    public static boolean isInForeground()
    {
      return gForeground;
    }

    public static boolean isActive()
    {
    	return gWebView != null;
    }
    
  //extra functions
  	public static void registerDeviceOnServer(Context context, String regId) {
  	    // Create a new HttpClient and Post Header
  	    HttpClient httpclient = new DefaultHttpClient();
  	    //HttpPost httppost = new HttpPost("http://visitpanama.hecticus.com/ws/gcm/register.php");
  	    
  	    //Log.v(TAG, "REGID: " + regId);
  	    HttpPost httppost = new HttpPost("http://kraken.hecticus.com/storefront/wsext/mobile_push/noticiastvn/activatePushClient.php");
  	    //HttpPost httppost = new HttpPost("http://10.0.3.148/kraken/storefront/wsext/mobile_push/noticiastvn/activatePushClient.php");

  	    try {
  	    	//Get Stored id if exists
			SharedPreferences settings = context.getSharedPreferences(PUSH_PREFS_NAME, Context.MODE_PRIVATE);
			String storedRegId = settings.getString(PROPERTY_REG_ID, "");
			
			//Log.v(TAG, "REGID: " + regId+" OLD: "+storedRegId);
			
  	        // Add your data
  	        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
  	        nameValuePairs.add(new BasicNameValuePair("ext_id", regId));
  	        nameValuePairs.add(new BasicNameValuePair("id_country", "8")); //panama
  	        nameValuePairs.add(new BasicNameValuePair("command", "ALTA"));
  	        nameValuePairs.add(new BasicNameValuePair("origin", "ANDROID"));
  	        nameValuePairs.add(new BasicNameValuePair("service_type", "droid"));
  	        nameValuePairs.add(new BasicNameValuePair("token", "NOTICIASTVN"));
  	        if(storedRegId != null && !storedRegId.equals("") && !storedRegId.equals(regId)){
  	        	//Log.v(TAG, "ENVIANDO OLD");
  	        	//hay que mandar el regID viejo y eliminarlo
  	        	nameValuePairs.add(new BasicNameValuePair("old_ext_id", storedRegId));
  	        }else{
  	        	if(storedRegId != null && !storedRegId.equals("") && storedRegId.equals(regId)){
  	        		//no hay cambio por lo tanto no hay que llamar al WS
  	        		return;
  	        	}
  	        }
  	        httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

  	        // Execute HTTP Post Request
  	        HttpResponse response = httpclient.execute(httppost);
  	        //Log.e(TAG, "Response registerDeviceOnServer: "+response.toString());
  	        try {
  	        	//Log.v(TAG, "OBJETO JSON\n\n"+response.toString());
	  	        JSONObject obj = new JSONObject(GetText(response.getEntity().getContent()));
	  	        //Log.v(TAG, obj.toString()+"\n\n");
	  	        if(obj!=null && obj.getInt("error")==0){
	  	        	//Log.v(TAG, "TODO SALIO BIEN");
	  	        	//si todo salio bien en el WS se guarda el nuevo registro
	  	        	int appVersion = getAppVersion(context);
	  	        	SharedPreferences.Editor editor = settings.edit();
	  	        	editor.putString(PROPERTY_REG_ID, regId);
	  	        	editor.putInt(PROPERTY_APP_VERSION, appVersion);
	  	        	editor.commit();
	  	        
	  	        	//le indicamos al servidor de android que nos queremos registrar para push
	  	        	GCMRegistrar.setRegisteredOnServer(context, true);
	  	        }else{
	  	        	//Log.v(TAG, "ERROR");
	  	        }
	  	    } catch (Throwable t) {
	  	        Log.e(TAG, "Could not parse malformed JSON: \"" + response.toString() + "\"");
	  	    }
 
  	    } catch (ClientProtocolException e) {
  	    	Log.e(TAG, "Error: "+e);
  	    } catch (IOException e) {
  	    	Log.e(TAG, "Error: "+e);
  	    }
  	} 
  	
  	public static void unregisterDeviceOnServer(Context context, String regId) {
  	    // Create a new HttpClient and Post Header
  	    /*HttpClient httpclient = new DefaultHttpClient();
  	    HttpPost httppost = new HttpPost("http://hecticus.com/ws/gcm/unregister.php");

  	    try {
  	        // Add your data
  	        List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
  	        nameValuePairs.add(new BasicNameValuePair("regId", regId));
  	        httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));

  	        // Execute HTTP Post Request
  	        HttpResponse response = httpclient.execute(httppost);
  	        //Log.e(TAG, "Response unregisterDeviceOnServer: "+response.toString());
  	        
  	        GCMRegistrar.setRegisteredOnServer(context, false);

  	    } catch (ClientProtocolException e) {
  	    	Log.e(TAG, "Error: "+e);
  	    } catch (IOException e) {
  	    	Log.e(TAG, "Error: "+e);
  	    }*/
  	}
  	
  	/**
     * @return Application's version code from the {@code PackageManager}.
     */
    private static int getAppVersion(Context context) {
        try {
            PackageInfo packageInfo = context.getPackageManager()
                    .getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionCode;
        } catch (NameNotFoundException e) {
            // should never happen
            //throw new RuntimeException("Could not get package name: " + e);
        	return -1;
        }
    }
    
    public static String GetText(InputStream in) {
    	String text = "";
    	BufferedReader reader = new BufferedReader(new InputStreamReader(in));
    	StringBuilder sb = new StringBuilder();
    	String line = null;
    	try {
    		while ((line = reader.readLine()) != null) {
    			sb.append(line + "\n");
    		}
    		text = sb.toString();
    	} catch (Exception ex) {

    	} finally {
    		try {

    			in.close();
    		} catch (Exception ex) {
    		}
    	}
    	return text;
    }
}
