const express = require("express");
const router = express.Router();
const controller = require("../Controllers/UserController");
const { authPage } = require("../Middlewares/Auth");

router.post("/createUser", controller.CreateUser);
router.post("/AssignRole/:id", authPage(["Admin"]), controller.AssignRoles);

module.exports = router;
