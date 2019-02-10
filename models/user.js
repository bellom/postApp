var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");



var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

//to add packages/plugin/method/features that came with the npm install
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema)
