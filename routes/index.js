/*var express = require('express');

var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

io.on('connection', function(socket){
  //socket.on('chat message', function(msg){
    //io.emit('chat message', msg);
    console.log('a user connected');
  //});
});

module.exports = router;
*/

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
