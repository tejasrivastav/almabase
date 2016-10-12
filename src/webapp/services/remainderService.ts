/// <reference path="../typings/main.d.ts" />

module webapp.services {
  export class RemainderService {
    static $inject = [
      "$http"
    ]

    constructor(
      private $http: ng.IHttpService
    ){}

    public post(input){
      return this.$http.post("/remainder",input)
      .then(function(res){
        return res.data;
      })
    }
  }
}