const Lines = require("../Models/Lines");

exports.AddDelay = async (req, res, next) => {
  try {
    const {
      TrainCurrentLoc,
      TrainId,
      Station,
      DelayTimeStart,
      DelayTimeEnd,
      DelayCode,
      ReasonForDelay,
    } = req.body;

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
};
