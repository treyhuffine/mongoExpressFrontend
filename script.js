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
    },
    viewQuestion: function(question) {
      return $http.get(ATN.API_URL + "/question/" + question.slug);
    }
  };
})
.controller('MainCtrl', function($scope, $http, $location, Question){
  $scope.questions = {};
  $scope.focusQuestion = {};
  $scope.singleView = false;
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
  $scope.viewQuestion = function(question) {
    Question.viewQuestion(question)
      .success(function(data) {
        $scope.focusQuestion = data;
        $scope.singleView = true;
        $location.url("/" + $scope.focusQuestion.slug);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  $scope.backToMain = function() {
    $scope.singleView = false;
    $scope.focusQuestion = {};
    $location.url("/");
  };
});
