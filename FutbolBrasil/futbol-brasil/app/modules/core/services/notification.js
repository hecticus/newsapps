'use strict';

/**
 * @ngdoc service
 * @name core.Services.Notification
 * @description Notification Factory
 */
angular
    .module('core')
    .factory('Notification',['$rootScope', '$state','$translate',
        function($rootScope, $state, $translate) {

            var strings = {};
            function getTranslations(){
                $translate(['ALERT.NETWORK_ERROR.TITLE',
                            'ALERT.NETWORK_ERROR.SUBTITLE',
                            'ALERT.NETWORK_ERROR.MSG',
                            'ALERT.LOCKED_SECTION.TITLE',
                            'ALERT.LOCKED_SECTION.MSG',
                            'ALERT.LOCKED_SECTION.CONFIRM',
                            'ALERT.LOCKED_SECTION.CANCEL'])
                .then(function(translation){

                    strings['NETWORK_ERROR_TITLE'] = translation['ALERT.NETWORK_ERROR.TITLE'];
                    strings['NETWORK_ERROR_SUBTITLE'] = translation['ALERT.NETWORK_ERROR.SUBTITLE'];
                    strings['NETWORK_ERROR_MSG'] = translation['ALERT.NETWORK_ERROR.MSG'];

                    strings['LOCKED_SECTION_TITLE'] = translation['ALERT.LOCKED_SECTION.TITLE'];
                    strings['LOCKED_SECTION_MSG'] = translation['ALERT.LOCKED_SECTION.MSG'];
                    strings['LOCKED_SECTION_OK'] = translation['ALERT.LOCKED_SECTION.CONFIRM'];
                    strings['LOCKED_SECTION_CANCEL'] = translation['ALERT.LOCKED_SECTION.CANCEL'];

                });
            }

            function showNotificationDialog(data, confirmCallback, cancelCallback){
                var hasNotificationPlugin = !!navigator.notification;
                if (hasNotificationPlugin) {
                    navigator.notification.confirm(data.message
                        , function(btnIndex){
                            switch (btnIndex) {
                                case 1:
                                    typeof confirmCallback === 'function' && confirmCallback();
                                    break;
                                case 2:
                                    typeof cancelCallback === 'function' && cancelCallback();
                                    break;
                                default:
                            }
                        }
                        , data.title, [data.confirm, data.cancel]);
                } else {
                    var confirmFallback = confirm(data.message);
                    if (confirmFallback === true) {
                        typeof confirmCallback === 'function' && confirmCallback();
                    } else {
                        typeof cancelCallback === 'function' && cancelCallback();
                    }
                }
            }

            //TODO i18n-alizar
            function showLockedSectionDialog() {

                showNotificationDialog(
                    {
                        title : strings['LOCKED_SECTION_TITLE'],
                        message :  strings['LOCKED_SECTION_MSG'],
                        confirm: strings['LOCKED_SECTION_OK'],
                        cancel: strings['LOCKED_SECTION_CANCEL']
                    }, registerUserCallback
                );

                function registerUserCallback(){
                    $state.go('remind');
                }

            }

            function showInfoAlert(displayInfo){
                var icon = '';
                displayInfo.icon = '';
                switch(displayInfo.type){
                    case 'success':
                        icon = 'mdi-navigation-check text-success';
                        displayInfo.html = '<p class="text-success">' + displayInfo.subtitle + '</p>';
                        break;
                    case 'error':
                        icon = 'mdi-alert-error text-danger';
                        displayInfo.html = '<p class="text-danger">' + displayInfo.subtitle + '</p>';
                        break;
                    case 'warning':
                    default:
                        icon = 'mdi-alert-warning text-warning';
                        displayInfo.html = '<p class="text-warning">' + displayInfo.subtitle + '</p>';

                }

                displayInfo.icon = icon;
                displayInfo.html += '<p class="text-muted">' + displayInfo.message + '</p>';

                $rootScope.displayInfo = displayInfo;

                $('#info-modal').modal({
                    backdrop: true,
                    keyboard: false,
                    show: false})
                    .modal('show');
            }

            function showNetworkErrorAlert(){
                showInfoAlert({
                        title: strings['NETWORK_ERROR_TITLE'],
                        subtitle: strings['NETWORK_ERROR_SUBTITLE'],
                        message: strings['NETWORK_ERROR_MSG'],
                    type: 'error'
                });
            }

            return {

                /**
                 * @ngdoc function
                 * @name core.Services.Notification#method1
                 * @methodOf core.Services.Notification
                 * @return {boolean} Returns a boolean value
                 */
                showNotificationDialog: showNotificationDialog,

                /**
                 * @ngdoc function
                 * @name core.Services.Notification#showLockedSectionDialog
                 * @methodOf core.Services.Notification
                 * @return {boolean} Returns a boolean value
                 */
                showLockedSectionDialog: showLockedSectionDialog,

                /**
                 * @ngdoc function
                 * @name core.Services.Notification#showInfoAlert
                 * @description Function that displays an information dialog
                 * @param {object} displayInfo Information to display. must have keys:
                 * @param {string} displayInfo.title The name of the event.
                 * @param {string} displayInfo.subtitle The subtitle of the event.
                 * @param {string} displayInfo.message The message of the event.
                 * @param {string} displayInfo.type The type of information it is ('warning'/'error').
                 * @methodOf core.Services.Notification
                 */
                showInfoAlert : showInfoAlert,

                showNetworkErrorAlert : showNetworkErrorAlert
            };
        }
    ]);
