const Trains = require("../Models/Train");

exports.AddTrain = async (req, res, next) => {
  try {
    const { TrainName, startStation, endStation, GuardName, startTime } =
      req.body;

    const end = endStation.substr(7, 8);
    const finalTime = parseInt(startTime) + parseInt(end) - 1;

    const train = await Trains.create({
      TrainName: TrainName,
      Route: {
        startStation: startStation,
        endStation: endStation,
      },
      Time: {
        startTime: startTime,
        endTime: finalTime.toString(),
      },
      Security: {
        GuardName: GuardName,
      },
    });
    res.status(201).json({
      success: true,
      train,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
};
