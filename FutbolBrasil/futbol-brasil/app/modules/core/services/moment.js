'use strict';

/**
 * @ngdoc service
 * @name core.Services.Moment
 * @description Moment Factory
 */
angular
    .module('core')
    .factory('Moment',['Client','i18n',
        function(Client,i18n) {

            var getLag = function(){
                 var oLang = Client.getLanguage();
                 if (!oLang) oLang = i18n.getDefaultLanguage();
                 return oLang.short_name.toLowerCase();
            };

            return {
                date:function (_date) {
                    var _oMoment = moment().locale(getLag());
                    if (_date) _oMoment = moment(_date,'YYYYMMDD hh:mm').locale(getLag());
                    return _oMoment;
                },

                fromNow : function(_date){
                    var _oMoment = moment().locale(getLag());
                    if (_date) _oMoment = _oMoment(_date,'YYYYMMDD hh:mm').locale(getLag());
                    return _oMoment.fromNow();
                },

                /**
                 * @ngdoc function
                 * @name core.Services.Moment#moment
                 * @methodOf core.Services.Moment
                 * @return {object} Returns a Moment instance
                 */
                today : function (format) {
                    return moment().format(format);
                }
            };
    }
]);
