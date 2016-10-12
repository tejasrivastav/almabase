var socket = null;

function setSocket(_socket){
  if (socket === null) {
   socket = _socket;
  }
}

function getSocket(){
  return socket;
}

module.exports = {
  setSocket: setSocket,
  getSocket: getSocket
}