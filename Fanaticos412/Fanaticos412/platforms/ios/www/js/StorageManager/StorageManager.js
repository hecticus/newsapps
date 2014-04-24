var db;

//declaring the constructor
function StorageManager() {  
    //unico punto de entrada para guardar objetos
	if ( arguments.callee._singletonInstance )
	    return arguments.callee._singletonInstance;
	  
	arguments.callee._singletonInstance = this;

	db = window.openDatabase("Database", "", "Fanaticos412", 2000000);
	
}

//declaring instance methods  
StorageManager.prototype = {  
	simpleTest: function () {  
		printToLog("StorageManager: testStorageManager func");
    },
    saveToDB: function (populateDB, errorCB, successCB, instanceCaller, data) {
        printToLog("StorageManager: saveToDB");
    	db.transaction(function(tx){
    		populateDB(tx, instanceCaller, data);
    		}
    	, function(err){
    		printToLog("err1!!!!: "+JSON.stringify(err));
    		//printToLog("err1!!!!: ");
    		errorCB(err,instanceCaller);
    	}, function(){
    		successCB(data,instanceCaller);
    	});
    },
    deleteFromDB: function (populateDB, errorCB, successCB, instanceCaller) {
        printToLog("StorageManager: deleteFromDB");
    	db.transaction(function(tx){
    		populateDB(tx, instanceCaller);
    		}
    	, function(err){
    		//printToLog("err2!!!!: "+JSON.stringify(err));
    		printToLog("err2!!!!: ");
    		errorCB(err,instanceCaller);
    	}, function(){
    		successCB(instanceCaller);
    	});
    },
	deleteFromSelectDB: function (deleteDB, errorCB, successCB, instanceCaller,data) {
		printToLog("StorageManager: deleteFromSelectDB");
		db.transaction(function(tx){
				   deleteDB(tx, instanceCaller,data);
				}
				, function(err){
				   printToLog("err2!!!!: ");
				   errorCB(err,instanceCaller);
				}, function(){
				   successCB(instanceCaller);
				});
	},
    queryToDB: function(queryDB, errorCB, successCB, instanceCaller){
        printToLog("StorageManager: queryToDB");
        db.transaction(function(tx){
        	//printToLog("queryToDB: "+instanceCaller+" Func: "+queryDB);
        	queryDB(tx, instanceCaller, errorCB, successCB);
        }
        , function(err){
        	errorCB(err, instanceCaller);
        	});
    },
	queryToDBExtraCallback: function(queryDB, errorCB, successCB, instanceCaller, extracallback){
		printToLog("StorageManager: queryToDB");
		db.transaction(function(tx){
				   //printToLog("queryToDB: "+instanceCaller+" Func: "+queryDB);
				   queryDB(tx, instanceCaller, errorCB, successCB, extracallback);
				   }
				   , function(err){
				   errorCB(err, extracallback);
				   });
	},
    //permite enviar valores para hacer el query
    querySelectedToDB: function(queryDB, errorCB, successCB, selected, instanceCaller){
        printToLog("StorageManager: querySelectedToDB");
        db.transaction(function(tx){
        	queryDB(tx, instanceCaller, errorCB, successCB, selected);
        }
        , function(err){
        	errorCB(err, instanceCaller);
        	});
    }
};
