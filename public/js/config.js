'use strict';

//Setting up route
angular.module('mean').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $stateProvider
      .state('resume', {
        url: '/resume',
        templateUrl: 'views/resume.html'
    })
      .state('projects', {
        url: '/projects',
        templateUrl: 'views/projects.html'
    })

        .state('contacts', {
            url: '/contacts',
            templateUrl: 'views/contacts.html'
        })

        .state('demoreader', {
            url: '/projects/demoreader',
            templateUrl: 'views/demo/reader.html'
        })


      .state('edit article', {
        url: '/articles/:articleId/edit',
        templateUrl: 'views/articles/edit.html'
    })
      .state('article by id', {
        url: '/articles/:articleId',
        templateUrl: 'views/articles/view.html'
    })
      .state('home', {
        url: '/',
        templateUrl: 'views/index.html'
    });
}
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
}
]);
