const mongoose = require("mongoose");

const Train = mongoose.Schema({
  TrainName: {
    type: String,
    required: true,
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
