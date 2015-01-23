'use strict';

/**
 * @ngdoc service
 * @name core.Services.Utilities
 * @description Utilities Factory
 */
angular
    .module('core')
    .factory('Utilities', ['CordovaDevice', 'CordovaApp', 'WebManager', function(CordovaDevice, CordovaApp, WebManager) {
        return {
            _lastClicked : 0,
            /**
             * @ngdoc function
             * @name core.Services.Utilities#error
             * @methodOf core.Services.Utilities
             * @return {boolean} Returns a boolean value
             */
            error: function (items, key) {
                var _return = true;
                if (items && key) {
                    angular.forEach(items, function(item) {
                        if (item[key]) {
                            if (item[key].length > 0) {
                                _return = false;
                            }
                        }
                    });
                } else {
                    _return = items.length > 0;
                }
                return _return;
            },

            /**
             * @ngdoc function
             * @name core.Services.Utilities#moment
             * @methodOf core.Services.Utilities
             * @return {boolean} Returns a boolean value
             */
            //TODO verificar si es necesario
            moment:function (_date) {
                var _oMoment = moment();
                if (_date) _oMoment = moment(_date,'YYYYMMDD hh:mm');
                _oMoment.locale('es');
                return _oMoment;
            },

            /**
             * @ngdoc function
             * @name core.Services.Utilities#back_button
             * @methodOf core.Services.Utilities
             * @return {boolean} Returns a boolean value
             */
            back_button: function () {
                if (angular.element('#wrapper3').hasClass('left')) {
                    angular.element('#wrapper3').attr('class','page transition right');
                } else if (angular.element('#wrapper2').hasClass('left')) {
                    angular.element('#wrapper2').attr('class','page transition right');
                }else {
                    CordovaApp.exitApp();
                }
            },

            /**
             * @ngdoc function
             * @name core.Services.Utilities#back_button
             * @methodOf core.Services.Utilities
             * @return {boolean} Returns a boolean value
             */
            //TODO convertir en componente
            showAlert: function (message) {
                var _html = '<div id="alert" class="alert alert-warning alert-dismissible" role="alert">';
                _html += '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
                _html += '<span style="color:#ffffff;">' + message + '</span>';
                _html += '</div>';

                var alert = $('#alert');
                alert.remove();
                $('body').append(_html);

                alert.fadeOut(5000, function(){
                    $(this).remove();
                });
            },

            _fGetCurrentTimeMillis : function () {
                return new Date().getTime();
            },

            _fPreventDefaultClick : function (e){
                try{e.preventDefault();}catch(ex){}
                try{e.stopPropagation();}catch(ex){}
                try{e.stopImmediatePropagation();}catch(ex){}
                if(this._lastClicked != 0 &&  this._fGetCurrentTimeMillis() - this._lastClicked  < 500){
                    return true;
                }else{
                    this._lastClicked = this._fGetCurrentTimeMillis();
                    return false;
                }
            },

            _fGetAjaxJson : function(_url) {
                try {
                    return $.ajax({
                        url: _url,
                        headers: WebManager.getHeaders(),
                        type: 'GET',
                        dataType : 'json',
                        async: false,
                        contentType: 'application/json; charset=utf-8'
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        return false;
                    });
                } catch (e) {
                    return false;
                }
            },

            _fGetAjaxJsonAsync : function(_url) {
                try {
                    return $.ajax({
                        url: _url,
                        headers: WebManager.getHeaders(),
                        type: 'GET',
                        dataType : 'json',
                        async: true,
                        contentType: 'application/json; charset=utf-8'
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        return false;
                    });
                } catch (e) {
                    return false;
                }
            },

            _fPostAjaxJson : function(_url, _data) {

                try {
                    console.log(_url + " " + JSON.stringify(_data));
                    return $.ajax({
                        url: _url,
                        headers: WebManager.getHeaders(),
                        data: JSON.stringify(_data),
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        contentType: "application/json; charset=utf-8"
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        return false;
                    });
                } catch (e) {
                    return false;
                }

            },

            errorShareConfigs : function (err){
                console.log("ERROR errorShareConfigs:"+err);
            },

            doNothing : function (){
                //callback vacio para peticiones que no necesitan callback como tal
            },

            newScroll: {
                horizontal: function (_wrapper) {

                    delete window[_wrapper] ;

                    window[_wrapper] = new IScroll('#' + _wrapper, {
                        scrollX: true,
                        scrollY: false,
                        mouseWheel: false,
                        momentum: false,
                        snap: true,
                        snapSpeed: 700,
                        probeType: 3,
                        bounce: false
                    });

                    window[_wrapper].on('beforeScrollStart', function () {
                        this.refresh();
                    });

                    return window[_wrapper];

                }

                ,vertical: function (_wrapper) {

                    delete window[_wrapper] ;

                    window[_wrapper] = new IScroll('#' + _wrapper, {click:true,preventDefault:true, bounce: true,  probeType: 2});
                    window[_wrapper].on('beforeScrollStart', function () {
                        this.refresh();
                    });

                    return window[_wrapper];

                },
            }

        };
    }
]);
