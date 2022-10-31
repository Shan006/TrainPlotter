const express = require("express");
const router = express.Router();
const controller = require("../Controllers/TrainController");
// const { authPage } = require("../Middlewares/Auth");

router.post("/addTrain", controller.AddTrain);

module.exports = router;
