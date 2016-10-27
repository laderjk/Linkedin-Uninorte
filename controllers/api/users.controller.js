﻿var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.get('/Car/:_qCarrera', busquedaC);
router.get('/Sem/:_qSemestre', busquedaS);
router.get('/Fir/:_qFirst', busquedaF);
router.get('/Las/:_qLast', busquedaL);
router.get('/job/:_jobquery', findJob);
router.get('/job/suggested/:_carrera', suggestedJob);
router.get('/id/:_id', getId);


module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function busquedaC(req, res) {
    userService.busquedaC(req.params._qCarrera)
        .then(function(data){
            //console.log(data);
            res.send(data);
        });
}

function busquedaS(req, res) {
    userService.busquedaS(req.params._qSemestre)
        .then(function(data){
            //console.log(data);
            res.send(data);
        });
}

function busquedaF(req, res) {
    userService.busquedaF(req.params._qFirst)
        .then(function(data){
            //console.log(data);
            res.send(data);
        });
}

function busquedaL(req, res) {
    userService.busquedaL(req.params._qLast)
        .then(function(data){
            //console.log(data);
            res.send(data);
        });
}

function findJob(req, res) {
    //console.log("Si se pueden hacer cambios");
    userService.findJob(req.params._jobquery)
        .then(function (data) {
            //console.log(data);
            res.send(data);
        });
}

function suggestedJob(req, res) {
    //console.log("Si se pueden hacer cambios");
    userService.suggestedJob(req.params._carrera)
        .then(function (data) {
            //console.log(data);
            res.send(data);
        });
}

function getId(req, res) {
    //console.log("Si se pueden hacer cambios");
    userService.getById(req.params._id)
        .then(function (data) {
            //console.log(data);
            res.send(data);
        });
}