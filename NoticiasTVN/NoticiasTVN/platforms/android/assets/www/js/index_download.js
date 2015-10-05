function fGoToStore() {cordova.plugins.market.open('air.com.tvn.app.mobile.TVNNoticias');};
$(document).on('touchend','#download', function() {fGoToStore();});
var app = {
    initialize: function() {this.bindEvents();},
    bindEvents: function() {document.addEventListener('deviceready', this.onDeviceReady, false);},
    onDeviceReady: function() {	/*fGoToStore();*/}
};
