'use strict';

    var app = angular.module('app', ['ngRoute'])

    .controller('MainController', function ($scope) {
       $scope.helloWorld = 'This is an Angular Variable';
            $scope.d3W = 100;
            $scope.d3Ex = d3.select("body").append("avg").append("rect").attr("width",50).attr("height",200).style("fill:blue");
    })


    .config(['$routeProvider', '$controllerProvider', '$provide', function ($routeProvider) {

            //This can be used for your client side routing
        $routeProvider
            .when('/', {
                templateUrl: 'modules/core/views/main.html',
                controller: 'MainController'
            })
            .when('/db',{
                templateUrl: 'modules/dbConsole/dbconsole.client.view.html',
                controller: 'dbConsoleController'
            })



    }]);
