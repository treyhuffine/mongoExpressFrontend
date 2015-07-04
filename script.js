angular.module('questions', ['ui.router'])
.constant("ATN", {
  "API_URL": "https://mongoexoress.herokuapp.com"
})
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "list.html",
      controller: 'MainCtrl'
    })
    .state('question', {
      url: "/:slug",
      templateUrl: "question.html",
      controller: "QuestionCtrl"
    });
})
.factory('Question', function($http, ATN) {
  return {
    getOne: function(slug) {
      return $http.get(ATN.API_URL + "/questions/" + slug);
    },
    getAll: function() {
      return $http.get(ATN.API_URL + "/questions");
    },

    addQuestion: function(newQuestion) {
      return $http.post(ATN.API_URL + "/questions", newQuestion);
    }
  }
})
.filter("dateInWords", function() {
  return function(input) {
    return moment(input).utc().fromNow();
  }
})
.controller('QuestionCtrl', function($scope, Question, $state){
  $scope.slug = $state.params.slug;

  Question.getOne($state.params.slug)
    .success(function(data) {
      $scope.question = data;
    }).catch(function(err) {
      console.error(err);
    });
})
.controller('MainCtrl', function($scope, Question){
  Question.getAll().success(function(data) {
    $scope.questions = data;
  }).catch(function(err) {
    console.error(err);
  });

  $scope.askQuestion = function() {
    Question.addQuestion($scope.question)
      .success(function(data) {
        $scope.questions.unshift(data);
        $scope.question = {};
        $("#new-question-modal").modal("hide");
      })
      .catch(function(err) {
        console.error(err);
      })
  };

});
