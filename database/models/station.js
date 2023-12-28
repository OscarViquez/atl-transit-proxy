const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationSchema = new Schema({
    _station_key:  {
        type: String, 
        required: true
    },
    name:  {
        type: String, 
        required: true
    },
    longitude:  {
        type: String, 
        required: true
    },
    latitude:  {
        type: String, 
        required: true
    },
    amenities:  {
        type: Array, 
        required: true
    },
    _schedule_key:  {
        type: Number, 
        required: true
    },
    contactnumber:  {
        type: String, 
        required: true
    },
    description:  {
        type: String, 
        required: true
    },
    busroutes:  {
        type: Array, 
        required: true
    }

});


const Station = mongoose.model('Stations', stationSchema);

module.exports = Station;
