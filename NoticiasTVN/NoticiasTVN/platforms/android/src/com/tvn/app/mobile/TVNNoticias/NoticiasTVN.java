/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.tvn.app.mobile.TVNNoticias;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.graphics.Point;
import android.os.Bundle;
import android.provider.Settings;
import android.view.Display;

import org.apache.cordova.*;

import com.google.analytics.tracking.android.Log;
import com.tvn.app.mobile.TVNNoticias.R;

public class NoticiasTVN extends CordovaActivity 
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        
        //setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        
        // Load your application
     	super.setIntegerProperty("splashscreen", R.drawable.splash);
     	super.setIntegerProperty("SplashScreenDelay", 4000);
     	super.appView.clearCache(true);
     	super.clearCache(); // just add This Line
     	
     	int width;
		int height;
		
		Display display = getWindowManager().getDefaultDisplay();
		
		if (android.os.Build.VERSION.SDK_INT >= 13){
			Point size = new Point();
			display.getSize(size);
			width = size.x;
			height = size.y;
		}else{
			width = display.getWidth();
			height = display.getHeight();
		}
		int minSize = 0;
		if(width<height){
			minSize = width;
		}else{
			minSize = height;
		}
		
		int videoValue = R.raw.vbasic;
		
		//determinamos el mejor video para la resolucion de pantalla
		if(minSize<450){
			//videoValue = R.raw.v480p;
			videoValue = R.raw.v540x960_level3_1;
		}else if(minSize<720){
			videoValue = R.raw.v540x960_level3_1;
		}else if(minSize<1080){
			videoValue = R.raw.v720x1280_level3_1;
		}else{
			//videoValue = R.raw.v1600_2560;
			videoValue = R.raw.v720x1280_level3_1;
		}
		if (android.os.Build.VERSION.SDK_INT < 9){
			//videoValue = R.raw.vbasic;
		}
		//videoValue = R.raw.test;
		super.setStringProperty("SplashScreenVideo", "android.resource://com.tvn.app.mobile.TVNNoticias/" + videoValue);
		
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")
        
        //Log.e("IS TABLET "+isTablet(this));
    }
    
    public static boolean isTablet(Context context)
    {
       return (context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE;
    }
}


