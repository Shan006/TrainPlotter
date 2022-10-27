const express = require("express");
const router = express.Router();
const controller = require("../Controllers/DelayController");

router.post("/Delay", controller.AddDelay);

module.exports = router;
