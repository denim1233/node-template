var mongoose = require("mongoose");
const { Schema } = mongoose;

var schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  phone: String,
  status: { type: Schema.Types.ObjectId, ref: "status" },
  userType: { type: Schema.Types.ObjectId, ref: "userType" },
});

var user = new mongoose.model("user", schema, "user");

module.exports = user;
