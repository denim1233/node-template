var mongoose = require("mongoose");

var schema = new mongoose.Schema({
  type_name: {
    type: String,
    required: true,
    unique: true,
  },
});

var userType = new mongoose.model("userType", schema, "userType");

module.exports = userType;
