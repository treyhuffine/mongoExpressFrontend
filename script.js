'use strict';

angular.module('heimdall', [])

.controller('MainCtrl', function($scope, $http){
  $http.get("http://localhost:3000/questions").success(function(data) {
    $scope.questions = data;
  }).error(function(err) {
    console.log(err);
  });
});
