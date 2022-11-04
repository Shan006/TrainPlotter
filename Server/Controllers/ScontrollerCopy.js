const Stations = require("../Models/Station");
const Trains = require("../Models/Train");

exports.AddStation = async (req, res, next) => {
  try {
    const { StationName, IdealDelayTime } = req.body;

    const Number = [];
    let FinalRandNumber;
    const randomNumber = Math.floor(Math.random() * 100);
    let randFirstWord = Math.trunc(randomNumber / 10);
    let randLastWord = randomNumber % 10;

    if (randLastWord > 6) {
      randFirstWord++;
      randLastWord -= 6;
      Number[0] = randFirstWord;
      Number[1] = randLastWord;

      FinalRandNumber = Number[0] + ":" + Number[1] + "0";
      console.log(FinalRandNumber.toString());
    } else if (randLastWord === 6) {
      randFirstWord++;
      randLastWord = 0;
      Number[0] = randFirstWord;
      Number[1] = randLastWord;

      FinalRandNumber = Number[0] + ":" + Number[1] + "0";
      console.log(FinalRandNumber.toString());
    }
    Number[0] = randFirstWord;
    Number[1] = randLastWord;

    FinalRandNumber = Number[0] + ":" + Number[1] + "0";
    console.log(FinalRandNumber.toString());

    const station = await Stations.create({
      StationName: StationName,
      IdealDelayTime: IdealDelayTime,
      Rand: FinalRandNumber.toString(),
    });
    res.status(201).json({
      success: true,
      station,
    });
  } catch (error) {
    res.json({
      error: error.stack,
    });
    console.log(error.stack);
  }
};

