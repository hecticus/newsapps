'use strict';

describe('Controller: FavoritesController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('core'));

    var FavoritesController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        FavoritesController = $controller('FavoritesController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
