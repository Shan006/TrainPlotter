const {
  userRegister,
  userLogin,
} = require('../utils/Authentication')


exports.RegisterSuperAdmin = async ( req, res ) =>{
  await userRegister(req.body, "Super Admin" ,res)
}

exports.RegisterOperator = async ( req, res ) =>{
  await userRegister(req.body, "Operator" ,res)
}

exports.LoginSuperAdmin = async ( req, res ) =>{
  await userLogin(req.body, "Super Admin" ,res)
}
