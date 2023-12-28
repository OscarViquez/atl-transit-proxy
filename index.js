require('dotenv').config();
const express = require("express");
const requestURL = require("./services/service.js");
const cors = require('cors');
const app = express();
const connectDB = require('./database/database');
const Stations = require('./database/models/station');
const Amenities = require('./database/models/amenities');
const StationSchedule = require('./database/models/stationschedule');


// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

// this should do the same thing as the code above. 
app.use(cors()); 



app.get("/arrivals", (req, res) => {
  /* Console Log Test */
  console.log("Just got pinged!!!");

  /* Creates Request  */
  requestURL("https://www.itsmarta.com/arrivals.aspx", res);
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
})
// mongo DB api

app.get('/api/get/all/stations', (req, res) => {
  Stations.find({})
    .then((result) => {
      res.send(result);
    })
      .catch((err) => {
        console.log(err)
      });
});

app.get('/api/get/all/amenities', (req, res) => {
  Amenities.find({})
    .then((result) => {
      res.send(result);
    })
      .catch((err) => {
        console.log(err);
      });
})


app.get('/api/get/all/stationschedules', (req, res) => {
  StationSchedule.find({})
    .then((result) => {
      res.send(result);
    })
     .catch((error) => {
      console.log(error);
     })
});