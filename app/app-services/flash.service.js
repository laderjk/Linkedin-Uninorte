(function () {
    'use strict';

    angular
        .module('app')
        .factory('FlashService', Service);
        
    function Service($rootScope) {
        var service = {};

        var guardar = '';

        service.Success = Success;
        service.Error = Error;

        service.getProperty = getProperty;
        service.setProperty = setProperty;

        initService();

        return service;

        function initService() {
            guardar = ''; 
            $rootScope.$on('$locationChangeStart', function () {
                clearFlashMessage();
            });

            function clearFlashMessage() {
                var flash = $rootScope.flash;
                if (flash) {
                    if (!flash.keepAfterLocationChange) {
                        delete $rootScope.flash;
                    } else {
                        // only keep for a single location change
                        flash.keepAfterLocationChange = false;
                    }
                }
            }
        }

        function Success(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'success', 
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function Error(message, keepAfterLocationChange) {
            $rootScope.flash = {
                message: message,
                type: 'danger',
                keepAfterLocationChange: keepAfterLocationChange
            };
        }

        function getProperty() {
            return $rootScope.prop;
        }

        function setProperty(value) {
            $rootScope.prop = value;
        }
            
    }

})();