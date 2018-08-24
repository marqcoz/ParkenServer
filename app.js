var app = require("express")(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");

var http = require('http').Server(app);
var Requests = require('./models/functions');

var io = require('socket.io')(http);

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());


app.get('/', function(req, res) {

	//res.send("Parken 0.1");
  res.sendFile(__dirname + '/index.html');

});

//require('./sockets/socket');
routes = require('./routes/Requests')(app);

var test = {
    message: 'Hello World!',
    user: 'How are you?'
  };

io.on('connection', function(socket){
  console.log('a user connected');
    //socket.emit('chat message', test);
  socket.on('disconnect', function(){
    console.log('Usuario desconectado');

  });



  socket.on('buscar espacio parken', function(msg){
console.log('message of ' + socket.id + ': ' + msg );

    var latitud = msg.latitud;
    var longitud	 = msg.longitud;
    console.log('message: ' + msg);
    //Ejecutar la funcion buscarEspacioParken
    Requests.buscarEspacioParken(latitud, longitud, function(status, data){

      var jsonResponse = null;
      // Consuta generada con éxito
      if(status==1) {
        //Primero validamos si data nos devuelve un registros
        if(data.rowCount != 0){

          var ini = "POINT(".length;
          var f = data.rows[0].coordenada.length - 1;
          var coordenadasCentro = data.rows[0].coordenada.substring(ini, f)
          var centroArray = coordenadasCentro.split(" ");


              jeison = '{ "success":1, ' +
                '"id":' + data.rows[0].idespacioparken + ', ' +
                '"zona":' + data.rows[0].zonaparken + ', ' +
                '"coordenada": [ {' +
                '"latitud":' + centroArray[0] + ', ' +
                '"longitud":' + centroArray[1] + '} ] }';

                jsonResponse = jeison;
              //res.send(jsonResponse);
              socket.emit('buscar espacio parken', jsonResponse);
              console.log(jsonResponse);



        }else{
          //NO hay espacios Parken Disponible
          jsonResponse = '{"success":2}';
          //res.send(jsonResponse);
          socket.emit('buscar espacio parken', jsonResponse);
          console.log(jsonResponse);
        }

    // Error con la conexion a la bd
      } else {
        jsonResponse = '{success:0}';
        //res.send(jsonResponse);
        socket.emit('buscar espacio parken', jsonResponse);
        console.log(jsonResponse);
      }
    });
    //io.emit('chat message', msg);
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
