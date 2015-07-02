angular.module('askNerds', [])
.constant("ATN", {
  "API_URL": "http://localhost:3000"
})
.factory('Question', function($http, ATN) {
  return {
    getQuestions: function() {
      return $http.get(ATN.API_URL + "/questions");
    },
    postQuestion: function(newQuestion) {
      return $http.post(ATN.API_URL + "/questions", newQuestion);
    }
  };
})
.controller('MainCtrl', function($scope, $http, Question){
  Question.getQuestions()
    .success(function(data) {
      $scope.questions = data;
    }).catch(function(err) {
      console.log(err);
    });
  $scope.postQuestion = function() {
    Question.postQuestion($scope.question)
      .success(function(data) {
        $scope.questions.unshift(data);
        $scope.question = {};
        $("#new-question-modal").modal("hide");
      })
      .catch(function(error) {
        console.error(error);
      });
  };
});
