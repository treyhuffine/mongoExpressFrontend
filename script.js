angular.module('questions', ['ui.router', 'firebase'])
.constant("ATN", {
  "API_URL": "http://localhost:3000",
  "FB_URL": "https://treyhuffine-sample-apps.firebaseio.com/ask-the-nerds"
  // "API_URL": "https://mongoexoress.herokuapp.com/"
})
.run(function($rootScope, $window, $firebaseAuth,ATN) {
  $rootScope.fbRef = new $window.Firebase(ATN.FB_URL);
  $rootScope.afAuth = $firebaseAuth($rootScope.fbRef);
  // $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
  // // We can catch the error thrown when the $requireAuth promise is rejected
  // // and redirect the user back to the home page
  // if (error === "AUTH_REQUIRED") {
  //     $location.path("/login");
  //   }
  // });
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
  $scope.registerUser(function() {});
  $scope.loginUser(function() {});
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
