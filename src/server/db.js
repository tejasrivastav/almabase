var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/almabase');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Remainder_Schema = new Schema({
    remainderId  : ObjectId,
    source       : String,
    destination  : String,
    arrival_time : String,
    no_Of_Queryies : Number,
    previous_Query: {
        timeOfQuery: Date,
        duration: Number
    },
    next_Schedule_Time: Number,
    email: String
});

var Remainder = mongoose.model('Remainder', Remainder_Schema);

module.exports = Remainder