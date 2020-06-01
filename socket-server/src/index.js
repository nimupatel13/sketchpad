const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var canvas;
var con = 0;
io.on("connection", socket => {
	socket.on("canvas", drawing => {
		console.log(drawing);
		canvas = drawing;
		io.emit("drawing",canvas);
	});
	io.emit("drawing",canvas);
});


http.listen(4444);
