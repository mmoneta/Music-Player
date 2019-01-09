var mongoose = require('mongoose'),
Models = require("./Models")(mongoose),
Operations = require("./Operations");

mongoose.connect('mongodb://localhost/MusicPlayer', { useNewUrlParser: true });

(function() {
  var db = mongoose.connection;

  db.on("error", function () {
    console.log("Error - MongoDB")
  });

  db.once("open", function () {
    console.log("Mongo - connected");
  });

  db.once("close", function () {
    console.log("Mongo - closed connection");
  });
})();

module.exports = {
  Models: Models,
  Operations: Operations
}