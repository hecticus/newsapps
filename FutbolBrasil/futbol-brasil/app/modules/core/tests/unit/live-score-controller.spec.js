'use strict';

describe('Controller: LiveScoreCtrl', function() {

    //Load the ui.router module
    beforeEach(module('ui.router'));
    //Load the module
    beforeEach(module('core'));

    var LiveScoreCtrl,
        scope;

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        LiveScoreCtrl = $controller('LiveScoreCtrl', {
        $scope: scope
        });
    }));

    it('should ...', function() {

    });
});
