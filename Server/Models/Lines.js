const mongoose = require("mongoose");

const TrainLines = mongoose.Schema({
  Station: {
    startStation: String,
    endStation: String,
  },
  Time: {
    idealTime: String,
    startTime: String,
    endTime: String,
    arrivalTime: String,
    delayTime: {
      stationDelay: String,
      BlockDelay: String,
      normalDelay: {
        type: String,
        default: "30min",
      },
    },
  },
});

TrainLines.methods.BlockDelay = function () {
  this.Time.delayTime.BlockDelay = this.Time.arrivalTime - this.Time.idealTime;
};

module.exports = mongoose.model("Line", TrainLines);
