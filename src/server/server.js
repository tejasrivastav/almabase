var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var socket = require("./socket.js");
var db = require("./db.js")
var job = require("./job.js");

function init(){
  var app = express();
  var server = app.listen(5698);
  console.log("App started at:",5698);
  var io = require('socket.io')(server);

  var logIo = io.of("/log");
  logIo.on('connection', function(_socket){
    console.log('a user connected');
    socket.setSocket(_socket);
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/public",express.static('public'));

  app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/../../index.html'));
  });

  app.post('/remainder',function(req, res){
      var data = {
          source: req.body.source,
          destination: req.body.destination,
          arrival_time: req.body.time,
          email: req.body.email
      }
      var Remainder = db;
      var currentRemainder = new Remainder(data);
      currentRemainder.save(function(err) {
        if (err) throw err;

        console.log('Remainder saved successfully!',currentRemainder._id);
        job.performJob(data,currentRemainder._id)
      });
      res.end(JSON.stringify({"msg": "scheduler started"}));
  });
}

module.exports = {
  init: init
}