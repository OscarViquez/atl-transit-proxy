const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationScheduleSchema = new Schema({
    _station_key: {
        type: String, 
        required: true
    },
    lines: {
        type: Array,
        required: true
    }
});


const StationSchedule = mongoose.model('stationschedule', stationScheduleSchema);

module.exports = StationSchedule;
