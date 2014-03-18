'use strict';

//Articles service used for books REST endpoint
angular.module('mean.books').factory('Books', ['$resource', function($resource) {
    return $resource('books/:bookId', {
        bookId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);