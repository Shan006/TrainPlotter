const express = require('express')
const router = express.Router();
const {checkRole, userAuth} = require('../utils/Authentication') 
const controller = require('../Controllers/ProtecRouteController')


router.get('/profile/superadmin',  userAuth ,  checkRole(['Super Admin']) ,controller.accessSuperAdminRoute)



module.exports = router;