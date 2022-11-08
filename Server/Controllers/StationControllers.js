const Stations = require("../Models/Station");
const Trains = require("../Models/Train");

exports.AddStation = async (req, res, next) => {
  try {
    const { StationName, IdealDelayTime } = req.body;

    const station = await Stations.create({
      StationName: StationName,
      IdealDelayTime: IdealDelayTime,
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
    let usedPath;
    let AT;
    let DT;
    let Udate = new Date();

    const CurStation = await Stations.findById(req.params.id);
    const ReachedTrain = await Trains.findById(req.body.TrainId);

    const CheckPrevStation = await Stations.find({
      Train: {
        $elemMatch: { TrainId: req.body.TrainId },
      },
    });

    console.log(CheckPrevStation);

    // Loop to get Latest Previous Station of Train

    for (let i = 0; i < CheckPrevStation.length; i++) {
      for (let j = 0; j < CheckPrevStation[i].Train.length; j++) {
        if (
          CheckPrevStation[i].Train[j].TrainId.toString() === req.body.TrainId
        ) {
          usedPath = `From ${CheckPrevStation[i].StationName} to ${CurStation.StationName}`;
          getDistanceBwStations = await Stations.find({
            StationDistances: {
              $elemMatch: {
                Path: `From ${CheckPrevStation[i].StationName} to ${CurStation.StationName}`,
              },
            },
          });
          TrainPrevStationDepartureTime =
            CheckPrevStation[i].Train[j].DepartureTime;
        }
      }
    }

    console.log(getDistanceBwStations);

    const UpdatedStation = await Stations.findById(req.params.id);

    // Function To Push Arrival and Departure Time According to Condition:

    const PushInTrainrArray = async (At, Dt) => {
      const Update = await UpdatedStation.updateOne({
        $push: {
          Train: {
            TrainId: req.body.TrainId,
            ArrivalTime: At,
            DepartureTime: Dt,
            date: Udate,
          },
        },
        new: true,
      });
    };

    // If There is no Prev Station of Train, means that train is starting its journey from this very station.

    if (CheckPrevStation.length === 0) {
      if (ReachedTrain.Route.startStation !== CurStation.StationName) {
        return res.json({
          errMessage: `This is'nt Start Station Of ${ReachedTrain._id} This Train`,
        });
      }

      const Updated = PushInTrainrArray(null, ReachedTrain.Time.startTime);

      return res.status(201).json({
        success: true,
        Updated,
      });
    }

    // Function To get Arrival And Departure Time Of Train.

    const CalculateATAndBT = (hours, mins) => {
      let updatedAT;
      let updatedDT;
      let ATHours;
      let ATMinutes;
      let DTHours;
      let DTMins;
      const Departure = TrainPrevStationDepartureTime.split(" "); //prev Departure like
      // 0) 03:30 1) AM
      const Dptime = Departure[0]; // 03:30
      // Departure[1] // AM

      const DTSplit = Dptime.split(":");
      // 0) 03 1) 30
      ATHours = parseInt(hours) + parseInt(DTSplit[0]);
      ATMinutes = parseInt(mins) + parseInt(DTSplit[1]);

      if (ATHours === 12) {
        ATHours = 1;
        Departure[1] === "AM" ? "PM" : "AM";
        if (Departure[1] === "AM") {
          const d = new Date();
          Udate = d.setDate(Udate + 1);
        }
      }

      if (ATMinutes >= 60) {
        ATHours++;
        ATMinutes -= 60;
      }

      if (ATMinutes < 10) {
        updatedAT =
          ATHours.toString() +
          ":" +
          "0" +
          ATMinutes.toString() +
          " " +
          Departure[1];
      } else {
        updatedAT =
          ATHours.toString() + ":" + ATMinutes.toString() + " " + Departure[1];
      }
      const IdealDelay = CurStation.IdealDelayTime.split(":");

      DTHours = parseInt(ATHours) + parseInt(IdealDelay[0]);
      DTMins = parseInt(ATMinutes) + parseInt(IdealDelay[1]);

      if (DTHours === 12) {
        DTHours = 1;
        Departure[1] === "AM" ? "PM" : "AM";
        if (Departure[1] === "AM") {
          const d = new Date();
          Udate = d.setDate(Udate + 1);
        }
      }

      if (DTMins >= 60) {
        DTHours++;
        DTMins -= 60;
      }

      updatedDT =
        DTHours.toString() + ":" + DTMins.toString() + " " + Departure[1];

      return updatedAT + "*" + updatedDT;
    };

    let DistanceForFormula;

    for (let i = 0; i < getDistanceBwStations[0].StationDistances.length; i++) {
      if (getDistanceBwStations[0].StationDistances[i].Path === usedPath) {
        DistanceForFormula =
          getDistanceBwStations[0].StationDistances[i].Distance;
      }
    }

    let temp = parseInt(DistanceForFormula) / parseInt(ReachedTrain.AvgSpeed);
    temp = temp.toFixed(2);

    console.log(DistanceForFormula);
    console.log(ReachedTrain.AvgSpeed);
    if (parseInt(DistanceForFormula) < parseInt(ReachedTrain.AvgSpeed)) {
      temp *= 60;
      console.log(temp);

      // TempAt = "00" + ":" + temp.toString();
      let ATandDT = CalculateATAndBT("00", temp.toString());
      const Separate = ATandDT.split("*");
      console.log(ATandDT);
      AT = Separate[0];
      DT = Separate[1];
      console.log(AT);
      console.log(DT);
    } else if (
      parseInt(getDistanceBwStations.Distance) /
        parseInt(ReachedTrain.AvgSpeed) !==
      0
    ) {
      const arr = temp.toString().split(".");
      const hours = arr[0];

      console.log(arr[1]);

      temp = parseFloat("." + arr[1]) * 60;
      console.log(temp);
      console.log(parseInt(temp));

      if (temp < 0) {
        temp = -temp;
      }

      // TempAt = hours + ":" + mins.toString();
      const ATANDBT = CalculateATAndBT(hours, temp.toString());
      const Separate = ATANDBT.split("*");
      AT = Separate[0];
      DT = Separate[1];
      console.log(AT);
      console.log(DT);
    } else {
      // TempAt = "0" + temp + ":" + "00";
      const ATANDBT = CalculateATAndBT(temp.toString(), "00");
      const Separate = ATANDBT.split("*");
      AT = Separate[0];
      DT = Separate[1];
      console.log(AT);
      console.log(DT);
    }

    // If This is the last Station of Train, means that train is suppossed to stop at this station.

    if (CurStation.StationName === ReachedTrain.Route.endStation) {
      const Updated = PushInTrainrArray(AT, null);

      return res.status(201).json({
        success: true,
        Updated,
      });
    }

    // It is neither Start Station of Train Nor Last Station of Train, means any station in mid of the trains route.
    else {
      const Updated = PushInTrainrArray(AT, DT);

      return res.status(201).json({
        success: true,
        Updated,
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
