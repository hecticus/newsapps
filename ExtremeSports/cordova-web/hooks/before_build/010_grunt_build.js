#!/usr/bin/env node
'use strict';
var exec = require('child_process').exec;
   exec('grunt debug',
	function(error, stdout, stderr) {
    		console.log(stdout);
    		console.log(stderr);
    		if (error !== null) {
      			console.log('grunt debug failed:\n' + error);
				process.exit(1);
    		}
	});
