const Stations = require("../Models/Station");
const Trains = require("../Models/Train");

exports.AddStation = async (req, res, next) => {
  try {
    const { StationName, StationNo, IdealDelayTime } = req.body;

    const station = await Stations.create({
      StationName: StationName,
      IdealDelayTime: IdealDelayTime,
      StationNo: StationNo,
    });
    res.status(201).json({
      success: true,
      station,
    });
  } catch (error) {
    res.json({
      error: error,
    });
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
    let prevStationNo;
    let departure;
    // Nechay wali logic ki base yh hy kay train jis jis station sy ho kar ai hy uska data mil jay ga yh ham use karain gay previous Station determine karny kay liay.
    const CheckPrevStation = await Stations.find({
      Train: {
        $elemMatch: { TrainId: req.body.TrainId },
      },
    });

    console.log(CheckPrevStation);

    // Nechay loop kay through ham last possible station determine karain gy kay jo hmain uper wali query sy data aya hy us main sy last wala station konsa hy

    for (let i = 0; i < CheckPrevStation.length; i++) {
      for (let j = 0; j < CheckPrevStation[i].Train.length; j++) {
        if (
          CheckPrevStation[i].Train[j].TrainId.toString() === req.body.TrainId
        ) {
          prevStationNo = CheckPrevStation[i].StationNo;
          departure = CheckPrevStation[i].Train[j].DepartureTime;
        }
      }
    }
    console.log(prevStationNo);
    console.log(departure);

    const CurStation = await Stations.findById(req.params.id);

    const ReachedTrain = await Trains.findById(req.body.TrainId);

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

    const curStationNo = CurStation.StationNo;

    const AT = parseInt(departure) + (curStationNo - prevStationNo);
    const DT = AT + parseInt(CurStation.IdealDelayTime);
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
              ArrivalTime: AT.toString(),
              DepartureTime: DT.toString(),
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

// Train delay:

//train ka startTime or Route ka idealTime chahiay hoga or Station par jo arrivalTime hoga wo bhi chahiay hoga.
// ham nay train waly Schema main aik Delay bhi lia hy jis ko ham Update karain gay agr hamari req fullfil na hui matlab agr delay lagta hua tou ham us par delay lagain gay

// ham har statiin kay liay aik value set karain gay jis kay according ham idealTime(from one to other station) check krain gay

// jis station sy wo a rha hy uski id hmain mil gai tou ham check krain gay aik us ka departure time or jis station par pohnchi hy uska arrival time ideal time jo us station ka hy uskay equal ni aya tou matlab delay hy.

// 1) Kisi bhi Station par
// Requirements:
// CurrentStation , Station par us train ka arrivalTime , Station par us train ka departureTime , station par ideal delay time

// 2) Aik Station sy Dosray Station kay beech main
// Requirements:
// TrainId , TrainCurrentStation , StationIdealDelay (jo kay ham currentstation sy hi get kr skty hain) , TrainPreviousStation , idealTime (station to station) (jis sy ai hy or jahan par ai hy unkay no's sy ), DepartureTime (jahan sy ai hy uska) , ArrivalTime (jahan par ai hy)
