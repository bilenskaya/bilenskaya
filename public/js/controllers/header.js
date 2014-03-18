'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Resume',
        'link': 'resume'
    }, {
        'title': 'Projects',
        'link': 'projects'
    },
        {
            'title': 'Contacts',
            'link': 'contacts'
        }];
    
    $scope.isCollapsed = false;
}]);