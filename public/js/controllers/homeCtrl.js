angular.module('coderFriends')
    .controller("homeCtrl", function($scope, githubSvc) {

        $scope.getFollowing = githubSvc.getFollowing

        $scope.getFollowing().then(function(response) {
            $scope.friends = response;
        })

    })
