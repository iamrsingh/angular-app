"use strict";

angular.module('myApp', ['ui.router']);

angular.module('myApp').run(function($rootScope) {
    $rootScope.User = 'fgfdgfdgf';

});

angular.module('myApp').config(function($stateProvider,$urlRouterProvider) {

                            $urlRouterProvider.otherwise('/');

                            $stateProvider.state(
                                'state1', {
                                    url: '/state1',
                                    controller: 'MainController',
                                    templateUrl: 'login_page.html'
                                }
                            );

                            $stateProvider.state(
                                'state2', {
                                    url: '/state2',
                                    controller: 'UserController',
                                    templateUrl: 'UserPage.html'
                                }
                            );

                            $stateProvider.state(
                                'state3', {
                                    url: '/state3',
                                    controller: 'RegController',
                                    templateUrl: 'registration.html'
                                }
                            );

                            $stateProvider.state(
                                'state4', {
                                    url: '/state4',
                                    controller: 'AdminController',
                                    templateUrl: 'admin.html'
                                }
                            );

                            $stateProvider.state(
                                'state5', {
                                    url: '/state5',
                                    controller: 'MainController',
                                    templateUrl: 'about.html'
                                }
                            );
                        });


angular.module('myApp').controller('MainController', ["$scope", "$state", "$http", "$rootScope", function($scope, $state, $http, $rootScope) {
                        $scope.user = {
                                        uid: '',
                                        upswd: ''
                                    };
                        $scope.gohome = function()
                        {
                            $state.go('state1');
                        };

                        $scope.submitForm = function(form) {
                                var credent ={
                                    UserId : $scope.user.uid,
                                    Paswd : $scope.user.upswd
                                };

                                if (form.$invalid) {
                                    window.alert('Invalid User or Password.');
                                    return;
                                }

                                $http.post('/uservalid',credent).then(function(response, status, headers, config){
                                    $scope.validuser = response.data;
                                });

                                if ($scope.validuser[0][0] === 1) {
                                    $rootScope.User = $scope.user.uid;
                                    if ($scope.user.uid === 'admin') {
                                        $state.go('state4');
                                    } else {
                                        $state.go('state2');
                                    }
                                } else {
                                    window.alert('Invalid User or Password.');
                                }
                            };
	}]);

angular.module('myApp').controller('UserController',["$scope", "$state", "$http", "$rootScope", function($scope, $state, $http, $rootScope){
    $scope.UName = $rootScope.User;
    $scope.UserData = [];
    $scope.PolicyData = [];
    var UserName = {
        Usr : $rootScope.User
    };

    $http.post('/userdata',UserName).then(function(response){
        $scope.UserData = response.data;
    });

    $http.get('/policydata').then(function(response){
        $scope.PolicyData = response.data;
    });

    $scope.logout = function(form){
        $state.go('state1');
    };

}]);

angular.module('myApp').controller('RegController', ["$scope", "$state", "$http", function($scope, $state, $http) {

    $scope.user = {
                    fname: '',
                    lname: '',
                    dob: '',
                    addr: '',
                    phno: '',
                    eml: '',
                    pwd: '',
                    cpwd: ''
                };

    $scope.submitForm = function(form) {

        if (form.$invalid) {
            window.alert('Please all mandatory fields.');
            return;
        };
        var rdata = {
            fname : $scope.user.fname,
            lname : $scope.user.lname,
            dob : $scope.user.dob,
            addr : $scope.user.addr,
            phno : $scope.user.phno,
            eml : $scope.user.eml,
            pwd : $scope.user.pwd
        };

        $http.post('/regdata',rdata).then(function(response, status, headers, config){
            $scope.UserID = JSON.stringify(response.data);
        });

        $scope.printmsg = 'Your User ID is';

        alert('Registration Successful.');

        $scope.user.fname = '';
        $scope.user.lname = '';
        $scope.user.dob = '';
        $scope.user.addr = '';
        $scope.user.phno = '';
        $scope.user.eml = '';
        $scope.user.pwd = '';
        $scope.user.cpwd = '';

    };

    $scope.resetForm = function(form) {

            $scope.user.fname = '';
            $scope.user.lname = '';
            $scope.user.dob = '';
            $scope.user.addr = '';
            $scope.user.phno = '';
            $scope.user.eml = '';
            $scope.user.pwd = '';
            $scope.user.cpwd = '';
            $scope.printmsg = '';
            $scope.UserID = '';
                    };

}]);

angular.module('myApp').controller('AdminController',["$scope", "$state", "$http", "$rootScope", function($scope, $state, $http, $rootScope){
    $scope.PolicyData = [];

    var UserName = {
        Usr : $rootScope.User
    };

    $http.get('/policydata').then(function(response){
        $scope.PolicyData = response.data;
    });

    $scope.logout = function(form){
        $state.go('state1');
    };

    $scope.save = function(form) {
        var upddata = $scope.PolicyData;
        if (form.$invalid) {
            window.alert('Please all mandatory fields.');
            return;
        } else {
            $http.post('/policyupd', upddata).then(function (response, status, headers, config) {
                if (status = 200) {
                    window.alert('Update is saved');
                }
                else {
                    window.alert('Update is failed');
                }
            });
        }
    };

}]);
