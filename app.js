var app = require("express")(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");

var http = require('http').Server(app);
var Requests = require('./models/functions');
var reque = require('./routes/Requests');

var io = require('socket.io')(http);

const Store = require('data-store');
const store = new Store({ path: '../config.json' });

var jsonSupers=[];

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function(req, res) {

	//res.send("Parken 0.1");
  res.sendFile(__dirname + '/index.html');

});


//require('./sockets/socket');
//routes = require('./routes/Requests')(app);
routes = require('./routes/Requests')(app);

var test = {
    message: 'Hello World!',
    user: 'How are you?'
  };

io.on('connection', function(socket){
  console.log('a user connected');
  console.log(socket.id);
  //Cada vez que se conecta un usuario 
  
    socket.emit('chat message', test);
  socket.on('disconnect', function(){
    //Cuando se desconecte un usuario, eliminamos su registro en el json
    console.log('Usuario desconectado' + ' ' + socket.id);
    //Eliminamos el array del usuario desconectado
    Requests.deleteSuperJson(socket.id);
  });

  socket.on('disponibleAReportes', function(loc){
    //Evento que guarda la ubicacion de todos los supervisores en una variable.
    var jsonLocation = {
      socket: socket.id,
      id: loc.idSupervisor,
      idZona: loc.idZonaParken,
      lat: loc.lat,
      lng: loc.lng
    };
    //Concatenamos si no existe, si ya existe reemplazamos
    Requests.agregarUbicacionSupervisores(jsonLocation);
  });
});

http.listen(app.get('port'), function() {
	console.log("Parken server running on http://localhost:"+app.get('port'));
});

/*


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

*/