'use strict';

module.exports = function(app) {
  app.controller('instancesController', ['$scope', '$http', '$cookies', '$route', '$window', function($scope, $http, $cookies, $route, $window) {
    var jwt = $cookies.get('jwt');
    $http.defaults.headers.common['x-access-token'] = jwt;
    var getAll = function() {
      $http.get('/api/instances').success(function(response) {
        // In the response, we are sending all of the data for the user that is
        // currently logged in.
        $scope.instances = response.data;
        $scope.userId = response.userId;
        $scope.isCommitted = response.isCommitted;
        $scope.hosting = response.hosting;
        $scope.userName = response.userName;
        console.log('$scope.instances is below:');
        console.log($scope.instances);
      });
      $http.get('/api/locations').success(function(response) {
        $scope.locations = response.data;
      });
    };
    if (jwt){
      getAll();
    }
    $scope.findId = function(instance) {
      var users = [];
      instance.participants.forEach(function(participant) {
        users.push(participant._id);
      });
      return users;
    };

    $scope.submitForm = function(instance) {
      instance.host = $scope.userName;
      $http.post('/api/instances/', instance).success(function(response) {
        $http.get('/api/instances').success(function(response) {
          $scope.instances = response.data;
        });
      });
    };

    $scope.destroy = function(id) {
      $http.delete('/api/instances/' + id).success(function(response) {
        getAll();
      });
    }

    $scope.edit = function(instance) {
      instance.editing = true;
    };

    $scope.cancel = function(instance) {
      getAll();
    };

    $scope.update = function(instance) {
      $http.put('/api/instances/' + id, instance)
        .error(function(error) {
          $scope.errors.push({
            msg: 'could not update instance'
          });
        });
      instance.editing = false;
      getAll();
    };
    $scope.reloadPage = function() {
      $window.location.reload();
    };
    $scope.join = function(id){
      $http.put('/api/instances/' + id + "/join");
    };
    $scope.quit = function(id){
      $http.put('/api/instances/' + id + "/quit");
    };
    $scope.gameOver = function(id){
      $http.put('/api/instances/' + id, {
        gameOver: true
      });
    };
  }]);
};
