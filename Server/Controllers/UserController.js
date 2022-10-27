const User = require("../Models/Users");

exports.CreateUser = async (req, res, next) => {
  try {
    const { name, phone, role } = req.body;

    const user = await User.create({
      name,
      phone,
      role,
    });
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
};

exports.AssignRoles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(id, {
      role: role,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
};
