angular.module('questions', ['ui.router'])
.run()
.constant("ATN", {
  "API_URL": "http://localhost:3000"
  // "API_URL": "https://mongoexoress.herokuapp.com/"
})
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "list.html",
      controller: 'MainCtrl'
    })
    .state('404', {
      url: '/404',
      templateUrl: '404.html'
    })
    .state('new', {
      url: "/new",
      templateUrl: "ask.html",
      controller: "AskCtrl"
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
  };
})
.filter("dateInWords", function() {
  return function(input) {
    return moment(input).utc().fromNow();
  };
})
.controller('LoginCtrl', function($scope, $state) {

})
.controller('AskCtrl', function($scope, Question, $state) {
  $scope.askQuestion = function() {
    Question.addQuestion($scope.question)
      .success(function(data) {
        $state.go("home");
      })
      .catch(function(err) {
        console.error(err);
      });
  };
})
.controller('QuestionCtrl', function($scope, Question, $state){
  $scope.slug = $state.params.slug;

  Question.getOne($state.params.slug)
    .success(function(data) {
      $scope.question = data;
    }).catch(function(err) {
      console.error(err);
      $state.go('404');
    });
})
.controller('MainCtrl', function($scope, Question){
  Question.getAll().success(function(data) {
    $scope.questions = data;
  }).catch(function(err) {
    console.error(err);
  });
});
