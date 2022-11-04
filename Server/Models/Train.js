const mongoose = require("mongoose");

const Train = mongoose.Schema({
  TrainName: {
    type: String,
    required: true,
  },
  AvgSpeed: {
    type: String,
  },
  date: {
    type: Date,
    // default: Date.now(),
  },
  Route: {
    startStation: String,
    endStation: String,
  },
  Time: {
    startTime: String,
    IdealEndTime: String,
  },
  Security: {
    GuardName: String,
  },
});

module.exports = mongoose.model("Trains", Train);