exports.getAllStations = async (req, res, next) => {
  try {
    const stations = await Stations.find({});
    res.status(201).json({
      success: true,
      stations,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
};

exports.TrainReachSpecificStation = async (req, res, next) => {
  try {
    let getDistanceBwStations;
    let TrainPrevStationDepartureTime;

    const CurStation = await Stations.findById(req.params.id);

    const ReachedTrain = await Trains.findById(req.body.TrainId);

    const CheckPrevStation = await Stations.find({
      Train: {
        $elemMatch: { TrainId: req.body.TrainId },
      },
    });

    console.log(CheckPrevStation);

    for (let i = 0; i < CheckPrevStation.length; i++) {
      for (let j = 0; j < CheckPrevStation[i].Train.length; j++) {
        if (
          CheckPrevStation[i].Train[j].TrainId.toString() === req.body.TrainId
        ) {
          getDistanceBwStations = await Stations.find({
            StationDistances: {
              $elemMatch: { StationId: req.params.id },
            },
          });
          TrainPrevStationDepartureTime =
            CheckPrevStation[i].Train[j].DepartureTime;
        }
      }
    }

    console.log(getDistanceBwStations);

    if (CheckPrevStation.length === 0) {
      if (ReachedTrain.Route.startStation !== CurStation.StationName) {
        return res.json({
          errMessage: `This is'nt Start Station Of ${ReachedTrain._id} This Train`,
        });
      }

      const UpdatedStation = await Stations.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            Train: {
              TrainId: req.body.TrainId,
              ArrivalTime: null,
              DepartureTime: ReachedTrain.Time.startTime,
            },
          },
        },
        { new: true }
      );
      return res.status(201).json({
        success: true,
        UpdatedStation,
      });
    }

    // ReachedTrain.AvgSpeed.
    // getDistanceBwStations.Distance.

    let TempAt;
    const Departure = TrainPrevStationDepartureTime.split(" ");
    const Dptime = Departure[3];

    const temp =
      parseInt(getDistanceBwStations.Distance) /
      parseInt(ReachedTrain.AvgSpeed);

    const total = ReachedTrain.startTime.split(" ");
    const totalValues = total[0] + total[1] + total[2];

    if (
      parseInt(getDistanceBwStations.Distance) < parseInt(ReachedTrain.AvgSpeed)
    ) {
      temp *= 60;
      TempAt = "00" + ":" + temp.toString();

      const DTSplit = Dptime.split(":");
      const ATHours = parseInt("00") + parseInt(DTSplit[0]);
      const ATMinutes = parseInt(temp.toString()) + parseInt(DTSplit[1]);

      if (ATMinutes > 60) {
        ATHours++;
        ATMinutes -= 60;
        AT = totalValues + ATHours.toString() + ":" + ATMinutes.toString();
      }

      AT = totalValues + ATHours.toString() + ":" + ATMinutes.toString();

      const IdealDelay = CurStation.IdealDelayTime.split(":");

      const DTHours = addedHours + parseInt(IdealDelay[0]);
      const DTMins = addedMinutes + parseInt(IdealDelay[1]);

      DT = totalValues + DTHours + ":" + DTMins;
    } else if (
      parseInt(getDistanceBwStations.Distance) /
        parseInt(ReachedTrain.AvgSpeed) !==
      0
    ) {
      const arr = temp.toString().split(".");
      const hours = arr[0];

      temp *= 60;
      const mins = temp - 60;
      TempAt = hours + ":" + mins.toString();

      const DTSplit = Dptime.split(":");
      const ATHours = parseInt(hours) + parseInt(DTSplit[0]);
      const ATMinutes = parseInt(mins.toString()) + parseInt(DTSplit[1]);

      if (ATMinutes > 60) {
        ATHours++;
        ATMinutes -= 60;
        AT = totalValues + ATHours.toString() + ":" + ATMinutes.toString();
      }

      AT = totalValues + ATHours.toString() + ":" + ATMinutes.toString();

      const IdealDelay = CurStation.IdealDelayTime.split(":");

      const DTHours = addedHours + parseInt(IdealDelay[0]);
      const DTMins = addedMinutes + parseInt(IdealDelay[1]);

      DT = totalValues + DTHours + ":" + DTMins;
    }

    if (temp > 10) {
      TempAt = temp.toString() + ":" + "00";

      const DTSplit = Dptime.split(":");
      const ATHours = parseInt(temp.toString()) + parseInt(DTSplit[0]);
      const ATMinutes = parseInt("00") + parseInt(DTSplit[1]);

      if (ATMinutes > 60) {
        ATHours++;
        ATMinutes -= 60;
        AT = totalValues + ATHours.toString() + ":" + ATMinutes.toString();
      }

      AT = totalValues + ATHours.toString() + ":" + ATMinutes.toString();

      const IdealDelay = CurStation.IdealDelayTime.split(":");

      const DTHours = addedHours + parseInt(IdealDelay[0]);
      const DTMins = addedMinutes + parseInt(IdealDelay[1]);

      DT = totalValues + DTHours + ":" + DTMins;
    }

    TempAt = "0" + temp + ":" + "00";
    const DTSplit = Dptime.split(":");
    const ATHours = parseInt("0" + temp) + parseInt(DTSplit[0]);
    const ATMinutes = parseInt("00") + parseInt(DTSplit[1]);

    AT = totalValues + ATMinutes.toString() + ":" + ATHours.toString();

    const IdealDelay = CurStation.IdealDelayTime.split(":");

    const DTHours = addedHours + parseInt(IdealDelay[0]);
    const DTMins = addedMinutes + parseInt(IdealDelay[1]);

    DT = totalValues + DTHours.toString() + ":" + DTMins.toString();

    if (CurStation.StationName === ReachedTrain.Route.endStation) {
      const UpdatedStation = await Stations.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            Train: {
              TrainId: req.body.TrainId,
              ArrivalTime: AT,
              DepartureTime: null,
            },
          },
        },
        { new: true }
      );
      return res.status(201).json({
        success: true,
        UpdatedStation,
      });
    } else {
      const UpdatedStation = await Stations.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            Train: {
              TrainId: req.body.TrainId,
              ArrivalTime: AT,
              DepartureTime: DT,
            },
          },
        },
        { new: true }
      );

      return res.status(201).json({
        success: true,
        UpdatedStation,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.RemoveTrainIdFromASpecificStation = async (req, res, next) => {
  try {
    const deleteTrain = await Stations.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          Train: { TrainId: req.body.TrainId },
        },
      },
      { new: true }
    );
    res.status(201).json({
      success: true,
      deleteTrain,
    });
  } catch (error) {
    res.json({
      err: error,
    });
  }
};

exports.CheckTrainDelayOnASpecificStation = async (req, res, next) => {
  try {
    const { TrainName, StationName, PreviousStation } = req.body;

    const curStation = await Stations.findOne({ StationName });
    const prevStation = await Stations.findOne({ PreviousStation });

    const Train = await Trains.findOne({ TrainName });

    // curStation.IdealComingTime = curStation.StationNo - prevStation.StationNo;

    Train.Time.ArrivalTimeAtAStation =
      curStation.StationNo - prevStation.StationNo;
    Train.Time.DepartureTimeFromAStation =
      Train.Time.ArrivalTimeAtAStation + curStation.IdealDelayTime;
  } catch (error) {}
};

exports.AddDistances = async (req, res, next) => {
  try {
    const curStation = await Stations.findById(req.params.id);

    const FromWhereDistanceIsRequired = await Stations.findById(
      req.body.StationId
    );

    const UpdatedStation = await Stations.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          StationDistances: {
            StationId: req.body.StationId,
            Path: `From ${curStation.StationName} to ${FromWhereDistanceIsRequired.StationName}`,
            Distance: req.body.Distance,
          },
        },
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      UpdatedStation,
    });
  } catch (error) {
    res.json({
      message: error.stack,
    });
  }
};

// req.params.id main ham current station ki id dain gay or req.body.StationId main ham jis stations sy Distance lay rhay hain uski id dain gay
