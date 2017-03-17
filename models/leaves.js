var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usersSchema = new Schema({
  timeCreated: Number,
  content: String
});

exports.Leaf = mongoose.model("leaves", usersSchema);
