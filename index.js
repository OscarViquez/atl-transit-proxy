// Environment Configuration Import
require("dotenv").config();

// Third-Party Library Imports
const express = require("express");
const cors = require("cors");

// Local Module Imports
const app = express();
const connectDB = require("./database/database");
const Stations = require("./database/models/station");
const Amenities = require("./database/models/amenities");
const StationSchedule = require("./database/models/stationschedule");
const requestURL = require("./services/service.js");
const { getCardDetails } = require("./services/transit-card-balance.js");

// this should do the same thing as the code above.
app.use(cors());
app.use(express.json());

app.get("/arrivals", (req, res) => {
  /* Console Log Test */
  console.log("Just got pinged Train Arrivals!!!");

  /* Creates Request  */
  requestURL("https://www.itsmarta.com/arrivals.aspx", res);
});

// mongo DB api

app.get("/api/get/all/stations", (req, res) => {
  Stations.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/get/all/amenities", (req, res) => {
  Amenities.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/api/get/all/stationschedules", (req, res) => {
  StationSchedule.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/api/get/balance", (req, res) => {
  console.log("Just got balanced!!!");
  const { cardNumber } = req.body;
  getCardDetails(cardNumber)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while fetching the balance.");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));

// FIXME: Connect to the database and start the server
// connectDB().then(() => {
//   app.listen(PORT, () => console.log(`listening on ${PORT}`));
// });
