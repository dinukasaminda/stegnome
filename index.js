var express = require("express");
var path = require("path");
var app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http);

var shortid = require("shortid");
var randomstring = require("randomstring");

app.set("port", process.env.PORT || 5000);
app.use(express.static(__dirname + "/public"));

// views is directory for all template files
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//const INDEX = path.join(__dirname, 'public/index.html');

app.get("/", function(req, res) {
    res.render("index.ejs");
});
app.get("/article1", function(req, res) {
    res.sendFile(path.join(__dirname + "/a.html"));
});

function create_user_id() {
    var id = shortid.generate() + "_" + randomstring.generate();
    console.log(id);
    return id;
}

var connections = [];
var users = [];
io.on("connection", socket => {
    console.log("Client connected");
    var user = { id: create_user_id(), name: "no_name" };
    socket.user = user;
    connections.push(socket);
    users.push(user);

    socket.emit("user_data", socket.user);

    send_users_data();

    socket.on("disconnect", data => {
        users.splice(connections.indexOf(socket), 1);
        connections.splice(connections.indexOf(socket), 1);
        console.log("Client disconnected" + socket.user.id);
        send_users_data();
    });

    socket.on("changeName", function(data) {
        socket.user.name = data.name;
        console.log(socket.user.id);

        console.log("in ar:" + users[0].name);
        get_user_by_id(socket.user.id).name = data.name;

        send_users_data();
    });

    socket.on("send_msg", function(data) {
        var user_name = get_user_by_id(data.user_id).name;
        var msg = data.msg;
        var date1 = data.date1;

        socket.broadcast.emit("resive_msg", {
            user_name: user_name,
            msg: msg,
            date1: date1
        });
    });
});

function get_user_by_id(id) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            return users[i];
        }
    }
    return undefined;
}

function send_users_data() {
    io.emit("users_data", users);
}

http.listen(app.get("port"), function() {
    console.log("Node app is running on port", app.get("port"));
});

/*

To send a message to a specific client you need to do it like so:

socket.broadcast.to(socketid).emit('message', 'for your eyes only');
Here is a nice little cheat sheet for sockets:

 // sending to sender-client only
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');
Credit to https://stackoverflow.com/a/10099325

The easiest way rather than sending directly to the socket, would be creating a room for the 2 users to use and just send messages freely in there.

socket.join('some-unique-room-name'); // Do this for both users you want to chat with each other
socket.broadcast.to('the-unique-room-name').emit('message', 'blah'); // Send a message to the chat room.
Otherwise, you're going to need to keep track of each individual clients socket connection, and when you want to chat you'll have to look up that sockets connection and emit specifically to that one using the function I said above. Rooms are probably easier.

*/