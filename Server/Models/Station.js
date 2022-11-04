const mongoose = require("mongoose");
const Trains = require("../Models/Train");

const Station = mongoose.Schema({
  StationName: {
    type: String,
    required: true,
  },
  IdealDelayTime: {
    type: String,
    required: true,
  },
  Train: [
    {
      TrainId: {
        type: "ObjectId",
        ref: "Trains",
      },
      ArrivalTime: {
        type: String,
      },
      DepartureTime: {
        type: String,
      },
      date: {
        type: String,
      },
    },
  ],
  StationDistances: [
    {
      StationId: {
        type: "ObjectId",
        ref: "Stations",
      },
      Path: {
        type: String,
      },
      Distance: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Stations", Station);
