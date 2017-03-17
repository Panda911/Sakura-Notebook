var express = require("express");
var bodyParser = require("body-parser");
var handlebars = require("express-handlebars").create({defaultLayout:"main"});
var mongoose = require("mongoose");
var path = require("path");
var fs = require("fs");
var app = express();

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + "/pages"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
mongoose.Promise = require("bluebird");

var secretVars = require(path.join(__dirname + "/secretVars.js"));
var utils = require(path.join(__dirname + "/utils.js"));
var leavesModel = require(path.join(__dirname + "/models/leaves.js"));

function getTable(query, cb) {
	leavesModel.Leaf.find(query, function(err, data) {
		if (err) return console.error(err);
		var response = "";
		var sortedData = utils.sortData(data, "timeCreated");
		index = 0;
		sortedData.forEach(function(element) {
			response += "<tr onclick=\"selectLeaf('"+element.id+"')\" data-toggle=\"modal\" data-target=\"#editDialog\"><td>"+new Date(element.timeCreated).toUTCString()+"</td><td>"+element.content+"</td></tr>\n";
			index++;
		});
		return cb(response);
	});
}
app.get("/", function(req, res) {
	getTable({}, (contents) => res.render("leavesView", {table: contents}));
});

app.post("/", function(req, res) {
	if (req.body.query) { return getTable({content: new RegExp(utils.escape(req.body.query), "i")}, (contents) => res.render("leavesView", {table: contents})); }
	getTable({}, (contents) => res.render("leavesView", {table: contents}));
});

app.get("/getLeaf:leafId", function(req, res) {
	leavesModel.Leaf.find({_id: req.params.leafId.substring(1)}, function(err, data) {
		if (err) return console.error(err);
		res.send(data);
	});
});

app.post("/newLeaf", function(req, res) {
  if (req.body.content) {
    var leaf = new leavesModel.Leaf({timeCreated: new Date().getTime(), content: req.body.content});
    leaf.save(function(err, leaf) {
      if (err) return console.error(err);
    });
  }
	getTable({}, (contents) => res.render("leavesView", {table: contents}));
});

app.post("/updateLeaf", function(req, res) {
  leavesModel.Leaf.update({_id: req.body._id}, {content: req.body.content}, function(err, data) {
		if (err) return console.error(err);
		res.send("OK");
	});
});

app.get("/deleteLeaf:leafId", function(req, res) {
  var id = req.params.leafId.substring(1);
  leavesModel.Leaf.remove({_id: id}, function(err) {
    if (err) {
      console.error(err);
      res.send("Error");
    }
  });
  res.send("OK");
});

var service = app.listen(app.get("port"), function() {
  mongoose.connect(secretVars.mongodb_uri, function(err) {
    if (err) {
      console.error(err);
      process.exit();
    }
    console.log("Express started on http://localhost:" + app.get("port") + ", press Ctrl-C to terminate.");
  });
});

process.on("exit", function() {
  mongoose.disconnect(function() {
    console.log("Disconnected from MongoDB");
  });
}).on("SIGINT", function() {
  mongoose.disconnect(function() {
    process.exit();
  });
});
