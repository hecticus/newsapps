//vars id:$(this).attr('duid'),headline:'',date:'',thumbnail:[],highdef:[],quicklook:[],caption:[],video:[],datacontent:''
var createNewsQuery = 'CREATE TABLE IF NOT EXISTS NEWS (news_id INTEGER PRIMARY KEY AUTOINCREMENT ,'+
'news_headline TEXT NOT NULL,'+
'news_date VARCHAR(30) DEFAULT NULL,'+
'news_thumbnail_en TEXT DEFAULT NULL,'+
'news_texts_pt TEXT DEFAULT NULL,'+
'news_highdef TEXT DEFAULT NULL,'+
'news_quicklook TEXT DEFAULT NULL,'+
'news_caption TEXT DEFAULT NULL,'+
'news_video TEXT DEFAULT NULL,'+
'news_datacontent TEXT DEFAULT NULL)';


//declaring the constructor
function NewsManager() {
    
}

// declaring instance methods
NewsManager.prototype = {
	
	loadNewsFromBD: function (callback, errorCallback) {
    	printToLog("getAllNewsFromBD");
        //buscamos en BD todas las noticias
    	storageManager.queryToDB(this.getAllNewsFromDB,errorCallback, callback, null);
    },

	saveNewsFromWS:function(callback, errorCallback){
		var instance = this;
		
		var lastUpdate = getNewsLastUpdate();
		var urlComplete = 'http://kraken.hecticus.com/storefront/wsext/mobile_push/visitpanama/getVisitPanamaNews.php?lastupdate='+lastUpdate;
		printToLog("LASTUPDATE: "+lastUpdate);
		
		//var urlComplete = 'http://wedge/kraken/storefront/wsext/mobile_push/visitpanama/getVisitPanamaNews.php?lastupdate='+lastUpdate;
		
		$.ajax({
			url : urlComplete,
			timeout : 160000,
			success : function(data, status) {
				var code = data.error;
				var results = data.response;
				//printToLog("NEW: 0-"+code+" results: "+JSON.stringify(results));
				if(code == 0){
					//debemos guardar todo lo que se encuentra en el array "results" a BD y cuando eso termine entonces se llamara al callback o error...
					if(results!= null && results.length>0){
						storageManager.saveToDB(instance.saveAllNewsToDB, errorCallback, callback, null, results);
					}
				}else{
					//ocurrio un error
					errorCallback();
				}
			},
			error : function(xhr, ajaxOptions, thrownError) {
				//printToLog("Error descargando News: xhr:"+JSON.stringify(xhr)+" -AO:"+ajaxOptions+" -TE:"+thrownError);
				errorCallback();
			}
		});
	},

	getAllNewsFromDB:function(tx, instanceCaller, errorCallback, callback){
		printToLog("getAllNewsFromDB");
		tx.executeSql(createNewsQuery);
	    printToLog("getAllNewsFromDB 1");
	    
	    printToLog("getAllNewsFromDB: "+instanceCaller);
		tx.executeSql('SELECT * FROM NEWS', [], 
			function(tx, results){
				results.news_titles = decodeURIComponent(results.news_titles);
					  results.news_texts_es = decodeURIComponent(results.news_texts_es);
					  results.news_texts_en = decodeURIComponent(results.news_texts_en);
					  results.news_texts_pt = decodeURIComponent(results.news_texts_pt);
				
					  try{
						if(results.news_image_url!=null && results.news_image_url!=""){
							results.news_image_url = JSON.parse(results.news_image_url);
						}
					  }catch(e){
						results.news_image_url = new Array();
					  }
					  //results.news_image_url = decodeURIComponent(results.news_image_url);
				results.news_videos = decodeURIComponent(results.news_videos);
				results.news_page = decodeURIComponent(results.news_page);
					  results.news_publication_date = results.news_publication_date;
					  results.news_completion_date = results.news_completion_date;
					  results.news_modification_date = results.news_modification_date;
				callback(results);
			}, 
			function(err){
				errorCallback(err);
			});
	},
	
	saveAllNewsToDB:function(tx, instanceCaller, results){
		printToLog("saveAllNewsToDB");
		
		//TODO: UPDATE NEWS, DONT DELETE... No se deberia pero por ahora no tengo forma de hacer update correcto (esto solo ocurre si se descargo la data exitosamente)
		//deleteAllNewsDB(tx, instanceCaller);
	    
	    tx.executeSql(createNewsQuery);
	    printToLog("saveAllNewsToDB 1 - "+results.length);
	    
	    var lastUpdate = getNewsLastUpdate();
	    
	    for(var i=0; i<results.length; i++){
	    	var insertObj = results[i];
			
			var image_url_array = "[]";
			var titles_array = "{}";
			try{
				titles_array = JSON.stringify(insertObj.news_titles);
				image_url_array = JSON.stringify(insertObj.news_image_url);
			}catch(e){
				console.log("Error saveAllNewsToDB: "+e);
			}
			
	    	//var insertStatement = 'INSERT OR REPLACE INTO NEWS(news_id,news_title,news_titles,news_text,news_texts,news_image_url,news_videos,news_page,news_date,news_last_modify)'+
			var insertStatement = 'INSERT OR REPLACE INTO NEWS(news_id,news_titles,news_texts_es,news_texts_en,news_texts_pt,news_image_url,news_videos,news_page,news_date,news_publication_date,news_completion_date,news_modification_date,news_last_modify)'+
			'VALUES ('+insertObj.news_id+','+
			'"'+encodeURIComponent(titles_array)+'",'+
			'"'+encodeURIComponent(insertObj.news_texts_es)+'",'+
			'"'+encodeURIComponent(insertObj.news_texts_en)+'",'+
			'"'+encodeURIComponent(insertObj.news_texts_pt)+'",'+
			'"'+encodeURIComponent(image_url_array)+'",'+
			'"'+encodeURIComponent(insertObj.news_videos)+'",'+
			'\''+encodeURIComponent(insertObj.news_page)+'\','+
			'"'+insertObj.news_date+'",'+
			'"'+insertObj.news_publication_date+'",'+
			'"'+insertObj.news_completion_date+'",'+
			'"'+insertObj.news_modification_date+'",'+
			'"'+insertObj.news_last_modify+'"'+
			');';
	    	
	    	var last_modify_int = parseInt(insertObj.news_modification_date);
	    	if(last_modify_int>lastUpdate){
	    		lastUpdate = last_modify_int;
	    		setNewsLastUpdate(insertObj.news_modification_date);
	    	}
	
	    	tx.executeSql(insertStatement);
	    }
		
		//DELETE OLD NEWS
		limitNewsTableSize(tx);
		
	    printToLog("saveAllNewsToDB 2");
	}
	    
};

