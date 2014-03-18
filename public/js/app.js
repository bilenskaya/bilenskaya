'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.articles',  'mean.books', 'text-pagination']);

angular.module('mean.system', []);

angular.module('mean.articles', []);
angular.module('mean.books', []);