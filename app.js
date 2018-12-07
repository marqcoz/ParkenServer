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
  //Aqui se ejecuta la funcion para checar los reportes y asignarlos
  store.clear();
  //sabes que yo creo que lo que vamos a hacer es una funcion que asigne los reportes
  //Si me explico? para no trbajar doble
  //Que es lo que va hacer?
  //BAsicmanete
  //Buscar el reporte mas antiguo (solo uno)
  //O lo que podemos hacer es dos opciones
  //Obtener nñumero de reporte


    socket.emit('chat message', test);
  socket.on('disconnect', function(){
    //Cuando se desconecte un usuario, eliminamos su registro en storage
    console.log('Usuario desconectado' + ' ' + socket.id);
    //Eliminamos el array del usuario desconectado
    deleteSuperJson(socket.id);
    store.del(socket.id);
    console.log(store.data);
  });

  socket.on('disponibleAReportes', function(loc){
    //Evento que guarda la ubicacion de todos los supervisores en una variable.
    //console.log(socket.id);
    //console.log(loc);
    //Creamos el json con la información del supervisor
    var jsonLocation = {
      socket: socket.id,
      id: loc.idSupervisor,
      idZona: loc.idZonaParken,
      lat: loc.lat,
      lng: loc.lng
    };
    //Concatenamos si no existe, si ya existe reemplazamos
    agregarUbicacionSupervisores(jsonLocation);

    //Aqui vamos a guardarlo en el localstorage
    store.set(socket.id, jsonLocation);
    //console.log(store.data);
    //console.log(jsonSupers);

    //Esta no la mandaremos a llamas mas tarde
    obtenerUbicacionSupervisores(18, function(supervisores){
      //Obtenemos al mejor supervisor del que le acabamos de mandar
      Requests.obtenerMejorSupervisor(supervisores, 324, 10023, function(status, data){
        console.log("Resultado:");
        console.log(status, data.rows);
      });
      //console.log(supervisores);
    });  
  });


crearReporte2 = function(callback){
  obtenerUbicacionSupervisores(18, function(status, data){});
};



obtenerUbicacionSupervisores = function(idZona, callback){
  //Esta funcion va a crear un json con las ubicaciones de los supervisores de las zonaParken ingresada
  //Primero recorremos todos los registros
  var jsonUbicacionesSuper = [];
  var jsonUbicacionesSuperAux;

  for(var i = 0; i < jsonSupers.length; i++){
    //Nos detenemos en los json con la zona correspondiente
    if(jsonSupers[i].idZona == idZona){
      //Aqui vamos guardando en el json la información
      jsonUbicacionesSuperAux = {
        id: jsonSupers[i].id,
        lat: jsonSupers[i].lat,
        lng: jsonSupers[i].lng
      }
      jsonUbicacionesSuper = jsonUbicacionesSuper.concat(jsonUbicacionesSuperAux);
    }
  }
  
  callback(jsonUbicacionesSuper);
};

deleteSuperJson = function(socket){
  for(var i = 0; i < jsonSupers.length; i++){
    if(jsonSupers[i].socket == socket){
      jsonSupers.splice(i, 1);
      break;
    }
  }
};

agregarUbicacionSupervisores = function(json){
  var j =[];
  j = j.concat(json);

  /*

  for(var i = 0; i < jsonSupers.length; i++){ 
    if(jsonSupers[i].socket == j[0].socket){ //Si existe el socket, entonces lo actualizamos
      jsonSupers[i].lat = j[0].lat;
      jsonSupers[i].lng = j[0].lng;
      break;
    }

    if(i == jsonSupers.length - 1){ //Entonces llegamos al final de todo y no encontro nada, entonces lo concatenamos
      jsonSupers = jsonSupers.concat(json);
    }
  }
  if(jsonSupers.length == 0){
    jsonSupers = jsonSupers.concat(json);
  }
  */

 jsonSupers = jsonSupers.concat(json);
};



  socket.on('buscar espacio parken', function(msg){
    //console.log('message of ' + socket.id + ': ' + msg );
    console.log("JSON Request: ");
		console.log(msg);
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

                jsonResponse = jeison;
                console.log("Respuesta JSON: " + jsonResponse);
              //res.send(jsonResponse);
              io.emit('buscar espacio parken', jsonResponse);
              

        }else{
          //NO hay espacios Parken Disponible
          jsonResponse = '{"success":2}';
          console.log("Respuesta JSON: " + jsonResponse);
          //res.send(jsonResponse);
          io.emit('buscar espacio parken', jsonResponse);
          
        }

    // Error con la conexion a la bd
      } else {
        jsonResponse = '{ "success": 0 }';
        console.log(jsonResponse);
        //res.send(jsonResponse);
        io.emit('buscar espacio parken', jsonResponse);
        
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

//Ahora, en un instante de tiempo ya tenemos la ubicación de todos los suspervisores, 
//lo interesente es saber cuando vamos a llamar a esa funcion, 
//que es lo que vamos a hacer ahora
//Funcion que crea un tabala temporal con la ifnromación que le vamos a apasar de los supervisores 
//Y al final consultamos esa tabla ordendaita y regresamos el primer valor, yo pienso que esa funcion va air en request, dodne estan todas las demas