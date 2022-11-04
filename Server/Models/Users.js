const mongoose = require("mongoose");

const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type : String,
    requried: true
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default : "Driver",
    enum: ['Admin', 'Super Admin', 'Operator', 'Driver' ]
  },
  password: {
    type: String,
    required : true
  }

});

module.exports = mongoose.model("Users", User);
