var mongoose = require("mongoose");

var schema = new mongoose.Schema({
  status_name: {
    type: String,
    required: true,
    unique: true,
  },
});

var status = new mongoose.model("status", schema, "status");

module.exports = status;
