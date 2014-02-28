//La data se almacena en jsons en el campo category_datacontent, todo lo que se recibe se guarda ahi, para asi soportar mejor cualquier cambio o extra informacion que se a�ada
var createCategoryQuery = 'CREATE TABLE IF NOT EXISTS CATEGORY (category_tvn_id INTEGER,'+
'category_name TEXT DEFAULT NULL,'+
'category_shortName TEXT NOT NULL,'+
'category_feedUrl TEXT DEFAULT NULL,'+
'category_internalUrl TEXT DEFAULT NULL,'+
'category_pushable INTEGER DEFAULT NULL,'+
'category_trending INTEGER DEFAULT NULL,'+
'PRIMARY KEY (category_tvn_id))';

//declaring the constructor
function CategoryManager() {
    
}

// declaring instance methods
CategoryManager.prototype = {
	
	loadCategoryFromBD: function (callback, errorCallback) {
    	printToLog("getAllCategoryFromBD");
        //buscamos en BD todas las noticias
    	storageManager.queryToDB(this.getAllCategoryFromDB,errorCallback, callback, null);
    },
	loadCategoryCategoryFromBD: function (category, callback, errorCallback) {
		printToLog("loadCategoryCategoryFromBD");
		//buscamos en BD todas las noticias
		storageManager.querySelectedToDB(this.getCategoryCategoryFromDB,errorCallback, callback, category, null);
	},
	loadCategoryByIDFromBD: function (categoryID, callback, errorCallback) {
		printToLog("loadCategoryByIDFromBD");
		//buscamos en BD la noticia con ID categoryID
		storageManager.querySelectedToDB(this.getCategoryByIDFromDB,errorCallback, callback, categoryID, null);
	},
	
	getCompleteCategoriesFromWS:function(callback, errorCallback){
		//var urlComplete = 'http://localhost:9000/newsapi/categories/get';
		//var urlComplete = 'http://localhost:9001/newsapi/categories/get';
		var urlComplete = 'http://wedge/kraken/storefront/wsext/pa-tvn/getTVNCategories.php';
		
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
						storageManager.saveToDB(instance.saveAllCategoryToDB, errorCallback, callback, null, results);
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

	saveCategoryFromWS:function(results, callback, errorCallback){
		storageManager.saveToDB(this.saveAllCategoryToDB, errorCallback, callback, null, results);
	},

	getAllCategoryFromDB:function(tx, instanceCaller, errorCallback, callback){
		printToLog("getAllCategoryFromDB");
		tx.executeSql(createCategoryQuery);
	    printToLog("getAllCategoryFromDB 1");
	    
		tx.executeSql('SELECT * FROM CATEGORY', [], 
			function(tx, results){
				callback(results);
			}, 
			function(err){
				errorCallback(err);
			});
	},
	
	saveAllCategoryToDB:function(tx, instanceCaller, results){
		printToLog("saveAllCategoryToDB");
	    
	    tx.executeSql(createCategoryQuery);
	    
	    var itemArray = results["categories"];
	    printToLog("saveAllCategoryToDB 1 - "+itemArray.length+" -"+results["categories"]);
	    
	    for(var i=0; i<itemArray.length; i++){
	    	var insertObj = itemArray[i];
			
			//console.log("STORE: "+JSON.stringify(insertObj));
			
			var d = new Date();
			var n = d.getTime();
			
			/*id: 1,
			name: "Home",
			shortName: "latestnews",
			feedUrl: "http://www.tvn-2.com/noticias/_modulos/json/latestnews-utf8.asp",
			internalUrl: "http://www.tvn-2.com/noticias/_modulos/json/latestnews-utf8.asp",
			pushable: true,
			trending: false,
			sort: 0*/

			var insertStatement = 'INSERT OR REPLACE INTO CATEGORY(category_tvn_id,category_name,category_shortName,category_feedUrl,category_internalUrl,category_pushable,category_trending)'+
			'VALUES ('+insertObj.id+','+
			'"'+encodeURIComponent(insertObj.name)+'",'+
			'"'+encodeURIComponent(insertObj.shortName)+'",'+
			'"'+encodeURIComponent(insertObj.feedUrl)+'",'+
			'"'+encodeURIComponent(insertObj.internalUrl)+'",'+
			''+insertObj.pushable+','+
			''+insertObj.trending+
			');';
	    	
	
	    	tx.executeSql(insertStatement);
	    }
		
	    printToLog("saveAllCategoryToDB 2");
	}
	    
};

function decodeCategory(encodedResult){
	var result = {};
	
	result["id"] = encodedResult.id;
	result["name"] = decodeURIComponent(encodedResult.name);
	result["shortName"] = decodeURIComponent(encodedResult.shortName);
	result["feedUrl"] = decodeURIComponent(encodedResult.feedUrl);
	result["internalUrl"] = decodeURIComponent(encodedResult.internalUrl);
	result["pushable"] = insertObj.pushable;
	result["trending"] = insertObj.trending;

	return result;
}

//terminar
function removeAllStoredCategory(callback, errorCallback){
	storageManager.deleteFromDB(deleteAllCategoryDB, errorCallback, callback, null);
}

function deleteAllCategoryDB(tx, instanceCaller){
	printToLog("deleteAllCategoryDB");
    tx.executeSql('DROP TABLE IF EXISTS CATEGORY');
    printToLog("deleteAllCategoryDB done");
}
