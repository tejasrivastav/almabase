var webapp;
(function (webapp) {
    var directives;
    (function (directives) {
        var BaseComponent = (function () {
            function BaseComponent() {
                return {
                    templateUrl: "/public/partials/baseComponent.html",
                    controller: ["$scope", "RemainderService", function ($scope, RemainderService) {
                            $scope.info = {
                                source: "12.927880, 77.627600",
                                destination: "13.035542, 77.597100",
                                time: new Date(),
                                email: "tejasrivastav@gmail.com"
                            };
                            $scope.setRemainder = function () {
                                RemainderService.post($scope.info);
                            };
                        }]
                };
            }
            return BaseComponent;
        })();
        directives.BaseComponent = BaseComponent;
    })(directives = webapp.directives || (webapp.directives = {}));
})(webapp || (webapp = {}));
var webapp;
(function (webapp) {
    var directives;
    (function (directives) {
        var ApiLog = (function () {
            function ApiLog() {
                return {
                    templateUrl: "/public/partials/apiLog.html",
                    controller: ["$scope", "Socket", function ($scope, Socket) {
                            $scope.messages = [];
                            Socket.on("message", function (data) {
                                var newMessage = {
                                    time: new Date(data.time).toLocaleString(),
                                    text: data.text
                                };
                                $scope.messages.push(newMessage);
                            });
                        }]
                };
            }
            return ApiLog;
        })();
        directives.ApiLog = ApiLog;
    })(directives = webapp.directives || (webapp.directives = {}));
})(webapp || (webapp = {}));
/// <reference path="../typings/main.d.ts" />
var webapp;
(function (webapp) {
    var services;
    (function (services) {
        var RemainderService = (function () {
            function RemainderService($http) {
                this.$http = $http;
            }
            RemainderService.prototype.post = function (input) {
                return this.$http.post("/remainder", input)
                    .then(function (res) {
                    return res.data;
                });
            };
            RemainderService.$inject = [
                "$http"
            ];
            return RemainderService;
        })();
        services.RemainderService = RemainderService;
    })(services = webapp.services || (webapp.services = {}));
})(webapp || (webapp = {}));
var webapp;
(function (webapp) {
    var services;
    (function (services) {
        var Socket = (function () {
            function Socket(socketFactory) {
                this.socketFactory = socketFactory;
                var mySocket = window["io"].connect("/log");
                return socketFactory({ ioSocket: mySocket });
            }
            Socket.$inject = ['socketFactory'];
            return Socket;
        })();
        services.Socket = Socket;
    })(services = webapp.services || (webapp.services = {}));
})(webapp || (webapp = {}));
/// <reference path="./typings/main.d.ts" />
/// <reference path="./directives/baseComponent.ts" />
/// <reference path="./directives/apiLog.ts" />
/// <reference path="./services/remainderService.ts" />
/// <reference path="./services/socket.ts" />
var webapp;
(function (webapp) {
    function init() {
        var app = angular.module("almabase", [
            'ngMaterial',
            'ngMaterialDatePicker',
            'btford.socket-io'
        ]);
        configuration(app);
        loadDirectives(app);
        loadServices(app);
    }
    webapp.init = init;
    function configuration(app) {
        // lime
        app.config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('amber', {
                'default': '400',
                'hue-1': '100',
                'hue-2': '600',
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
                .accentPalette('indigo', {
                'default': '200' // use shade 200 for default, and keep all other shades the same
            });
        });
    }
    function loadDirectives(app) {
        app.directive("baseComponent", webapp.directives.BaseComponent);
        app.directive("apiLog", webapp.directives.ApiLog);
    }
    function loadServices(app) {
        app.service("RemainderService", webapp.services.RemainderService);
        app.factory("Socket", webapp.services.Socket);
    }
})(webapp || (webapp = {}));
webapp.init();
