const express = require("express");
const router = express.Router();
const controller = require("../Controllers/UserController");

router.post('/register/superadmin', controller.RegisterSuperAdmin)

router.post('/register/operator', controller.RegisterOperator)

router.post('/login/superadmin', controller.LoginSuperAdmin)

module.exports = router;
