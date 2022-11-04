const express = require("express");
const router = express.Router();
const controller = require("../Controllers/StationControllers");

router.post("/StationAdd", controller.AddStation);
router.get("/allStations", controller.getAllStations);
router.put("/TrainAtAStation/:id", controller.TrainReachSpecificStation);
router.delete("/RemoveTrain/:id", controller.RemoveTrainIdFromASpecificStation);

router.get("/AddDistances/:id", controller.AddDistances);

module.exports = router;
