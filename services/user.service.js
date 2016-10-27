var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.busquedaC = busquedaC;
service.busquedaS = busquedaS;
service.busquedaF = busquedaF;
service.busquedaL = busquedaL;
service.findJob = findJob;
service.suggestedJob = suggestedJob;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();

    db.users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {

            // return user (without hashed password)
            //deferred.resolve(user);
            deferred.resolve(user);
        } else {
            // user not found
            deferred.resolve();
        }
    });
        

    return deferred.promise;
}

function create(userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        db.users.insert(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
            email: userParam.email,
            carrera: userParam.carrera,
            semestre: userParam.semestre
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        //Se actualiza la empresa
        if (userParam.empresa) {
            db.users.update(
                { _id: mongo.helper.toObjectID(_id) },
                {
                    "$push": {
                        "trabajos": {
                            "empresa": userParam.empresa,
                            "cargo": userParam.cargo,
                            "fecha_inicio": userParam.fecha_inicio,
                            "fecha_fin": userParam.fecha_fin,
                        }
                    }
                },
                function (err, doc) {
                    if (err) deferred.reject(err.name + ': servicio ' + err.message);

                    deferred.resolve();
                });
        } else if (userParam.empresa_publicacion) {
            db.users.update(
                { _id: mongo.helper.toObjectID(_id) },
                {
                    "$push": {
                        "publicaciones": {
                            "empresa_publicacion": userParam.empresa_publicacion,
                            "contacto": userParam.contacto,
                            "telefono": userParam.telefono,
                            "descripcion": userParam.descripcion,
                            "salario": userParam.salario,
                            "carreras_afines": userParam.carreras_afines,
                        }
                    }
                },
                function (err, doc) {
                    if (err) deferred.reject(err.name + ': servicio ' + err.message);

                    deferred.resolve();
                });
        }else if (userParam.f_id){
            db.users.update(
                { _id: mongo.helper.toObjectID(_id) },
                {
                    "$push": {
                        "amigos": {
                            "id": userParam.f_id,
                            "firstName": userParam.f_Name,
                            "lastName": userParam.f_Last,
                            "email": userParam.f_email,
                            "carrera": userParam.f_car,
                            "semestre": userParam.f_sem,
                        }
                    }
                },
                function (err, doc) {
                    if (err) deferred.reject(err.name + ': servicio ' + err.message);

                    deferred.resolve();
                });
        }else{
            //Se actualiza la info del usuario
            db.users.update(
                { _id: mongo.helper.toObjectID(_id) },
                { $set: set },
                function (err, doc) {
                    if (err) deferred.reject(err.name + ': servicio ' + err.message);

                    deferred.resolve();
                });
        }
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function busquedaC(qCarrera) {
    console.log("Carrera");

    var deferred = Q.defer();

    db.users.find({ carrera: {$regex : ".*"+qCarrera+".*"} }).toArray(function (err, doc) {
        deferred.resolve(doc);
    });
    
    return deferred.promise;
}

function busquedaS(qSemestre) {
    //console.log("Semestre");

    var deferred = Q.defer();

    db.users.find({ semestre: {$regex : ".*"+qSemestre+".*"} }).toArray(function (err, doc) {
        deferred.resolve(doc);
    });
    
    return deferred.promise;
}


function busquedaF(qFirst) {
    //console.log("Nombre");

    var deferred = Q.defer();

    db.users.find({ firstName : {$regex : ".*"+qFirst+".*"}}).toArray(function (err, doc) {
        deferred.resolve(doc);
    });
    
    return deferred.promise;
}

function busquedaL(qLast) {
    //console.log("Apellido");

    var deferred = Q.defer();

    db.users.find({ lastName: {$regex : ".*"+qLast+".*"} }).toArray(function (err, doc) {
        deferred.resolve(doc);
    });
    
    return deferred.promise;
}

function findJob(query) {
    var deferred = Q.defer();
    db.users.find({ "$or": [{ "publicaciones.empresa_publicacion": {$regex : ".*"+query+".*"} }, { "publicaciones.descripcion": {$regex : ".*"+query+".*"} }] },
        { publicaciones: { $elemMatch: { "$or": [{ descripcion: {$regex : ".*"+query+".*"} }, {empresa_publicacion: {$regex : ".*"+query+".*"} } ]} }}).toArray(function (err, doc1) {
        deferred.resolve(doc1);
    });
    return deferred.promise;
}

function suggestedJob(carrera) {
    var deferred = Q.defer();
    db.users.find({"publicaciones.carreras_afines" : {$regex : ".*"+carrera+".*"}}).toArray(function (err, doc1) {
        deferred.resolve(doc1);
    });
    return deferred.promise;
}
