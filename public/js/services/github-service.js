angular.module('coderFriends').service('githubSvc', function($http) {

    this.getFollowing = function() {
        return $http.get('/api/github/following').then(function(response) {
            return this.friends = response.data;
        })
    }

    this.getEvents = function(username) {
        return $http.get('/api/github/' + username + '/activity').then(function(response) {
            return this.eventData = response.data;
        })
    }

})
