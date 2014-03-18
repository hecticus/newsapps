//La data se almacena en jsons en el campo category_datacontent, todo lo que se recibe se guarda ahi, para asi soportar mejor cualquier cambio o extra informacion que se a�ada
var createCategoryQuery = 'CREATE TABLE IF NOT EXISTS CATEGORY (category_tvn_id INTEGER,'+
'category_name TEXT DEFAULT NULL,'+
'category_shortName TEXT NOT NULL,'+
'category_feedUrl TEXT DEFAULT NULL,'+
'category_internalUrl TEXT DEFAULT NULL,'+
'category_pushable INTEGER DEFAULT NULL,'+
'category_trending INTEGER DEFAULT NULL,'+
'category_hidden INTEGER DEFAULT NULL,'+
'PRIMARY KEY (category_tvn_id))';

//declaring the constructor
function CategoryManager() {
    
}

// declaring instance methods
CategoryManager.prototype = {
	
	getCategories: function (callback, errorCallback) {
    	printToLog("getCategories");
    	//bscamos en el WS las categorias si hay conexion
    	if(!isOffline()){
    		printToLog("por WS");
    		this.getCompleteCategoriesFromWS(callback,errorCallback);
    	}else{
    		//buscamos en BD
    		printToLog("Por BD");
        	storageManager.queryToDB(this.getAllCategoryFromDB,errorCallback, callback, null);
    	}
    },
	
	getCompleteCategoriesFromWS:function(callback, errorCallback){
		//var urlComplete = 'http://localhost:9000/newsapi/categories/get';
		//var urlComplete = 'http://localhost:9001/newsapi/categories/get';
		//var urlComplete = 'http://10.0.3.4:9001/newsapi/categories/get';
		//var urlComplete = 'http://192.168.1.128/kraken/storefront/wsext/pa-tvn/getTVNCategories.php';
		
		var urlComplete = 'http://tvn.news.hecticus.com:9001/newsapi/v1/categories/search';
		
		var instance = this;
		
		$.ajax({
			url : urlComplete,
			timeout : 160000,
			success : function(data, status) {
				printToLog("TESTNEW: 0-"+status+" results: "+data);
				if(typeof data == "string"){
					data = JSON.parse(data);
				}
				var code = data.error;
				var results = data.response.categories;
				printToLog("TESTNEW: 0-"+code+" results: "+JSON.stringify(results));
				if(code == 0){
					//debemos guardar todo lo que se encuentra en el array "results" a BD y cuando eso termine entonces se llamara al callback o error...
					if(results!= null && results.length>0){
						setAllVars(results);
						storageManager.saveToDB(instance.saveAllCategoryToDB, errorCallback, callback, null, results);
					}
				}else{
					//ocurrio un error
					//errorCallback();
					storageManager.queryToDB(instance.getAllCategoryFromDB,errorCallback, callback, null);
				}
			},
			error : function(xhr, ajaxOptions, thrownError) {
				//printToLog("Error descargando News: xhr:"+JSON.stringify(xhr)+" -AO:"+ajaxOptions+" -TE:"+thrownError);
				//errorCallback();
				storageManager.queryToDB(instance.getAllCategoryFromDB,errorCallback, callback, null);
			}
		});
	},
	
	getAllCategoryFromDB:function(tx, instanceCaller, errorCallback, callback){
		printToLog("getAllCategoryFromDB");
		tx.executeSql(createCategoryQuery);
	    
		tx.executeSql('SELECT * FROM CATEGORY', [], 
			function(tx, results){
				if(results != null){
					var len = results.rows.length;
					if(len > 0){
						var catArray = new Array();
						for(var i=0;i<len;i++){
							var catItem = results.rows.item(i);
							catItem = decodeCategory(catItem);
							//catItem["i"]=i;
							//catItem["bgcolor"]='#0404B4';
							catArray.push(catItem);
						}
						setAllVars(catArray);
						callback(catArray);
					}else{
						errorCallback("no categories");
					}
				}else{
					errorCallback("no categories");
				}
			}, 
			function(err){
				errorCallback(err);
			});
	},
	
	saveAllCategoryToDB:function(tx, instanceCaller, results){
		printToLog("saveAllCategoryToDB");
	    
	    tx.executeSql(createCategoryQuery);
	    
	    var itemArray = results;
	    printToLog("saveAllCategoryToDB 1 - "+itemArray.length+" -"+JSON.stringify(results));
	    
	    //limpiamos la tabla vieja ya que llego una nueva
	    clearCategoriesTable(tx);
	    
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

			var insertStatement = 'INSERT OR REPLACE INTO CATEGORY(category_tvn_id,category_name,category_shortName,category_feedUrl,category_internalUrl,category_pushable,category_trending,category_hidden)'+
			'VALUES ('+insertObj.id+','+
			'"'+encodeURIComponent(insertObj.name)+'",'+
			'"'+encodeURIComponent(insertObj.shortName)+'",'+
			'"'+encodeURIComponent(insertObj.feedUrl)+'",'+
			'"'+encodeURIComponent(insertObj.internalUrl)+'",'+
			''+(insertObj.pushable?1:0)+','+
			''+(insertObj.trending?1:0)+','+
			''+(insertObj.hidden?1:0)+
			');';
	    	
			printToLog("saveAllCategoryToDB 1.5 "+insertStatement);
	    	tx.executeSql(insertStatement);
	    }
		
	    printToLog("saveAllCategoryToDB 2");
	}
	    
};

function decodeCategory(encodedResult){
	var result = {};
	result["id"] = encodedResult.category_tvn_id;
	result["name"] = decodeURIComponent(encodedResult.category_name);
	result["shortName"] = decodeURIComponent(encodedResult.category_shortName);
	result["feedUrl"] = decodeURIComponent(encodedResult.category_feedUrl);
	result["internalUrl"] = decodeURIComponent(encodedResult.category_internalUrl);
	result["pushable"] = encodedResult.category_pushable;
	result["trending"] = encodedResult.category_trending;
	result["hidden"] = encodedResult.category_hidden;
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

function clearCategoriesTable(tx){
	
	var limitStatement = 'DELETE FROM CATEGORY WHERE category_tvn_id >= 0;'; //offset,limit
	tx.executeSql(limitStatement);
}

function setAllVars(results){
	for(var i=0;i<results.length;i++){
		results[i]["classId"] = "tvnCategory_"+results[i]["id"];
		results[i]["i"]=i;
		results[i]["bgcolor"]='#0404B4';
		results[i]["title"] = results[i]["name"];
		results[i]["status"]=false;
	}
}
