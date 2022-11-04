const Trains = require("../Models/Train");

exports.AddTrain = async (req, res, next) => {
  try {
    const {
      TrainName,
      AvgSpeed,
      startStation,
      endStation,
      GuardName,
      startTime,
    } = req.body;

    // const end = endStation.substr(7, 8);
    // const finalTime = parseInt(startTime) + parseInt(end) - 1;

    // const date = new Date(startTime);
    // const hoursAndMinutes = date.getHours() + ":" + date.getMinutes();
    // console.log(hoursAndMinutes); // 👉️ 2:20

    const train = await Trains.create({
      TrainName: TrainName,
      AvgSpeed: AvgSpeed,
      Route: {
        startStation: startStation,
        endStation: endStation,
      },
      Time: {
        startTime: startTime,
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
      error: error.stack,
    });
  }
};
