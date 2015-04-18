'use strict';

describe('Controller: NewsController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('core'));

    var NewsController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        NewsController = $controller('NewsController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
