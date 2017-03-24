angular.module('coderFriends', ['ui.router'])

    .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: './js/templates/login.html',
                controller: 'homeCtrl'
            })
            .state('home', {
                url: '/home',
                templateUrl: './js/templates/home.html',
                controller: 'homeCtrl'
            })
            .state('friend', {
                url: '/profile/:github_username',
                'templateUrl': './js/templates/profile.html',
                controller: 'friendCtrl'
            });

        $urlRouterProvider.otherwise('/login');

    })

    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push('myHttpInterceptor');
    })

    // register the interceptor as a service
    .factory('myHttpInterceptor', function($q) {
        return {
            responseError: function(rejection) {
                if (rejection.status == 403) {
                    document.location = '/#!/login';
                    return;
                }
                return $q.reject(rejection);
            }
        };
    });
