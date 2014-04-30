//La data se almacena en jsons en el campo trending_news_datacontent, todo lo que se recibe se guarda ahi, para asi soportar mejor cualquier cambio o extra informacion que se a�ada
var createTrendingQuery = 'CREATE TABLE IF NOT EXISTS TRENDING (trending_news_tvn_id INTEGER,'+
'trending_news_category TEXT DEFAULT NULL,'+
'trending_news_headline TEXT NOT NULL,'+
'trending_news_date TEXT DEFAULT NULL,'+
'trending_news_datacontent TEXT DEFAULT NULL,'+
'trending_news_creationtime INTEGER DEFAULT NULL,'+
'PRIMARY KEY (trending_news_tvn_id,trending_news_category))';


//declaring the constructor
function TrendingManager() {
    
}

// declaring instance methods
TrendingManager.prototype = {
	
	loadTrendingFromBD: function (callback, errorCallback) {
    	printToLog("getAllTrendingFromBD");
        //buscamos en BD todas las noticias
    	storageManager.queryToDB(this.getAllTrendingFromDB,errorCallback, callback, null);
    },
	loadTrendingCategoryFromBD: function (category, callback, errorCallback) {
		printToLog("loadTrendingCategoryFromBD");
		//buscamos en BD todas las noticias
		storageManager.querySelectedToDB(this.getCategoryTrendingFromDB,errorCallback, callback, category, null);
	},
	loadTrendingByIDFromBD: function (trending_newsID, callback, errorCallback) {
		printToLog("loadTrendingByIDFromBD");
		//buscamos en BD la noticia con ID trending_newsID
		storageManager.querySelectedToDB(this.getTrendingByIDFromDB,errorCallback, callback, trending_newsID, null);
	},

	saveTrendingFromWS:function(results, callback, errorCallback){
		storageManager.saveToDB(this.saveAllTrendingToDB, errorCallback, callback, null, results);
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
getCategoryTrendingFromDB:function(tx, instanceCaller, errorCallback, callback, selected){
	printToLog("getCategoryTrendingFromDB");
	tx.executeSql(createTrendingQuery);
    printToLog("getCategoryTrendingFromDB 1");
    
    printToLog("getCategoryTrendingFromDB: "+selected);
	tx.executeSql('SELECT * FROM TRENDING WHERE trending_news_category="'+encodeURIComponent(selected)+'" ORDER BY trending_news_creationtime asc LIMIT 20', [],
				  function(tx, results){
					callback(results);
				  },
				  function(err){
					printToLog("getCategoryTrendingFromDB: ERROR"+err);
					errorCallback(err);
				  });
},
getTrendingByIDFromDB:function(tx, instanceCaller, errorCallback, callback, selected){
	printToLog("getTrendingByIDFromDB");
	tx.executeSql(createTrendingQuery);
    printToLog("getTrendingByIDFromDB 1");
    
    printToLog("getTrendingByIDFromDB: "+selected);
	tx.executeSql('SELECT * FROM TRENDING WHERE trending_news_tvn_id='+selected+' LIMIT 1', [],
				  function(tx, results){
					callback(results);
				  },
				  function(err){
					printToLog("getTrendingByIDFromDB: ERROR"+err);
					errorCallback(err);
				  });
},
	
	saveAllTrendingToDB:function(tx, instanceCaller, results){
		printToLog("saveAllTrendingToDB");
	    
	    tx.executeSql(createTrendingQuery);
	    
	    //DELETE OLD TRENDING
		//limitTrendingTableSize(tx);
	    
	    var itemArray = results["noticias"];
	    printToLog("saveAllTrendingToDB 1 - "+itemArray.length+" -"+results["category"]);
	    
	    for(var i=0; i<itemArray.length; i++){
	    	var insertObj = itemArray[i];
			
			//console.log("STORE: "+JSON.stringify(insertObj));
			
			var d = new Date();
			var n = d.getTime();
			
			var insertStatement = 'INSERT OR REPLACE INTO TRENDING(trending_news_tvn_id,trending_news_category,trending_news_headline,trending_news_date,trending_news_datacontent,trending_news_creationtime)'+
			'VALUES ('+insertObj.ID+','+
			'"'+encodeURIComponent(results["category"])+'",'+
			'"'+encodeURIComponent(insertObj.Title)+'",'+
			'"'+encodeURIComponent(formatDateStringForSorting(insertObj.Date))+'",'+
			'"'+encodeURIComponent(JSON.stringify(insertObj))+'",'+
			''+n+
			');';
			//console.log("INSERT: "+insertStatement);
	
	    	tx.executeSql(insertStatement);
	    }
		
	    printToLog("saveAllTrendingToDB 2");
	}
	    
};

function decodeTrending(encodedResult){
	var result = {};
	
	//Ya que todos los valores de la BD estan contenidos en este campo es el unico que necesitamos, los demas campos son para busqueda en la bd		
	var jsonString = decodeURIComponent(encodedResult.trending_news_datacontent);
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
	var limitStatement;
	var allTrendigIDs;
	//eliminamos todas las categorias que no existan mas, despues por cada categoria eliminamos los que son viejos por cantidad
	for(var i=0; i<arrTrendingTopics.length; i++){
		limitStatement = 'DELETE FROM TRENDING WHERE trending_news_category = "'+arrTrendingTopics[i].ID+'" AND trending_news_tvn_id IN (SELECT trending_news_tvn_id FROM TRENDING WHERE trending_news_category = "'+arrTrendingTopics[i].ID+'" ORDER BY trending_news_creationtime asc LIMIT 60,200);'; //offset,limit
		//console.log("delete "+limitStatement);
		tx.executeSql(limitStatement);
		//console.log("LIMIT: "+limitStatement);
		if(i>0){
			allTrendigIDs = allTrendigIDs+",";
		}
		allTrendigIDs = allTrendigIDs+""+arrTrendingTopics[i].ID;
	}
	
	if(arrTrendingTopics.length > 0){
		limitStatement = 'DELETE FROM TRENDING WHERE trending_news_category NOT IN "('+allTrendigIDs+')";'; //limpiamos los trneding que no tienen categoria
		//console.log("LIMIT2: "+limitStatement);
		tx.executeSql(limitStatement);
	}
}
