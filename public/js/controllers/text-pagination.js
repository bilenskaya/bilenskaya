var TextPaginationController = ['$scope',
     '$http',  'myContentService', function($scope, $http, myContentService) {


        $scope.successContent = false;

        $scope.getBookFn = function () {
            console.log ('jhgg')

            return $http.get('/articles/5298d7b452aab75403000004')

                .then(function(book) {

                    console.log (book.data)

                    $scope.successContent = true ;
                    myContentService.prepForBroadcast(book.data.para);



                    return book.data;

                })



        };

    }]

