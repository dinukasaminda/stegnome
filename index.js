var express = require("express");
var path = require("path");
var app = express();
var base64 = require("base-64");

var bodyParser = require("body-parser");
var imagecode = require("./imgcode");
var shortid = require("shortid");
var randomstring = require("randomstring");

app.set("port", process.env.PORT || 5000);

app.use(express.static(__dirname + "/public"));

// views is directory for all template files
//app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.json({ limit: "10mb" }));
//const INDEX = path.join(__dirname, 'public/index.html');

app.get("/", function(req, res) {
    res.render("index");
});

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};

    if (matches.length !== 3) {
        return new Error("Invalid input string");
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], "base64");

    return response;
}
app.post("/encode", function(req, res) {
    var data1 = req.body.data.data_base64;
    var img1 = req.body.data.imgbase64;

    var imgbufferData = decodeBase64Image(img1);
    var imageTypeRegularExpression = /\/(.*?)$/;
    var imageTypeDetected = imgbufferData.type.match(imageTypeRegularExpression);
    var imgpath = create_u_id() + "." + imageTypeDetected[1];

    try {
        imagecode.encode(data1, imgbufferData, function(dataimg, err) {
            if (err == undefined || err == null) {
                res.json({ msgcode: 2000, imgbase64: dataimg, imgpath: imgpath });
            } else {
                res.json({ msgcode: 9090 });
            }
        });

        /* require("fs").writeFile(imgpath, imgbufferData.data, function(err) {
if (err == null) {

} else {
console.log(err);

}
});*/
    } catch (error) {
        res.json({ msgcode: 9090 });
        console.log(error);
    }
});

app.post("/decode", function(req, res) {
    var img1 = req.body.data.imgbase64;

    var imgbufferData = decodeBase64Image(img1);
    var imageTypeRegularExpression = /\/(.*?)$/;
    var imageTypeDetected = imgbufferData.type.match(imageTypeRegularExpression);

    try {
        imagecode.decode(imgbufferData, function(data, err) {
            if (err == undefined || err == null) {
                res.json({
                    msgcode: 2000,
                    base64data: data.b64,
                    textData: data.data
                });
            } else {
                res.json({ msgcode: 9090 });
            }
        });

        /* require("fs").writeFile(imgpath, imgbufferData.data, function(err) {
if (err == null) {

} else {
console.log(err);

}
});*/
    } catch (error) {
        res.json({ msgcode: 9090 });
        console.log(error);
    }
});

/*
var users = [];
function pushUsers(){
   var uid= create_user_id();
   var date1 = new Date().getTime();
    users.push({uid:uid,date:date1});

}
console.log(new Date().getTime());


*/
function create_u_id() {
    var id = shortid.generate() + "_" + randomstring.generate();
    return id;
}
app.listen(app.get("port"), function() {
    console.log("Node app is running on port", app.get("port"));
});