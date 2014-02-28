//La data se almacena en jsons en el campo trending_datacontent, todo lo que se recibe se guarda ahi, para asi soportar mejor cualquier cambio o extra informacion que se a�ada
var createTrendingQuery = 'CREATE TABLE IF NOT EXISTS TRENDING (trending_tvn_id INTEGER,'+
'trending_category TEXT DEFAULT NULL,'+
'trending_headline TEXT NOT NULL,'+
'trending_date TEXT DEFAULT NULL,'+
'trending_datacontent TEXT DEFAULT NULL,'+
'trending_creationtime INTEGER DEFAULT NULL,'+
'PRIMARY KEY (trending_tvn_id,trending_category))';


//declaring the constructor
function TrendingManager() {
    
}

// declaring instance methods
TrendingManager.prototype = {
	
	getTrendings: function (callback, errorCallback) {
    	printToLog("getTrendings");
        //buscamos en BD todas las noticias
    	storageManager.queryToDB(this.getAllTrendingFromDB,errorCallback, callback, null);
    },

	getAllTrendingFromDB:function(tx, instanceCaller, errorCallback, callback){
		printToLog("getAllTrendingFromDB");
		tx.executeSql(createTrendingQuery);
	    printToLog("getAllTrendingFromDB 1");
	    
		tx.executeSql('SELECT * FROM TRENDING', [], 
			function(tx, results){
				callback(results);
			}, 
			function(err){
				errorCallback(err);
			});
	},
	
	getTrendingsFromWS:function(callback, errorCallback){
		//var urlComplete = 'http://localhost:9000/newsapi/categories/get';
		//var urlComplete = 'http://localhost:9001/newsapi/categories/get';
		var urlComplete = 'http://tvn-2.com/noticias/_modulos/json/trendingnews-utf8.asp';
		
		$.ajax({
			url : urlComplete,
			timeout : 160000,
			success : function(data, status) {
				var results = data["noticiastrendingnews"]["item"];
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
	
	saveAllTrendingToDB:function(tx, instanceCaller, results){
		printToLog("saveAllTrendingToDB");
	    
	    tx.executeSql(createTrendingQuery);
	    
	    var itemArray = results["noticias"]["item"];
	    printToLog("saveAllTrendingToDB 1 - "+itemArray.length+" -"+results["category"]);
	    
	    for(var i=0; i<itemArray.length; i++){
	    	var insertObj = itemArray[i];
			
			//console.log("STORE: "+JSON.stringify(insertObj));
			
			var d = new Date();
			var n = d.getTime();
			
			var insertStatement = 'INSERT OR REPLACE INTO TRENDING(trending_tvn_id,trending_category,trending_headline,trending_date,trending_datacontent,trending_creationtime)'+
			'VALUES ('+insertObj.id+','+
			'"'+encodeURIComponent(results["category"])+'",'+
			'"'+encodeURIComponent(insertObj.title)+'",'+
			'"'+encodeURIComponent(formatDateStringForSorting(insertObj.pubdate))+'",'+
			'"'+encodeURIComponent(JSON.stringify(insertObj))+'",'+
			''+n+
			');';
	    	
	
	    	tx.executeSql(insertStatement);
	    }
		
		//DELETE OLD TRENDING
		limitTrendingTableSize(tx);
		
	    printToLog("saveAllTrendingToDB 2");
	}
	    
};

function decodeTrending(encodedResult){
	var result = {};
	
	//Ya que todos los valores de la BD estan contenidos en este campo es el unico que necesitamos, los demas campos son para busqueda en la bd		
	var jsonString = decodeURIComponent(encodedResult.trending_datacontent);
	result = JSON.parse(jsonString);

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

//DELETES ALL BUT THE LAST 100 TRENDING FROM EACH CATEGORY
function limitTrendingTableSize(tx){
	
	//eliminamos todas las categorias que no existan mas, despues por cada categoria eliminamos los que son viejos por cantidad
	for(var i=0; i<arrCategory.length; i++){
		console.log("Cat: "+arrCategory[i].id);
		var limitStatement = 'DELETE FROM TRENDING WHERE trending_tvn_id IN (SELECT trending_tvn_id FROM TRENDING WHERE trending_category = "'+arrCategory[i].id+'" ORDER BY trending_creationtime asc LIMIT 60,200);'; //offset,limit
		tx.executeSql(limitStatement);
	}
}
