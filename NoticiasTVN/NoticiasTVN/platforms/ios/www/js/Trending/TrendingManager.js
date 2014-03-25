//La data se almacena en jsons en el campo trending_datacontent, todo lo que se recibe se guarda ahi, para asi soportar mejor cualquier cambio o extra informacion que se a�ada
var createTrendingQuery = 'CREATE TABLE IF NOT EXISTS TRENDING (trending_tvn_id INTEGER,'+
'trending_category TEXT DEFAULT NULL,'+
'trending_idnews INTEGER NOT NULL,'+
'trending_title TEXT DEFAULT NULL,'+
'trending_description TEXT DEFAULT NULL,'+
'trending_image TEXT DEFAULT NULL,'+
'trending_pubdate TEXT DEFAULT NULL,'+
'PRIMARY KEY (trending_tvn_id))';


//declaring the constructor
function TrendingManager() {
    
}

// declaring instance methods
TrendingManager.prototype = {
	
	getTrendings: function (callback, errorCallback) {
    	printToLog("getTrendings");
        //buscamos en el ws todas los trending si no hay conexion lo hacemos por BD
    	if(!isOffline()){
    		printToLog("por WS");
    		this.getTrendingsFromWS(callback,errorCallback);
    	}else{
    		//buscamos en BD
    		printToLog("Por BD");
    		storageManager.queryToDB(this.getAllTrendingFromDB,errorCallback, callback, null);
    	}
    },

	getTrendingsFromWS:function(callback, errorCallback){
		//var urlComplete = 'http://localhost:9000/newsapi/categories/get';
		//var urlComplete = 'http://localhost:9001/newsapi/categories/get';
		var urlComplete;
		if(trendingTopicsCat != null && trendingTopicsCat != ''){
			urlComplete = trendingTopicsCat;
		}else{
			urlComplete = 'http://tvn-2.com/noticias/_modulos/json/trendingnews-utf8.asp';
		}
		
		var instance = this;
		
		$.ajax({
			url : urlComplete,
			timeout : 60000,
			success : function(data, status) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				var results = data["noticiastrendingnews"]["item"];
				//printToLog("NEW: 0-"+code+" results: "+JSON.stringify(results));
				if(results != null){
					//debemos guardar todo lo que se encuentra en el array "results" a BD y cuando eso termine entonces se llamara al callback o error...
					if(results.length>0){
						storageManager.saveToDB(instance.saveAllTrendingToDB, errorCallback, callback, null, results);
						//callback(results);
					}
				}else{
					//ocurrio un error
					//errorCallback();
					storageManager.queryToDB(instance.getAllTrendingFromDB,errorCallback, callback, null);
				}
			},
			error : function(xhr, ajaxOptions, thrownError) {
				//printToLog("Error descargando News: xhr:"+JSON.stringify(xhr)+" -AO:"+ajaxOptions+" -TE:"+thrownError);
				//errorCallback();
				storageManager.queryToDB(instance.getAllTrendingFromDB,errorCallback, callback, null);
			}
		});
	},
	
	getAllTrendingFromDB:function(tx, instanceCaller, errorCallback, callback){
		printToLog("getAllTrendingFromDB");
		tx.executeSql(createTrendingQuery);
	    printToLog("getAllTrendingFromDB 1");
	    
		tx.executeSql('SELECT * FROM TRENDING', [], 
			function(tx, results){
				//callback(results);
				if(results != null){
					var len = results.rows.length;
					if(len > 0){
						var trendArray = new Array();
						for(var i=0;i<len;i++){
							var trendItem = results.rows.item(i);
							trendItem = decodeTrending(trendItem);
							trendArray.push(trendItem);
						}
						callback(trendArray);
					}else{
						errorCallback("no TrendingNews");
					}
				}else{
					errorCallback("no TrendingNews");
				}
			}, 
			function(err){
				errorCallback(err);
			});
	},
	
	saveAllTrendingToDB:function(tx, instanceCaller, results){
		printToLog("saveAllTrendingToDB");
	    
	    tx.executeSql(createTrendingQuery);
	    
	    var itemArray = results;
	    printToLog("saveAllTrendingToDB 1 - "+itemArray.length);
	    
	    //limpiamos la tabla vieja ya que llego una nueva
	    clearTrendingTable(tx);
	    
	    for(var i=0; i<itemArray.length; i++){
	    	var insertObj = itemArray[i];
	    	//console.log("TRENDINGNEWS "+JSON.stringify(insertObj));
			
			var insertStatement = 'INSERT OR REPLACE INTO TRENDING(trending_tvn_id,trending_category,trending_idnews,trending_title,trending_description,trending_image,trending_pubdate)'+
			'VALUES ('+insertObj.id+','+
			'"'+encodeURIComponent(insertObj.categoria)+'",'+
			''+insertObj.idnews+','+
			'"'+encodeURIComponent(insertObj.titulo)+'",'+
			'"'+encodeURIComponent(insertObj.descripcion)+'",'+
			'"'+encodeURIComponent(insertObj.imagen)+'",'+
			'"'+encodeURIComponent(insertObj.pubdate)+'"'+
			');';
	    	
	
	    	tx.executeSql(insertStatement);
	    }
		
	    printToLog("saveAllTrendingToDB 2");
	}
	    
};

function decodeTrending(encodedResult){
	var result = {};
	result["id"] = encodedResult.trending_tvn_id;
	result["categoria"] = encodedResult.trending_category;
	result["idnews"] = encodedResult.trending_idnews;
	result["titulo"] = decodeURIComponent(encodedResult.trending_title);
	result["descripcion"] = decodeURIComponent(encodedResult.trending_description);
	result["imagen"] = decodeURIComponent(encodedResult.trending_image);
	result["pubdate"] = decodeURIComponent(encodedResult.trending_pubdate);
	return result;
}

//terminar
function removeAllStoredTrending(callback, errorCallback){
	storageManager.deleteFromDB(deleteAllTrendingDB, errorCallback, callback, null);
}

function deleteAllTrendingDB(tx, instanceCaller){
	printToLog("deleteAllTrendingDB");
    tx.executeSql('DROP TABLE IF EXISTS TRENDING');
    printToLog("deleteAllTrendingDB done");
}

function clearTrendingTable(tx){
	
	var limitStatement = 'DELETE FROM TRENDING WHERE trending_tvn_id >= 0;';
	tx.executeSql(limitStatement);
}
