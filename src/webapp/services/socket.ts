module webapp.services {
  export class Socket {
    static $inject = ['socketFactory'];

    constructor(
      private socketFactory
    ){
      var mySocket = window["io"].connect("/log");

      return socketFactory({ioSocket: mySocket});
    }
  }
}