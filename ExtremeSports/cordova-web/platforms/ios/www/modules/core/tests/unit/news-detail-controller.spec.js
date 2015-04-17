'use strict';

describe('Controller: NewsDetailController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('core'));

    var NewsDetailController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        NewsDetailController = $controller('NewsDetailController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
