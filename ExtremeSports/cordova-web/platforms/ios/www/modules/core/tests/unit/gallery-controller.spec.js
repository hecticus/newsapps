'use strict';

describe('Controller: GalleryController', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('core'));

    var GalleryController,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        GalleryController = $controller('GalleryController', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
