var app = require("express")(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");

var http = require('http').Server(app);
var Requests = require('./models/functions');
var reque = require('./routes/Requests');

var io = require('socket.io')(http);

const Store = require('data-store');
const store = new Store({ path: 'config.json' });



app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());


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

    socket.emit('chat message', test);
  socket.on('disconnect', function(){
    console.log('Usuario desconectado');

  });





  socket.on('buscar espacio parken', function(msg){
    //console.log('message of ' + socket.id + ': ' + msg );

    var latitud = msg.latitud;
    var longitud	 = msg.longitud;
		var idAuto = msg.idAutomovilista.toString();
    //console.log('message: ' + msg);
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
                	'"direccion":"' + data.rows[0].direccion + '", ' +
                '"coordenada": [ {' +
                '"latitud":' + centroArray[0] + ', ' +
                '"longitud":' + centroArray[1] + '} ] }';

                if(store.hasOwn(idAuto)){
                  if(store.get(idAuto) != data.rows[0].idespacioparken.toString()){
                    Requests.androidNotificationSingle(idAuto, 'automovilista', 'Nuevo espacio Parken', 'El espacio '+ data.rows[0].idespacioparken.toString() + ' ahora es el más cercano a tu destino.', '{ "datos" : "OK", "idNotification" : "200", "espacioParken" : "' + data.rows[0].idespacioparken.toString() + '" }');
                  }
                  store.set(idAuto, data.rows[0].idespacioparken.toString());


                }else {
                  store.set(idAuto, data.rows[0].idespacioparken.toString());
                }



/*
                								if(localStorage.getItem(idAuto) === "undefined" || localStorage.getItem(idAuto) === null){
                									console.log('Aviso: NO existe localstorage');
                									localStorage.setItem(idAuto, data.rows[0].idespacioparken.toString());
                								}else{
                									console.log('Aviso: YA existe localstorage ' + localStorage.getItem(idAuto));
                									if(localStorage.getItem(idAuto) != data.rows[0].idespacioparken.toString()){
                										console.log('Aviso: HA cambiado el espacio ' + localStorage.getItem(idAuto));
                										localStorage.setItem(idAuto, data.rows[0].idespacioparken.toString())
                										routes.androidNotificationSingle(idAuto, 'automovilista', 'Nuevo espacio Parken', 'El espacio '+ data.rows[0].idespacioparken.toString() + ' ahora es el más cercano a tu destino.', '{ "datos" : "OK", "idNotification" : "200", "espacioParken" : "' + data.rows[0].idespacioparken.toString() + '" }');
                									}

                								}
*/

                jsonResponse = jeison;
              //res.send(jsonResponse);
              socket.emit('buscar espacio parken', jsonResponse);
              //console.log(jsonResponse);



        }else{
          //NO hay espacios Parken Disponible
          jsonResponse = '{"success":2}';
          //res.send(jsonResponse);
          socket.emit('buscar espacio parken', jsonResponse);
          //console.log(jsonResponse);
        }

    // Error con la conexion a la bd
      } else {
        jsonResponse = '{success:0}';
        //res.send(jsonResponse);
        socket.emit('buscar espacio parken', jsonResponse);
        //console.log(jsonResponse);
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
