(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('newjob', {
                url: '/new/job',
                templateUrl: 'jobs/newjob.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'jobs' }
            })
            .state('jobs', {
                url: '/jobs',
                templateUrl: 'jobs/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'jobs' }
            })
            .state('newpost', {
                url: '/new/post',
                templateUrl: 'posts/newpost.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'posts' }
            })
            .state('posts', {
                url: '/posts',
                templateUrl: 'posts/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'posts' }
            })
            .state('friends', {
                url: '/friends',
                templateUrl: 'friends/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'friends' }
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'profile/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('query', {
                url: '/query',
                templateUrl: 'query/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'posts' }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'about/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'about' }
            })
            .state('account', {
                url: '/account',
                templateUrl: 'account/index.html',
                controller: 'Account.IndexController',
                controllerAs: 'vm',
                data: { activeTab: 'account' }
            });
    }

    function run($http, $rootScope, $window, UserService, FlashService) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });

        /*
        $rootScope.busqueda = function () {
            
            var result = UserService.busqueda($rootScope.query);
            FlashService.setProperty(result);
            console.log('Server Respuesta!');
            console.log(FlashService.getProperty());
            
            $window.location = '#/query';
        };
        */
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['app']);
        });
    });

     
    $(function(){
        
        $(".input-group-btn .dropdown-menu li a").click(function(){

            var selText = $(this).html();
        
            //working version - for single button //
           //$('.btn:first-child').html(selText+'<span class="caret"></span>');  
           
           //working version - for multiple buttons //
           $(this).parents('.input-group-btn').find('.btn-search').html(selText);

       });

    });


 

})();