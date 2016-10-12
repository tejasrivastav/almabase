var moment = require("moment");
var googleMaps = require('@google/maps');
var Uber = require('node-uber');
var googleMock = require("./googleMock.js");
var uberMock = require("./uberMock.js");
var socket = require("./socket.js");
var Remainder = require("./db.js");

function calculateTimeTaken(googleData,uberData){
  var travelTime = googleData.duration.value;
  var timeForCab = uberData.estimate;
  return travelTime+timeForCab;
}

function liesInRange(timeTakenInSecs,arrivalTime){
  var currentTime = new Date();
  var arrival_time = new Date(arrivalTime);
  var arrivalTimeInSeconds = arrival_time.getTime()/1000;
  var departureTimeInSeconds = arrivalTimeInSeconds-timeTakenInSecs;
  var departure_time = new Date(departureTimeInSeconds*1000);
  var departure_time_rigthBuffer = new Date((departureTimeInSeconds-90)*1000);
  var departure_time_leftBuffer = new Date((departureTimeInSeconds+90)*1000);
  return moment(currentTime).isBetween(departure_time_rigthBuffer,departure_time_leftBuffer);
}

function sendEmail(emailId){
  // send email
}

function scheduleAnotherJobAt(timeout,data,currentId){
  setTimeout(function() {
    performJob(data,currentId);
  }, timeout);
}

function performJob(requestData,currentId){
  var googleMapsClient = googleMaps.createClient({
    key: 'AIzaSyB6ky0s6kmaxH15hsxsNHKuZeI6n_OG2eA'
  });
  emitSocketLog({apiType:"Google",email:requestData.email})
  googleMapsClient.distanceMatrix({
      units:"imperial",
      origins: [requestData.source],
      destinations: [requestData.destination]
  },function(res,data){
    console.log("---------------------------")
      var googleData =  data.json.rows[0].elements[0];
      var uber = new Uber({
        server_token: 'ECWcv5urK26d-pz-OHio9c9ovHpahx4UBbQIzMTi',
        name: 'SomeName'
      });
      var lat = requestData.source.split(",")[0];
      var long = requestData.source.split(",")[1];
      emitSocketLog({apiType:"Uber",email:requestData.email});
      uber.estimates.getETAForLocation(lat, long,function(err,res){
        console.log("---------------------------")
        var uberData = res.times.filter(function(product){ return product.display_name === "uberGO"})[0];
        var timeTakenInSecs = calculateTimeTaken(googleData,uberData);
        if (liesInRange(timeTakenInSecs,requestData.arrival_time)) {
          sendEmail(requestData.email);
        } else {
          Remainder.findById(currentId,function(err,currentRemainder){
            var currentRemainder = currentRemainder;
            var previousDuration = currentRemainder.previous_Query.duration 
            var nextScheduleTime = null;
            var arrival_time = new Date(currentRemainder.arrival_time);
            var arrivalTimeInSeconds = arrival_time.getTime()/1000;
            if(previousDuration){
              console.log("previousDuration",previousDuration);
              var ratio = timeTakenInSecs/previousDuration;
              var departureTimeInSeconds = arrivalTimeInSeconds-timeTakenInSecs;
              var currenTimeInSeconds = (new Date())/1000;
              if((departureTimeInSeconds-currenTimeInSeconds)/2>arrivalTimeInSeconds-departureTimeInSeconds){
                nextScheduleTime = currenTimeInSeconds+((departureTimeInSeconds-currenTimeInSeconds)/2)*1000;
              } else {
                nextScheduleTime = 60*1000;
              }
            } else {
              //first time query schedule to buffer time
              var nextScheduleTimeInSeconds = arrivalTimeInSeconds-3600;
              var nextScheduleDate = new Date(nextScheduleTimeInSeconds*1000);
              nextScheduleTime = nextScheduleDate.getTime() - (new Date()).getTime();
            }
            var previous_Query = {
              timeOfQuery: new Date(),
              duration: timeTakenInSecs
            }
            currentRemainder.previous_Query = previous_Query;
            currentRemainder.save(function(err){
              if(err) throw err;
              console.log('Remainder updated successfully!',currentRemainder._id);
            })
            scheduleAnotherJobAt(nextScheduleTime,requestData,currentId);
          });
        }  
      });
  }); 
}

function emitSocketLog(data){
  socket.getSocket().emit('message', { time: new Date(), text: data.apiType+" Api Request for ["+data.email+"]"});
}

function requestUberApi(data){
  
}

module.exports = {
  performJob: performJob
}