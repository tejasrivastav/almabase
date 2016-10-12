/// <reference path="./typings/main.d.ts" />
/// <reference path="./directives/baseComponent.ts" />
/// <reference path="./directives/apiLog.ts" />
/// <reference path="./services/remainderService.ts" />
/// <reference path="./services/socket.ts" />


module webapp {
    export function init(){
        var app: ng.IModule = angular.module("almabase",[
            'ngMaterial',
            'ngMaterialDatePicker',
            'btford.socket-io'
        ]);

        configuration(app);
        loadDirectives(app);
        loadServices(app);
    }

    function configuration(app){
        // lime
        app.config(function($mdThemingProvider) {

            $mdThemingProvider.theme('default')
            .primaryPalette('amber', {
            'default': '400', // by default use shade 400 from the pink palette for primary intentions
            'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
            'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
            'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
            // If you specify less than all of the keys, it will inherit from the
            // default shades
            .accentPalette('indigo', {
            'default': '200' // use shade 200 for default, and keep all other shades the same
            });

        });
    }

    function loadDirectives(app){
        app.directive("baseComponent", webapp.directives.BaseComponent);
        app.directive("apiLog", webapp.directives.ApiLog);
    }

    function loadServices(app: ng.IModule){
        app.service("RemainderService",webapp.services.RemainderService);
        app.factory("Socket",webapp.services.Socket);
    }
}

webapp.init();