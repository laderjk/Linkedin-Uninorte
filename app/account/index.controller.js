(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);


    function Controller($window, UserService, FlashService, $scope) {
        var vm = this;

        //console.log(FlashService.getProperty());

        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.busqueda = busqueda;
        vm.agregar = agregar;
        vm.mostrar = "Inicial";
        vm.query = null;
        vm.queryBy = null;
        vm.findJob = findJob;
        vm.sugeridos = [];
        vm.getPerfil = getPerfil;
        vm.perfil = "Inicial";

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                //Perfil Seleccionado
                vm.perfil = FlashService.getProperty();

                //Amigos Sugeridos
                var misAmigos = vm.user.amigos;
                
                for (var x in misAmigos) {
                    UserService.GetById(misAmigos[x].id)
                    .then(function (dat) {
                        if(dat.amigos){
                            for(var y in dat.amigos){
                                var sw = "no";
                                for (var z in misAmigos){
                                    //console.log(dat.amigos[y]);
                                    //console.log(misAmigos[z]);
                                    if(dat.amigos[y].id==misAmigos[z].id){
                                        sw = "si";
                                    }
                                }
                                if(sw=="no"){
                                    vm.sugeridos.push(dat.amigos[y]);
                                    //console.log(dat.amigos);
                                }
                            }
                        }
                    });
                }

                //Trabajos Sugeridos
                UserService.suggestedJob(vm.user.carrera)
                    .then(function (encontrado) {
                        vm.suggestedJob = encontrado;
                        //console.log(vm.mostrar);
                    });
            });
            
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('Actualizado');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            
        }

        function deleteUser() {
            UserService.Delete(vm.user._id)
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function busqueda () {
            if(vm.queryBy == "carrera"){
                //console.log(vm.queryBy);
                UserService.busquedaC(vm.query)
                    .then(function(encontradoC){
                        vm.mostrar = encontradoC;
                    });

            }else if (vm.queryBy == "semestre"){
                //console.log(vm.queryBy);
                UserService.busquedaS(vm.query)
                    .then(function(encontradoS){
                        vm.mostrar = encontradoS;
                    });
            }else if (vm.queryBy == "firstName"){
                //console.log(vm.queryBy);
                UserService.busquedaF(vm.query)
                    .then(function(encontradoF){
                        vm.mostrar = encontradoF;
                    });
            }else if (vm.queryBy == "lastName"){
                //console.log(vm.queryBy);
                UserService.busquedaL(vm.query)
                    .then(function(encontradoL){
                        vm.mostrar = encontradoL;
                    });
            }

            //$scope.$digest();
        }

        function agregar(f_id, f_Name, f_Last, f_email, f_car, f_sem) {
            console.log(f_id);
            vm.user.f_id = f_id;
            vm.user.f_Name = f_Name;
            vm.user.f_Last = f_Last;
            vm.user.f_email = f_email;
            vm.user.f_car = f_car;
            vm.user.f_sem = f_sem;
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('Por favor actualice la página');
                    $window.location = '#/friends';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
            
        }

        function findJob() {
            UserService.findJob(vm.query)
                .then(function (encontrado) {
                    vm.mostrar = encontrado;
                    console.log(vm.mostrar);
                });
        }

        function getPerfil(query) {
            //console.log("id");
            //console.log(query);
            UserService.GetById(query)
            .then(function (per) {
                FlashService.setProperty(per);
                vm.mostrar = per;
                console.log("Perfil");
                //console.log(vm.perfil);
                $window.location = '#/profile';
            });
        }

    };


})();