'use strict';

describe('Controller: MainController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('core'));

    var MainController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        MainController = $controller('MainController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
