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

package com.tvn.tvmax;

import android.graphics.Point;
import android.os.Bundle;
import android.view.Display;

import org.apache.cordova.*;


public class TVMaxDeportes extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.setIntegerProperty("SplashScreenDelay", 6000);
        
        
        // Clear cache if you want
     	super.appView.clearCache(true);
     	super.clearCache();
        
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
		
		int videoValue = R.raw.v720_1280;
		
		//determinamos el mejor video para la resolucion de pantalla
		if(minSize<450){
			videoValue = R.raw.v480_640;
		}else if(minSize<730){
			videoValue = R.raw.v720_1280;
		}else if(minSize<1090){
			videoValue = R.raw.v1080_1920;
		}else{
			//videoValue = R.raw.v1600_2560;
			videoValue = R.raw.v1080_1920;
		}
		if (android.os.Build.VERSION.SDK_INT < 9){
			videoValue = R.raw.vh263;
		}
		super.setStringProperty("SplashScreenVideo", "android.resource://com.tvn.tvmax/" + videoValue);
		
        
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
    }
}

