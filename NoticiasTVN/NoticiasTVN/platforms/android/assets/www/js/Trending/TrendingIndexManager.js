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
    	//storageManager.queryToDB(this.getAllTrendingIndexFromDB,errorCallback, callback, null);
    	this.getTrendingIndexesFromWS(callback, errorCallback);
    },

    getTrendingIndexesFromWS:function(callback, errorCallback){
		//var urlComplete = 'http://localhost:9000/newsapi/categories/get';
		//var urlComplete = 'http://localhost:9001/newsapi/categories/get';
		var urlComplete = 'http://tvn-2.com/noticias/_modulos/json/trendingtopics-utf8.asp';
		
		$.ajax({
			url : urlComplete,
			timeout : 160000,
			success : function(data, status) {
				var results = data["noticiastrendingtopics"]["item"];
				//printToLog("NEW: 0-"+code+" results: "+JSON.stringify(results));
				if(results != null){
					//debemos guardar todo lo que se encuentra en el array "results" a BD y cuando eso termine entonces se llamara al callback o error...
					if(results.length>0){
						//storageManager.saveToDB(instance.saveAllCategoryToDB, errorCallback, callback, null, results);
						callback(results);
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

	getAllTrendingIndexFromDB:function(tx, instanceCaller, errorCallback, callback){
		printToLog("getAllTrendingIndexFromDB");
		tx.executeSql(createTrendingIndexQuery);
	    printToLog("getAllTrendingIndexFromDB 1");
	    
		tx.executeSql('SELECT * FROM TRENDINGINDEX', [], 
			function(tx, results){
				callback(results);
			}, 
			function(err){
				errorCallback(err);
			});
	},
	
	saveAllTrendingIndexToDB:function(tx, instanceCaller, results){
		printToLog("saveAllTrendingIndexToDB");
	    
	    tx.executeSql(createTrendingIndexQuery);
	    
	    var itemArray = results["noticias"]["item"];
	    printToLog("saveAllTrendingIndexToDB 1 - "+itemArray.length+" -"+results["category"]);
	    
	    for(var i=0; i<itemArray.length; i++){
	    	var insertObj = itemArray[i];
			
			//console.log("STORE: "+JSON.stringify(insertObj));
			
			var d = new Date();
			var n = d.getTime();
			
			var insertStatement = 'INSERT OR REPLACE INTO TRENDINGINDEX(trending_index_tvn_id,trending_index_category,trending_index_headline,trending_index_date,trending_index_datacontent,trending_index_creationtime)'+
			'VALUES ('+insertObj.id+','+
			'"'+encodeURIComponent(results["category"])+'",'+
			'"'+encodeURIComponent(insertObj.title)+'",'+
			'"'+encodeURIComponent(formatDateStringForSorting(insertObj.pubdate))+'",'+
			'"'+encodeURIComponent(JSON.stringify(insertObj))+'",'+
			''+n+
			');';
	    	
	
	    	tx.executeSql(insertStatement);
	    }
		
	    printToLog("saveAllTrendingIndexToDB 2");
	}
	    
};

function decodeTrendingIndex(encodedResult){
	var result = {};
	
	//Ya que todos los valores de la BD estan contenidos en este campo es el unico que necesitamos, los demas campos son para busqueda en la bd		
	var jsonString = decodeURIComponent(encodedResult.trending_index_datacontent);
	result = JSON.parse(jsonString);

	return result;
}

//terminar
function removeAllStoredTrendingIndex(callback, errorCallback){
	storageManager.deleteFromDB(deleteAllTrendingIndexDB, errorCallback, callback, null);
}

function deleteAllTrendingIndexDB(tx, instanceCaller){
	printToLog("deleteAllTrendingIndexDB");
    tx.executeSql('DROP TABLE IF EXISTS TRENDINGINDEX');
    printToLog("deleteAllTrendingIndexDB done");
}