module webapp.directives {
    export class ApiLog{
        constructor(){
            return {
                templateUrl: "/public/partials/apiLog.html",
                controller: ["$scope","Socket",function($scope,Socket){
                    
                    $scope.messages = [];
                    Socket.on("message",function(data){
                        var newMessage = {
                            time: new Date(data.time).toLocaleString(),
                            text: data.text
                        }
                      $scope.messages.push(newMessage)
                    })
                }]
            }
        }
    }
}