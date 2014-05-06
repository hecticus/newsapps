/*
 *	Mimic (XML-RPC Client for JavaScript) v2.2 
 *	Copyright (C) 2005-2012 Carlos Eduardo Goncalves (cadu.goncalves@gmail.com)
 *
 *	Mimic is dual licensed under the MIT (http://opensource.org/licenses/mit-license.php) 
 * 	and GPLv3 (http://opensource.org/licenses/gpl-3.0.html) licenses.
 */
function XmlRpc(){}XmlRpc.PROLOG='<?xml version="1.0"?>\n';XmlRpc.REQUEST="<methodCall>\n<methodName>${METHOD}</methodName>\n<params>\n${DATA}</params>\n</methodCall>";XmlRpc.PARAM="<param>\n<value>\n${DATA}</value>\n</param>\n";XmlRpc.ARRAY="<array>\n<data>\n${DATA}</data>\n</array>\n";XmlRpc.STRUCT="<struct>\n${DATA}</struct>\n";XmlRpc.MEMBER="<member>\n${DATA}</member>\n";XmlRpc.NAME="<name>${DATA}</name>\n";XmlRpc.VALUE="<value>\n${DATA}</value>\n";XmlRpc.SCALAR="<${TYPE}>${DATA}</${TYPE}>\n";XmlRpc.getDataTag=function(b){try{var a=typeof b;switch(a.toLowerCase()){case"number":a=(Math.round(b)==b)?"int":"double";break;case"object":if(b.constructor==Base64){a="base64"}else{if(b.constructor==String){a="string"}else{if(b.constructor==Boolean){a="boolean"}else{if(b.constructor==Array){a="array"}else{if(b.constructor==Date){a="dateTime.iso8601"}else{if(b.constructor==Number){a=(Math.round(b)==b)?"int":"double"}else{a="struct"}}}}}}break}return a}catch(c){return null}};XmlRpc.getTagData=function(a){var b=null;switch(a){case"struct":b=new Object();break;case"array":b=new Array();break;case"datetime.iso8601":b=new Date();break;case"boolean":b=new Boolean();break;case"int":case"i4":case"double":b=new Number();break;case"string":b=new String();break;case"base64":b=new Base64();break}return b};function XmlRpcRequest(a,b){this.serviceUrl=a;this.methodName=b;this.params=[]}XmlRpcRequest.prototype.addParam=function(b){var a=typeof b;switch(a.toLowerCase()){case"function":return;case"object":if(!b.constructor.name){return}}this.params.push(b)};XmlRpcRequest.prototype.clearParams=function(){this.params.splice(0,this.params.length)};XmlRpcRequest.prototype.send=function(){var c="",a=0,b,d;for(a=0;a<this.params.length;a++){c+=XmlRpc.PARAM.replace("${DATA}",this.marshal(this.params[a]))}b=XmlRpc.REQUEST.replace("${METHOD}",this.methodName);b=XmlRpc.PROLOG+b.replace("${DATA}",c);d=Builder.buildXHR();d.open("POST",this.serviceUrl,false);d.send(Builder.buildDOM(b));return new XmlRpcResponse(d.responseXML)};XmlRpcRequest.prototype.marshal=function(f){var d=XmlRpc.getDataTag(f),c=XmlRpc.SCALAR.replace(/\$\{TYPE\}/g,d),a="",e,b,g;switch(d){case"struct":g="";for(b in f){e="";e+=XmlRpc.NAME.replace("${DATA}",b);e+=XmlRpc.VALUE.replace("${DATA}",this.marshal(f[b]));g+=XmlRpc.MEMBER.replace("${DATA}",e)}a=XmlRpc.STRUCT.replace("${DATA}",g);break;case"array":e="";for(b=0;b<f.length;b++){e+=XmlRpc.VALUE.replace("${DATA}",this.marshal(f[b]))}a=XmlRpc.ARRAY.replace("${DATA}",e);break;case"dateTime.iso8601":a=c.replace("${DATA}",f.toIso8601());break;case"boolean":a=c.replace("${DATA}",(f==true)?1:0);break;case"base64":a=c.replace("${DATA}",f.encode());break;default:a=c.replace("${DATA}",f);break}return a};function XmlRpcResponse(a){this.xmlData=a}XmlRpcResponse.prototype.isFault=function(){return this.faultValue};XmlRpcResponse.prototype.parseXML=function(){var a,b;b=this.xmlData.childNodes.length;this.faultValue=undefined;this.currentIsName=false;this.propertyName="";this.params=[];for(a=0;a<b;a++){this.unmarshal(this.xmlData.childNodes[a],0)}return this.params[0]};XmlRpcResponse.prototype.unmarshal=function(d,c){var e,a,b,f;if(d.nodeType==1){e=null;a=d.tagName.toLowerCase();switch(a){case"fault":this.faultValue=true;break;case"name":this.currentIsName=true;break;default:e=XmlRpc.getTagData(a);break}if(e!=null){this.params.push(e);if(a=="struct"||a=="array"){if(this.params.length>1){switch(XmlRpc.getDataTag(this.params[c])){case"struct":this.params[c][this.propertyName]=this.params[this.params.length-1];break;case"array":this.params[c].push(this.params[this.params.length-1]);break}}c=this.params.length-1}}f=d.childNodes.length;for(b=0;b<f;b++){this.unmarshal(d.childNodes[b],c)}}if((d.nodeType==3)&&(/[^\t\n\r ]/.test(d.nodeValue))){if(this.currentIsName==true){this.propertyName=d.nodeValue;this.currentIsName=false}else{switch(XmlRpc.getDataTag(this.params[this.params.length-1])){case"dateTime.iso8601":this.params[this.params.length-1]=Date.fromIso8601(d.nodeValue);break;case"boolean":this.params[this.params.length-1]=(d.nodeValue=="1")?true:false;break;case"int":case"double":this.params[this.params.length-1]=new Number(d.nodeValue);break;case"string":this.params[this.params.length-1]=new String(d.nodeValue);break;case"base64":this.params[this.params.length-1]=new Base64(d.nodeValue);break}if(this.params.length>1){switch(XmlRpc.getDataTag(this.params[c])){case"struct":this.params[c][this.propertyName]=this.params[this.params.length-1];break;case"array":this.params[c].push(this.params[this.params.length-1]);break}}}}};function Builder(){}Builder.buildXHR=function(){return(typeof XMLHttpRequest!="undefined")?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP")};Builder.buildDOM=function(a){var f,d,b;if(typeof DOMParser!="undefined"){f=new DOMParser();return f.parseFromString(a,"text/xml")}else{d=["Microsoft.XMLDOM","MSXML2.DOMDocument","MSXML.DOMDocument"];for(b=0;b<d.length;b++){try{f=new ActiveXObject(d[b]);f.loadXML(a);return f}catch(c){}}}return null};Date.prototype.toIso8601=function(){var b=this.getYear(),d=this.getMonth()+1,a=this.getDate(),c=this.toTimeString().substr(0,8);if(b<1900){b+=1900}if(d<10){d="0"+d}if(a<10){a="0"+a}return b+d+a+"T"+c};Date.fromIso8601=function(e){var d=e.substr(0,4),f=e.substr(4,2),b=e.substr(6,2),a=e.substr(9,2),g=e.substr(12,2),c=e.substr(15,2);return new Date(d,f-1,b,a,g,c,0)};function Base64(a){this.bytes=a}Base64.CHAR_MAP="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";Base64.prototype.encode=function(){if(typeof btoa=="function"){return btoa(this.bytes)}else{var e=[],a=[],d=[],b=0,c=0;for(c=0;c<this.bytes.length;c+=3){e[0]=this.bytes.charCodeAt(c);e[1]=this.bytes.charCodeAt(c+1);e[2]=this.bytes.charCodeAt(c+2);a[0]=e[0]>>2;a[1]=((e[0]&3)<<4)|(e[1]>>4);a[2]=((e[1]&15)<<2)|(e[2]>>6);a[3]=e[2]&63;if(isNaN(e[1])){a[2]=a[3]=64}else{if(isNaN(e[2])){a[3]=64}}d[b++]=Base64.CHAR_MAP.charAt(a[0])+Base64.CHAR_MAP.charAt(a[1])+Base64.CHAR_MAP.charAt(a[2])+Base64.CHAR_MAP.charAt(a[3])}return d.join("")}};Base64.prototype.decode=function(){if(typeof atob=="function"){return atob(this.bytes)}else{var e=[],a=[],d=[],b=0,c=0;while((this.bytes.length%4)!=0){this.bytes+="="}for(c=0;c<this.bytes.length;c+=4){a[0]=Base64.CHAR_MAP.indexOf(this.bytes.charAt(c));a[1]=Base64.CHAR_MAP.indexOf(this.bytes.charAt(c+1));a[2]=Base64.CHAR_MAP.indexOf(this.bytes.charAt(c+2));a[3]=Base64.CHAR_MAP.indexOf(this.bytes.charAt(c+3));e[0]=(a[0]<<2)|(a[1]>>4);e[1]=((a[1]&15)<<4)|(a[2]>>2);e[2]=((a[2]&3)<<6)|a[3];d[b++]=String.fromCharCode(e[0]);if(a[2]!=64){d[b++]=String.fromCharCode(e[1])}if(a[3]!=64){d[b++]=String.fromCharCode(e[2])}}return d.join("")}};