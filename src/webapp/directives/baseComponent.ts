module webapp.directives {
    export class BaseComponent{
        constructor(){
            return {
                templateUrl: "/public/partials/baseComponent.html",
                controller: ["$scope","RemainderService",function($scope,RemainderService){
                    $scope.info = {
                        source: "12.927880, 77.627600",
                        destination: "13.035542, 77.597100",
                        time: new Date(),
                        email: "tejasrivastav@gmail.com"
                    };
                    $scope.setRemainder = function(){
                        RemainderService.post($scope.info);
                    }
                }]
            }
        }
    }
}