function decodeNews(encodedResult){
	var result = {};
	result.news_id = encodedResult.news_id;
	result.news_titles = decodeURIComponent(encodedResult.news_titles);
	result.news_texts_es = decodeURIComponent(encodedResult.news_texts_es);
	result.news_texts_en = decodeURIComponent(encodedResult.news_texts_en);
	result.news_texts_pt = decodeURIComponent(encodedResult.news_texts_pt);
	
	//result.news_image_url = decodeURIComponent(encodedResult.news_image_url);
	try{
		result.news_image_url = decodeURIComponent(encodedResult.news_image_url);
		result.news_image_url = JSON.parse(result.news_image_url);
	}catch(e){
		result.news_image_url = new Array();
	}
	
	result.news_videos = decodeURIComponent(encodedResult.news_videos);
	result.news_page = decodeURIComponent(encodedResult.news_page);
	
	result.news_date = encodedResult.news_date;
	result.news_publication_date = encodedResult.news_publication_date;
	result.news_completion_date = encodedResult.news_completion_date;
	result.news_modification_date = encodedResult.news_modification_date;
	result.news_last_modify = encodedResult.news_last_modify;

	return result;
}

//terminar
function removeAllStoredNews(callback, errorCallback){
	storageManager.deleteFromDB(deleteAllNewsDB, errorCallback, callback, null);
}

function deleteAllNewsDB(tx, instanceCaller){
	printToLog("deleteAllNewsDB");
    tx.executeSql('DROP TABLE IF EXISTS NEWS');
    printToLog("deleteAllNewsDB done");
}

//DELETES ALL BUT THE LAST 50 NEWS
function limitNewsTableSize(tx){
	
	var limitStatement = 'DELETE FROM NEWS WHERE news_id NOT IN (SELECT news_id FROM NEWS WHERE news_id > 0 ORDER BY news_publication_date DESC LIMIT 50);';
	
	tx.executeSql(limitStatement);
}
