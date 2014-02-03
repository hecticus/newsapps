package com.plugin.sms;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;

import com.google.analytics.tracking.android.Log;

import android.telephony.SmsManager;

public class SMSPlugin extends CordovaPlugin {
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callback) {
		String phoneNumber = "4169111109";
		Log.d("SMSPlugin JAVA");
		if (action.equals("sendSMS")) {
			try {
				String message = args.getString(0);
				SmsManager sms = SmsManager.getDefault();
      			sms.sendTextMessage(phoneNumber, null, message, null, null);
				callback.success("sendSMS - message = " + args.getString(0) + ";");
				Log.d("SMSPlugin JAVA COMPLETE");
				return true;
			} catch (final Exception e) {
				Log.d("SMSPlugin JAVA ERROR");
				callback.error(e.getMessage());
			}
		} 
		return false;
	}
}

