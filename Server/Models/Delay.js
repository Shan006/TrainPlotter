const mongoose = require("mongoose");

const TrainDelay = mongoose.Schema({
  TrainCurrentLoc: String,
  TrainId: String,
  Station: String,
  DelayTimeStart: String,
  DelayTimeEnd: String,
  DelayCode: String,
  ReasonForDelay: String,
  isValid: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Delay", TrainDelay);
