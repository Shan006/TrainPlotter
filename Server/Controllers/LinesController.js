const Lines = require("../Models/Lines");

exports.AddLines = async (req, res, next) => {
  try {
    const { startStation, endStation, startTime } = req.body;

    const Line = await Lines.create({
      Station: {
        startStation: startStation,
        endStation: endStation,
      },
      Time: {
        startTime: startTime,
      },
    });
    res.status(201).json({
      success: true,
      Line,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
};
