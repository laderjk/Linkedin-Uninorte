(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.busquedaC = busquedaC;
        service.busquedaS = busquedaS;
        service.busquedaF = busquedaF;
        service.busquedaL = busquedaL;
        service.findJob = findJob;
        service.suggestedJob = suggestedJob;
        

        return service;

        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/users/id/' + _id).then(handleSuccess, handleError);
        }

        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
        }

        function busquedaC(_qCarrera) {
            //console.log("Api");
            //console.log(_qCarrera);
            return $http.get('/api/users/Car/' + _qCarrera).then(handleSuccess, handleError);
        }

        
        function busquedaS(_qSemestre) {
            //console.log("Api");
            //console.log(_qSemestre);
            return $http.get('/api/users/Sem/' + _qSemestre).then(handleSuccess, handleError);
        }

        function busquedaF(_qFirst) {
            //console.log("Api");
            //console.log(_qFirst);
            return $http.get('/api/users/Fir/' + _qFirst).then(handleSuccess, handleError);
        }

        function busquedaL(_qLast) {
            //console.log("Api");
            //console.log(_qLast);
            return $http.get('/api/users/Las/' + _qLast).then(handleSuccess, handleError);
        }

        function findJob(_jobquery) {
            return $http.get('/api/users/job/' + _jobquery).then(handleSuccess, handleError);
        }

        function suggestedJob(_carrera) {
            return $http.get('/api/users/job/suggested/' + _carrera).then(handleSuccess, handleError);
        }
        
        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
