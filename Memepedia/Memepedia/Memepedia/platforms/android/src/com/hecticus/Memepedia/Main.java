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

package com.hecticus.Memepedia;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Point;
import android.os.Bundle;
import android.view.Display;

import org.apache.cordova.*;

public class Main extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
    	super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
    	
    	//obtenemos los valores de alto y ancho
    	Display display = getWindowManager().getDefaultDisplay();
    	Point size = new Point();
    	display.getSize(size);
    	int width = size.x;
    	int height = size.y;
    	if(width > height){
    		int temp = height;
    		height = width;
    		width = temp;
    	}
    	
    	//colocamos los valores de ancho y alto primero
    	SharedPreferences sharedPref = this.getActivity().getPreferences(Context.MODE_PRIVATE);
    	SharedPreferences.Editor editor = sharedPref.edit();
        editor.putString("device_width", ""+width);
        editor.putString("device_height", ""+height);
        editor.commit();
        
        loadUrl(launchUrl);
        super.appView.clearCache(true);
     	super.clearCache();
    }
}
