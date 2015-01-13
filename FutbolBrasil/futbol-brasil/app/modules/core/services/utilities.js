'use strict';

/**
 * @ngdoc service
 * @name core.Services.Utilities
 * @description Utilities Factory
 */
angular
    .module('core')
    .factory('Utilities',
        function() {
            return {

                /**
                 * @ngdoc function
                 * @name core.Services.Utilities#error
                 * @methodOf core.Services.Utilities
                 * @return {boolean} Returns a boolean value
                 */
                	error: function (_item, _param) {
                	  var _return = true;
                    if (_item) {
                      if (_param) {
                        angular.forEach(_item, function(_item) {
                          if (eval('_item.' + _param)) {
                            if (eval('_item.' + _param + '.length > 0')) {
                                _return = false;
                              }
                          }
                        });
                      } else {
                        if (_item.length > 0) {
                          _return = false;
                        }
                      }
                    } else {
                      _return = false;
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
                      if (navigator.app) {
                        navigator.app.exitApp();
                      } else if (navigator.device) {
                        navigator.device.exitApp();
                      }
                    }
                  }
            };
    });
