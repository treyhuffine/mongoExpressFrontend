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
    },
    deleteQuestion: function(delQ) {
      return $http.delete(ATN.API_URL + "/questions/" + delQ);
    }
  };
})
.filter("dateInWords", function() {
  return function(input) {
    return moment(input).utc().fromNow();
  };
})
.controller('LoginCtrl', function($scope, $rootScope) {
  $scope.loggedIn = false;
  $scope.$checkAuth = $rootScope.afAuth.$onAuth(function(authData) {
    if (authData) {
      console.log(authData);
      $rootScope.currentUser = {};
      $scope.loggedIn = true;
      $rootScope.currentUser.userToken = authData.uid;
      $rootScope.currentUser.email = authData.password.email;
    }
  });
  $scope.registerUser = function() {
    console.log($scope.user);
    $rootScope.afAuth.$createUser({
      email: $scope.user.email,
      password: $scope.user.password
    },
    function(error, userData) {
      if (error) {
        switch (error.code) {
          case "EMAIL_TAKEN":
            alert("The new user account cannot be created because the email is already in use.");
            break;
          case "INVALID_EMAIL":
            alert("The specified email is not a valid email.");
            break;
          default:
            alert("Error creating user:", error);
        }
      } else {
        alert("Register Successful - Please login");
      }
    })
    .then(function(userData) {
      $("#signup-modal").modal("hide");
      console.log("create", userData);
    })
    .catch(function(err) {
      console.log(err);
    });
  };
  $scope.loginUser = function() {
    console.log("login");
    $rootScope.afAuth.$authWithPassword({
      email: $scope.user.email,
      password: $scope.user.password
    }, function() {
      $checkAuth();
      $("#login-modal").modal("hide");
    });
    $("#login-modal").modal("hide");
  };
  $scope.logout = function(){
    $scope.loggedIn = false;
    $rootScope.afAuth.$unauth();
  };
})
.controller('AskCtrl', function($scope, $rootScope, Question, $state) {
  $scope.askQuestion = function() {
    Question.addQuestion({
      email: $rootScope.currentUser.email,
      body: $scope.body,
      uid: $rootScope.currentUser.userToken})
    .success(function(data) {
      $state.go("home");
    })
    .catch(function(err) {
      console.error(err);
    });
  };
})
.controller('QuestionCtrl', function($scope, Question, $state, $rootScope){
  $scope.slug = $state.params.slug;

  Question.getOne($state.params.slug)
    .success(function(data) {
      $scope.question = data;
    }).catch(function(err) {
      console.error(err);
      $state.go('404');
  });
  $scope.isUser = function(question) {
    if ($rootScope.currentUser) {
      return question.email === $rootScope.currentUser.email;
    }
    else {
      return false;
    }
  };
  $scope.deleteQuestion = function(delQ) {
    console.log(delQ.slug);
    Question.deleteQuestion(delQ.slug)
      .success(function(data) {
        console.log(data);
      })
      .catch(function(err) {
        console.error(err);
      });
  };
})
.controller('MainCtrl', function($scope, Question, $rootScope){
  Question.getAll().success(function(data) {
    $scope.questions = data;
  }).catch(function(err) {
    console.error(err);
  });
  $scope.isUser = function(question) {
    if ($rootScope.currentUser) {
      return question.email === $rootScope.currentUser.email;
    }
    else {
      return false;
    }
  };
  $scope.editQuestion = function() {};
  $scope.deleteQuestion = function(delQ) {
    console.log(delQ.slug);
    Question.deleteQuestion(delQ.slug)
      .success(function(data) {
        console.log(data);
      })
      .catch(function(err) {
        console.error(err);
      });
  };
});
