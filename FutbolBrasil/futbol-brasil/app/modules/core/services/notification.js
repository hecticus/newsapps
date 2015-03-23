'use strict';

/**
 * @ngdoc service
 * @name core.Services.Notification
 * @description Notification Factory
 */
angular
    .module('core')
    .factory('Notification',['$rootScope',
        function($rootScope) {

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

            function showLockedSectionDialog(){
                showNotificationDialog(
                    {
                        title : 'Locked Section',
                        message : 'This section is locked for Guest Users. Please register to unlock',
                        confirm: 'Ok',
                        cancel: 'Cancel'
                    }
                );
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
                    title: 'Network Error',
                    subtitle: 'Connection Lost',
                    message: "Couldn't get a response from server",
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
