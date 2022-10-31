const mongoose = require("mongoose");
const Trains = require("../Models/Train");

const Station = mongoose.Schema({
  StationName: {
    type: String,
    required: true,
  },
  StationNo: {
    type: Number,
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
    },
  ],
});
// if(TrainDepartureTime - TrainArrivalTime = IdealDelayTime)

module.exports = mongoose.model("Stations", Station);
