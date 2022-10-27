const express = require("express");
const router = express.Router();
const controller = require("../Controllers/LinesController");

router.post("/Line", controller.AddLines);

module.exports = router;
