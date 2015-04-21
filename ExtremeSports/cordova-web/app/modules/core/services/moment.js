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
                date: date,

                fromNow : fromNow,

                /**
                 * @ngdoc function
                 * @name core.Services.Moment#moment
                 * @methodOf core.Services.Moment
                 * @return {object} Returns a Moment instance
                 */
                today : today
            };

            function date(_date) {
                var _oMoment = moment().locale(getLang());
                if (_date) _oMoment = moment(_date,'YYYYMMDD hh:mm').locale(getLang());
                return _oMoment;
            }

            function fromNow(_date, format){
                console.log('Moment.fromNow ', _date, format, getLang());
                var formatStr = null;
                var mMoment = null;
                if(format){
                    formatStr = format;
                } else {
                    formatStr = 'YYYYMMDD hh:mm';
                }

                if (_date){
                    mMoment = moment(_date,formatStr).locale(getLang());
                } else {
                    mMoment = moment().locale(getLang()).format();
                }

                return mMoment.fromNow();
            }

            function today(format) {
                return moment().format(format);
            }
        }
    ]);
