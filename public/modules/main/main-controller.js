'use strict'
angular.module('app').controller('MainController', ['$scope','$http',
  function($scope,$http) {

    $http.get('/getCall').success((data) => {
      console.log('calling in app')
      //  console.log(data);
        $scope.messages = data;
    });


  }
]);
