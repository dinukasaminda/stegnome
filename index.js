var express = require("express");
var path = require("path");
var app = express();

var shortid = require("shortid");
var randomstring = require("randomstring");

app.set("port", process.env.PORT || 5000);
app.use(express.static(__dirname + "/public"));

// views is directory for all template files
//app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//const INDEX = path.join(__dirname, 'public/index.html');

app.get("/", function(req, res) {
    //console.log(req.connection.remoteAddress);
    //var data = pushUsers();

    res.render("index", { data: { val1: req.connection.remoteAddress } });
});

var users = [];

console.log(new Date().getTime());

function create_user_id() {
    var id = shortid.generate() + "_" + randomstring.generate();
    console.log(id);

    return id;
}

app.listen(app.get("port"), function() {
    console.log("Node app is running on port", app.get("port"));
});