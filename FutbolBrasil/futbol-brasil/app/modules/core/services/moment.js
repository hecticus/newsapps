'use strict';

/**
 * @ngdoc service
 * @name core.Services.Moment
 * @description Moment Factory
 */
angular
    .module('core')
    .factory('Moment',['Client', 'i18n',
        function(Client, i18n) {

            function getLang(){
                var oLang = Client.getLanguage();
                if (!oLang) oLang = i18n.getDefaultLanguage();
                if(oLang){
                    return oLang.short_name.toLowerCase();
                } else {
                    console.log('defaultLanguage: undefined. Returning "pt"');
                    return 'pt';
                }
            }

            return {

                GMT:function () {
                    return moment().format('ZZ');
                },

                date:function (_date) {
                    var _oMoment = moment().locale(getLang());
                    if (_date) _oMoment = moment(_date,'YYYYMMDD hh:mm').locale(getLang());
                    return _oMoment;
                },

                fromNow : function(_date){
                    var _oMoment = moment().locale(getLang());
                    if (_date) _oMoment = _oMoment(_date,'YYYYMMDD hh:mm').locale(getLang());
                    return _oMoment.fromNow();
                },

                /**
                 * @ngdoc function
                 * @name core.Services.Moment#moment
                 * @methodOf core.Services.Moment
                 * @return {object} Returns a Moment instance
                 */
                today : function (format) {
                    var _oMoment = moment();
                    return _oMoment.format(format);
                }
            };
        }
    ]);
