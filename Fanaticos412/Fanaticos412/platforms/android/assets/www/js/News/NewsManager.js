//La data se almacena en jsons en el campo news_datacontent, todo lo que se recibe se guarda ahi, para asi soportar mejor cualquier cambio o extra informacion que se a�ada
var createNewsQuery = 'CREATE TABLE IF NOT EXISTS NEWS (news_tvn_id INTEGER,'+
'news_category TEXT DEFAULT NULL,'+
'news_headline TEXT NOT NULL,'+
'news_date TEXT DEFAULT NULL,'+
'news_datacontent TEXT DEFAULT NULL,'+
'news_creationtime INTEGER DEFAULT NULL,'+
'PRIMARY KEY (news_tvn_id,news_category))';


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
	loadNewsCategoryFromBD: function (category, callback, errorCallback) {
		printToLog("getAllNewsFromBD");
		//buscamos en BD todas las noticias
		storageManager.querySelectedToDB(this.getCategoryNewsFromDB,errorCallback, callback, category, null);
	},

	saveNewsFromWS:function(results, callback, errorCallback){
		storageManager.saveToDB(this.saveAllNewsToDB, errorCallback, callback, null, results);
	},

	getAllNewsFromDB:function(tx, instanceCaller, errorCallback, callback){
		printToLog("getAllNewsFromDB");
		tx.executeSql(createNewsQuery);
	    printToLog("getAllNewsFromDB 1");
	    
		tx.executeSql('SELECT * FROM NEWS', [], 
			function(tx, results){
				callback(results);
			}, 
			function(err){
				errorCallback(err);
			});
	},
getCategoryNewsFromDB:function(tx, instanceCaller, errorCallback, callback, selected){
	printToLog("getCategoryNewsFromDB");
	tx.executeSql(createNewsQuery);
    printToLog("getCategoryNewsFromDB 1");
    
    printToLog("getCategoryNewsFromDB: "+selected);
	tx.executeSql('SELECT * FROM NEWS WHERE news_category="'+selected+'" ORDER BY news_date desc LIMIT 10', [],
				  function(tx, results){
					callback(results);
				  },
				  function(err){
					printToLog("getCurrentEventFromDB: ERROR"+err);
					errorCallback(err);
				  });
},
	
	saveAllNewsToDB:function(tx, instanceCaller, results){
		printToLog("saveAllNewsToDB");
	    
	    tx.executeSql(createNewsQuery);
	    
	    var xmlCompleteObj = results["data"];
	    //printToLog("saveAllNewsToDB 1 - "+itemArray.length+" -"+results["category"]);
		printToLog("saveAllNewsToDB 1 - "+results["category"]);
	    
	    //for(var i=0; i<itemArray.length; i++){
		xmlCompleteObj.find('news').each(function(i){
	    	var insertObj = $(this);
			var xmlText = new XMLSerializer().serializeToString(this);
			
			//console.log("STORE: "+JSON.stringify(insertObj));
			
			var d = new Date();
			var n = d.getTime();
			
			var insertStatement = 'INSERT OR REPLACE INTO NEWS(news_tvn_id,news_category,news_headline,news_date,news_datacontent,news_creationtime)'+
			'VALUES ('+insertObj.attr('duid')+','+
			'"'+encodeURIComponent(results["category"])+'",'+
			'"'+encodeURIComponent(insertObj.find('headline').text())+'",'+
			'"'+encodeURIComponent(insertObj.find('DateAndTime').text())+'",'+
			//'"'+encodeURIComponent(JSON.stringify(xml2json(this)))+'",'+
			'"'+encodeURIComponent(xmlText)+'",'+
			''+n+
			');';

	    	tx.executeSql(insertStatement);
		});
		
		//DELETE OLD NEWS
		limitNewsTableSize(tx);
		
	    printToLog("saveAllNewsToDB 2");
	}
	    
};

function decodeNews(encodedResult){
	/*var result = {};
	
	//Ya que todos los valores de la BD estan contenidos en este campo es el unico que necesitamos, los demas campos son para busqueda en la bd		
	var jsonString = decodeURIComponent(encodedResult.news_datacontent);
	result = JSON.parse(jsonString);*/
	var result = decodeURIComponent(encodedResult.news_datacontent);
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

//DELETES ALL BUT THE LAST 100 NEWS FROM EACH CATEGORY
function limitNewsTableSize(tx){
	
	//eliminamos todas las categorias que no existan mas, despues por cada categoria eliminamos los que son viejos por cantidad
	/*var limitStatement = 'DELETE FROM NEWS WHERE news_id NOT IN (SELECT news_id FROM NEWS WHERE news_id > 0 ORDER BY news_publication_date DESC LIMIT 100);';
	
	tx.executeSql(limitStatement);*/
}
