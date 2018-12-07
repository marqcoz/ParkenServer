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
    Requests.agregarUbicacionSupervisores(jsonLocation);

    //Aqui vamos a guardarlo en el localstorage
    store.set(socket.id, jsonLocation);
    //console.log(store.data);
    //console.log(jsonSupers); 
  });
});

  asignarReportesAutomaticamente = function(idZona, callback){
    //Hay reportes pendientes?
    Requests.obtenerReporteUrgente(idZona, function(status, data){
      if(status === 1){//Si hay reportes pendientes, los asignamos, y obtenemos el reporte

        onAssignReport(data, function(data){
          callback(data);
        }); 
                      
      }else{
        if(status === -1){
          callback(-1);
        }else{
          //Error con la base de datos
          callback(0);
        }
      }

    });
  };

crearReporte2 = function(callback){
  Requests.obtenerUbicacionSupervisores(18, function(status, data){});
};

onAssignReport = function(data, callback){

  //Listos para asignar
  var idEspacioReport = data.rows[0].espacioparken_idespacioparken;
  var idReport = data.rows[0].idreporte;
  var tipoReport = data.rows[0].tipo;
  var estatusReport =  data.rows[0].estatus;
  var tiempoReport = data.rows[0].tiempo;
  var observacionReport = data.rows[0].observacion;
  var idautomovilistaReport = data.rows[0].automovilista_idautomovilista;
  var idzonaparkenReport =  data.rows[0].espacioparken_zonaparken_idzonaparken;

Requests.obtenerUbicacionSupervisores(idzonaparkenReport, function(supervisores){
  if(supervisores == []){ //No hay supers
    callback(-2);
  }else{
    //Obtenemos al mejor supervisor
    Requests.obtenerMejorSupervisor(supervisores, idEspacioReport, idReport, function(status, data){

      if(status === 1){

        var mejorSuper;

        if(data.rowCount != 0){
          //Encontramos al mejor supervisor
          mejorSuper = data.rows[0].id;
          //Asignar reporte
          Requests.asignarReporte(idReport, mejorSuper, function(status, data){
            if(status === 1){ //Se asignó exitosamente
              //Hasta este momento se manda la notificación al supervisor
              //Enviar la notificacion de nuevo reporte
              //Armamos el json con el reporte
              var jsonReporte = '"idreporte": "' + idReport +'", ' +
                  '"tipo": "' + tipoReport +'", ' +
                  '"estatus": "' + estatusReport +'", ' +
                  '"tiempo": "'  + tiempoReport +'", ' +
                  '"observacion": "' + observacionReport + '", ' +
                  '"idautomovilista": "' + idautomovilistaReport +'", ' +
                  '"idsupervisor": "' + mejorSuper +'", ' +
                  '"idespacioparken": "'  + idEspacioReport +'", ' +
                  '"idzonaparken": "' + idzonaparkenReport +'"';

              Requests.androidNotificationSingle(mejorSuper, 'supervisor', 'Nueva reporte', 'Necesitamos de tu ayuda. Revisa que sucede en el espacio Parken.', '{ "datos" : "OK", "idNotification" : "100", ' + jsonReporte + ' }');
              callback(1);

            }else{ //No se asignó
              callback(-4);
            }
          });
        }else{
          //No hay supervisores
          mejorSuper = -1;
          callback(-3.2);
        }
      }else{
        callback(-3);
      }
    });
  
  }
}); 
};

deleteSuperJson = function(socket){
  for(var i = 0; i < jsonSupers.length; i++){
    if(jsonSupers[i].socket == socket){
      jsonSupers.splice(i, 1);
      break;
    }
  }
};

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