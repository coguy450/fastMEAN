'use strict';


angular.module('app').controller('dbConsoleController', ['$scope','$http',
    function($scope,$http) {
        $scope.dynHeaders =[];
        $http.get('/dbconsole/collections')
            .success(function(c){
                 $scope.collList = c.collections;
            })
            .error(function(err){
                 $scope.error = err;
             });

        $scope.doFind = function(coll){
            $scope.showLoading = true;
            $scope.error = '';
            $scope.key = '';
            $scope.collViewing = coll;
            $scope.downloadLink = '';
            $http.post('/dbconsole/basicfind',{collName: coll,limit:$scope.limiter})
                .success(function(data){
                  $scope.results = data.r;
                  $scope.countOfResults = data.count;
                    $scope.showLoading = false;
                })
                .error(function(err){
                    $scope.error = err.message;
                });
        };
        $scope.advancedFind = function(){
            if ($scope.key){
                $scope.showLoading = true;
                $scope.error = '';
            $http.post('/dbconsole/advancedfind',{collName: $scope.collViewing,searchText:$scope.actionToDo,limit:$scope.limiter,searchKey:$scope.key})
                .success(function(data){
                    $scope.results = data.r;
                    $scope.showLoading = false;
                })
                .error(function(err){
                    $scope.error = err.message;
                });
            } else {
                $scope.error = 'Please select a column to search on';
            }
        };

        $scope.searchKey = function(key){
            $scope.error = '';
            $scope.key = key;
        };

        $scope.dropCollection = function(){
            $http.post('/dbconsole/dropcoll',{coll: $scope.collViewing})
                .success(function(data){
                    window.location.reload();
                })
                .error(function(err){
                    $scope.error = err.message;
                });
        };

        $scope.seedCollection = function(){
            $http.get('/ned/appv/triggerPopulate')
            .success(function(d){
                $scope.doFind('appvconfigs');
            })
                .error(function(err){
                    $scope.error = 'This collection can not be seeded, it might already be full'
                })
        };

        $scope.seedApplications = function(){
            $http.get('/seeds/applications')
                .success(function(d){
                    $scope.doFind('applications');
                })
                .error(function(err){
                    $scope.error = err;
                })
        };

        $scope.seedMenus = function(){
            $http.get('/menus/seed')
                .success(function(d){
                    $scope.doFind('menus');
                })
                .error(function(err){
                    $scope.error = err;
                })
        };

        $scope.doClear = function(){
            $scope.actionToDo = '';
            $scope.doFind($scope.collViewing);
        };

        $scope.deleteDoc = function(doc){
            $http.post('/dbconsole/deletedoc',{document: doc})
                .success(function(data){
                    $scope.error = 'Document has been deleted';
                })
                .error(function(err){
                    $scope.error = err.message;
                });
        };

        $scope.downloadColl = function(){
            $http.post('/dbconsole/download',{coll: $scope.collViewing})
                .success(function(link){
                    $scope.downloadLink = link;
                })
                .error(function(err){
                    $scope.error = err.message;
                })

        }


    }]);

