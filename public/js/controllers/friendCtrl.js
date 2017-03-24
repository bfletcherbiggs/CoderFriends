angular.module('coderFriends')
    .controller("friendCtrl", function($scope, githubSvc, $stateParams) {

        $scope.username = $stateParams.github_username;

        $scope.activity = function() {
            githubSvc.getEvents($scope.username).then(function(response) {
                $scope.activities = JSON.parse(response.body);
            })
        }

        $scope.activity();
    })
