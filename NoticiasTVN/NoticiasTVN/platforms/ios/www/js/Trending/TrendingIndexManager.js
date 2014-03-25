//La data se almacena en jsons en el campo trending_index_datacontent, todo lo que se recibe se guarda ahi, para asi soportar mejor cualquier cambio o extra informacion que se a�ada
var createTrendingIndexQuery = 'CREATE TABLE IF NOT EXISTS TRENDINGINDEX (trending_index_tvn_id INTEGER,'+
'trending_index_category TEXT DEFAULT NULL,'+
'trending_index_title TEXT NOT NULL,'+
'trending_index_image TEXT DEFAULT NULL,'+
'PRIMARY KEY (trending_index_tvn_id))';


//declaring the constructor
function TrendingIndexManager() {
    
}

// declaring instance methods
TrendingIndexManager.prototype = {
	
	getTrendingIndexes: function (callback, errorCallback) {
    	printToLog("getTrendingIndexes");
        //buscamos en el ws todos los indices si no hay conexion lo hacemos por BD
    	if(!isOffline()){
    		printToLog("por WS");
    		this.getTrendingIndexesFromWS(callback,errorCallback);
    	}else{
    		//buscamos en BD
    		printToLog("Por BD");
        	storageManager.queryToDB(this.getAllTrendingIndexFromDB,errorCallback, callback, null);
    	}
    },

    getTrendingIndexesFromWS:function(callback, errorCallback){
		//var urlComplete = 'http://localhost:9000/newsapi/categories/get';
		//var urlComplete = 'http://localhost:9001/newsapi/categories/get';
		var urlComplete = 'http://tvn-2.com/noticias/_modulos/json/trendingtopics-utf8.asp';
		
		var instance = this;
		
		$.ajax({
			url : urlComplete,
			timeout : 60000,
			success : function(data, status) {
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				var results = data["noticiastrendingtopics"]["item"];
				//printToLog("NEW: 0-"+code+" results: "+JSON.stringify(results));
				if(results != null){
					//debemos guardar todo lo que se encuentra en el array "results" a BD y cuando eso termine entonces se llamara al callback o error...
					if(results.length>0){
						storageManager.saveToDB(instance.saveAllTrendingIndexToDB, errorCallback, callback, null, results);
						//callback(results);
					}else{
						storageManager.queryToDB(instance.getAllTrendingIndexFromDB,errorCallback, callback, null);
					}
				}else{
					//ocurrio un error
					//errorCallback();
					storageManager.queryToDB(instance.getAllTrendingIndexFromDB,errorCallback, callback, null);
				}
			},
			error : function(xhr, ajaxOptions, thrownError) {
				//printToLog("Error descargando News: xhr:"+JSON.stringify(xhr)+" -AO:"+ajaxOptions+" -TE:"+thrownError);
				//errorCallback();
				storageManager.queryToDB(instance.getAllTrendingIndexFromDB,errorCallback, callback, null);
			}
		});
	},

	getAllTrendingIndexFromDB:function(tx, instanceCaller, errorCallback, callback){
		printToLog("getAllTrendingIndexFromDB");
		tx.executeSql(createTrendingIndexQuery);
	    printToLog("getAllTrendingIndexFromDB 1");
	    
		tx.executeSql('SELECT * FROM TRENDINGINDEX', [], 
			function(tx, results){
				//callback(results);
				if(results != null){
					var len = results.rows.length;
					if(len > 0){
						var trendIndexArray = new Array();
						for(var i=0;i<len;i++){
							var trendIndexItem = results.rows.item(i);
							trendIndexItem = decodeTrendingIndex(trendIndexItem);
							trendIndexArray.push(trendIndexItem);
						}
						callback(trendIndexArray);
					}else{
						errorCallback("no TrendingIndex");
					}
				}else{
					errorCallback("no TrendingIndex");
				}
			}, 
			function(err){
				errorCallback(err);
			});
	},
	
	saveAllTrendingIndexToDB:function(tx, instanceCaller, results){
		printToLog("saveAllTrendingIndexToDB");
	    
	    tx.executeSql(createTrendingIndexQuery);
	    
	    //var itemArray = results["noticias"]["item"];
	    var itemArray = results;
	    printToLog("saveAllTrendingIndexToDB 1 - "+itemArray.length);
	    
	    //limpiamos la tabla vieja ya que llego una nueva
	    clearTrendingIndexTable(tx);
	    
	    for(var i=0; i<itemArray.length; i++){
	    	var insertObj = itemArray[i];
			
			//console.log("STORE: "+JSON.stringify(insertObj));
			
			var insertStatement = 'INSERT OR REPLACE INTO TRENDINGINDEX(trending_index_tvn_id,trending_index_category,trending_index_title,trending_index_image)'+
			'VALUES ('+i+','+
			'"'+encodeURIComponent(insertObj.categoria)+'",'+
			'"'+encodeURIComponent(insertObj.titulo)+'",'+
			'"'+encodeURIComponent(insertObj.imagen)+'"'+
			');';
	    	
	
	    	tx.executeSql(insertStatement);
	    }
		
	    printToLog("saveAllTrendingIndexToDB 2");
	}
	    
};

function decodeTrendingIndex(encodedResult){
	var result = {};
	result["categoria"] = encodedResult.trending_index_category;
	result["titulo"] = decodeURIComponent(encodedResult.trending_index_title);
	result["imagen"] = decodeURIComponent(encodedResult.trending_index_image);
	return result;
}

//terminar
function removeAllStoredTrendingIndex(callback, errorCallback){
	storageManager.deleteFromDB(deleteAllTrendingIndexDB, errorCallback, callback, null);
}

function removeUnusedTrendingIndex(toDelete, callback, errorCallback){
	console.log("removeUnusedTrendingIndex "+JSON.stringify(toDelete));
	storageManager.deleteFromSelectDB(clearUnusedTrendingIndexTable, errorCallback, callback, null, toDelete);
}

function deleteAllTrendingIndexDB(tx, instanceCaller){
	printToLog("deleteAllTrendingIndexDB");
    tx.executeSql('DROP TABLE IF EXISTS TRENDINGINDEX');
    printToLog("deleteAllTrendingIndexDB done");
}

function clearUnusedTrendingIndexTable(tx, instanceCaller,data){
	console.log("clearUnusedTrendingIndexTable "+JSON.stringify(data));
	for(var i=0;i<data.length;i++){
		var limitStatement = 'DELETE FROM TRENDINGINDEX WHERE trending_index_category = "'+data[i]+'";';
		tx.executeSql(limitStatement);
	}
}

function clearTrendingIndexTable(tx){
	
	var limitStatement = 'DELETE FROM TRENDINGINDEX WHERE trending_index_tvn_id >= 0;';
	tx.executeSql(limitStatement);
}
