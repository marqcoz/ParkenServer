//Archivo que contiene las funciones del servidor

var db = require('../db/pgConfig');
var functions = {};
var axios = require('axios');

var jsonSupers=[];

var admin = require('firebase-admin');
var serviceAccount = require('../parken-217616-firebase-adminsdk-a4h2k-c6dc7ae7d0.json');
//Fragmento para inicializa el SDK de Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  databaseURL: 'http://localhost:50546/'
});


functions.sendNotificationSingle = function(idToken, titulo, mensaje, datos, callback){
var registrationToken = idToken;
if(datos == '{}'){
  datos = '{ "datos" : "NONE" }';
}
var datosJSON = JSON.parse(datos);

  var message = {
                  "token": registrationToken,
                  "data" : datosJSON
                };

  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Notificación enviada exitosamente:', response);
      callback(1);
    })
    .catch((error) => {
      console.log('Error al enviar la notificación:', error);
      callback(0);
    });
};

functions.sendNotificationTopic = function(topic, titulo, mensaje, datos, callback){
  // This registration token comes from the client FCM SDKs.
if(datos == '{}'){
  datos = '{ "datos" : "NONE" }';
}
  var datosJSON = JSON.parse(datos);
  var message = {
                    "topic": topic,
                    "data" : datosJSON
                  };
  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Notificación enviada exitosamente:'+ response);
      callback(1);
    })
    .catch((error) => {
      console.log('Error al enviar la notificación:'+ error);
      callback(0);
    });
};


functions.sendNotificationDry = function(topic1, tipo, titulo, mensaje, accion, callback){
  // This registration token comes from the client FCM SDKs.
  var dryRun = true;
  var topic = 'automovilista';

  var message = {
    notification: {
      title: '$GOOG up 1.43% on the day',
      body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.'
    },
    topic: topic
  };

  // Send a message to the device corresponding to the provided
  // registration token.

  admin.messaging().send(message, dryRun)
    .then((response) => {
      // Response is a message ID string.
      console.log('Notificación enviada exitosamente:'+ response);
      callback(1);
    })
    .catch((error) => {
      console.log('Error al enviar la notificación:'+ error);
      callback(0);
    });

};

functions.androidNotificationSingle = function (idUser, tipoUser, titulo, mensaje, datos){
	//Funcion que envia una notificación
  //Necesitamos llamar a la funcion obtenerDatosAutomovilista
  console.log("Se enviará una notificación al " + tipoUser + " " + idUser);
	if(tipoUser === 'automovilista' && idUser != '0'){

		functions.obtenerDatosAutomovilista(idUser, function(status, data){
			//Aqui adentro obtenemos el id y despues lo reenviamos a la funcion sendNotificationSingle
			if(status==1) {
        //console.log(data);
				if(data.rowCount != 0){
					if (data.rows[0].token != null){
						//enviamos el token a la  funcion para enviar notificiaciones
						functions.sendNotificationSingle(data.rows[0].token, titulo, mensaje, datos, function(status, data){});
					}
				}else{
					console.log('La consulta no generó ningun registro');
				}
		// Error con la conexion a la bd
			} else {
				console.log('No se estableció la conexión con la BD');
			}
		});
	}


	if(tipoUser === 'supervisor' && idUser != '0'){
    console.log("Supervisor");
		functions.obtenerDatosSupervisor(idUser, function(status, data){
			//Aqui adentro obtenemos el id y despues lo reenviamos a la funcion sendNotificationSingle
			if(status==1) {
        //console.log("Información: " + data.rows);
				if(data.rowCount != 0){
					if (data.rows[0].token != null){
						//enviamos el token a la  funcion para enviar notificiaciones
						functions.sendNotificationSingle(data.rows[0].token, titulo, mensaje, datos, function(status, data){});
					}
				}else{
					console.log('La consulta no generó ningun registro');
				}
		// Error con la conexion a la bd
			} else {
				console.log('No se estableció la conexión con la BD');
			}

		});
	}
};




// Función que crea una cuenta de Automovilista
functions.crearCuentaAuto = function(nombre, apellido, correo, contrasena, celular, callback){
  console.log("Se creará una Automovilista en la BD");

  const query = {
    //text: 'INSERT INTO automovilista(nombre, apellido, email, contrasena, celular, puntosparken, estatus)VALUES($1, $2, $3, $4, $5, $6, $7)',
    //values: ['brianc', 'love','brian.m.carlson@gmail.com', 'lop', '5555555',0.0,'Disponible'],
    //text: 'SELECT * FROM "crearAutomovilista"($1, $2, $3, $4, $5);',
    text: 'INSERT INTO automovilista(nombre, apellido, email,contrasena, celular, puntosparken, estatus) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING idautomovilista',
    values: [nombre, apellido, correo, contrasena, celular, 0.0, 'DISPONIBLE'],
  }

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el INSERT regresa un error entonces
    if (err) {
      console.log(err.stack[7])

      //Si el error es 2: Correo ya registrado
      if(err.stack[7] == 2){
          callback(2, err.stack);
      }else

        //Si el error es 3: Celular ya registrado
        if(err.stack[7] == 3){
          callback(3,err.stack);
        }

        //Si no es ningún de esos errores, hay un error de conexion con la BD
        else{
        callback(0);
        }

    } else {
      console.log(res.rows[0])
      console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Función que crea una cuenta de Supervisor
functions.crearCuentaSupervisor = function(nombre, apellido, correo, contrasena, celular, dirección, zonaParken, callback){
  console.log("Se creará una Supervisor en la BD");

  const query = {
    //text: 'INSERT INTO automovilista(nombre, apellido, email, contrasena, celular, puntosparken, estatus)VALUES($1, $2, $3, $4, $5, $6, $7)',
    //values: ['brianc', 'love','brian.m.carlson@gmail.com', 'lop', '5555555',0.0,'Disponible'],
    //text: 'SELECT * FROM "crearAutomovilista"($1, $2, $3, $4, $5);',
    text: 'INSERT INTO supervisor(nombre, apellido, email,contrasena, celular, dirección, estatus, zonaparken_idzonaparken) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    values: [nombre, apellido, correo, contrasena, celular, direccion, zonaParken],
  }

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el INSERT regresa un error entonces
    if (err) {
      //console.log(err.stack[7])

      //Si el error es 2: Correo ya registrado
      if(err.stack[7] == 2){
          callback(2);
      }else

        //Si el error es 3: Celular ya registrado
        if(err.stack[7] == 3){
          callback(3);
        }

        //Si no es ningún de esos errores, hay un error de conexion con la BD
        else{
        callback(0);
        }

    } else {
      console.log(res.rows[0])
      callback(1);
    }
    //db.pool.end()
  })
})
};

// Función que crea una cuenta de Administrador
functions.crearCuentaSupervisor = function(nombre, apellido, correo, contrasena, callback){
  console.log("Se creará una Administrador en la BD");

  const query = {
    //text: 'INSERT INTO automovilista(nombre, apellido, email, contrasena, celular, puntosparken, estatus)VALUES($1, $2, $3, $4, $5, $6, $7)',
    //values: ['brianc', 'love','brian.m.carlson@gmail.com', 'lop', '5555555',0.0,'Disponible'],
    //text: 'SELECT * FROM "crearAutomovilista"($1, $2, $3, $4, $5);',
    text: 'INSERT INTO supervisor(nombre, apellido, email,contrasena) VALUES($1, $2, $3, $4)',
    values: [nombre, apellido, correo, contrasena],
  }

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el INSERT regresa un error entonces
    if (err) {
      //console.log(err.stack[7])

      //Si el error es 2: Correo ya registrado
      if(err.stack[7] == 2){
          callback(2);
      }
        //Si no es ningún de esos errores, hay un error de conexion con la BD
        else{
        callback(0);
        }

    } else {
      console.log(res.rows[0])
      callback(1);
    }
    //db.pool.end()
  })
})
};

// Funcíon que valida el inicio de sesión en la BD para todos los usuarios
functions.iniciarSesion = function(correo, contrasena, usuario, callback){

  var consulta;

  if (usuario == '1'){
    consulta = 'SELECT idautomovilista As id, * FROM automovilista ';
  }else if (usuario == '2') {
    consulta = 'SELECT idsupervisor As id, * FROM supervisor ';
  }else{
    consulta = 'SELECT idadministrador As id, * FROM administrador ';
  }

  //console.log("Usuario: "+ user + "intenta iniciar sesión");
  //Consulta para verificar si el correo esta registrado
  const query = {
    text: consulta + 'WHERE email = $1 AND contrasena = $2;',
    values: [correo, contrasena]
  }
//console.log(query)
  db.pool.connect((err, client, done) => {
    done();
    if (err) throw err
  db.pool.query(query, (err, res) =>{
    if (err) {
      // Error en la conexión con la BD
      callback(0, err.stack);
     console.log(err.stack)
    } else{
      callback(1,res);
    }
  //db.pool.end()
})
})
};

// Funcíon que regresa la infromación personal de un usuario
functions.obtenerDatosAutomovilista = function(id, callback){

  const query = {
    text: 'SELECT * FROM automovilista WHERE idautomovilista = $1;',
    values: [id]
    //rowMode: 'array',
  }
//console.log(query)
  db.pool.connect((err, client, done) => {
    done();
    if (err) throw err

  db.pool.query(query, (err, res) =>{
    if (err) {
      // Error en la conexión con la BD
      callback(0, err.stack);
     console.log(err.stack)
    } else{
      //Verificamos si la consulta regresa un valor
      callback(1,res);
      console.log(res.rows)

    }

  //db.pool.end()
})
})
};

// Funcíon que regresa la infromación personal de un usuario
functions.obtenerAdministradores = function( callback){

  const query = {
    text: 'SELECT * FROM administrador;'
    //rowMode: 'array',
  }
//console.log(query)
  db.pool.connect((err, client, done) => {
    done();
    if (err) throw err

  db.pool.query(query, (err, res) =>{
    if (err) {
      // Error en la conexión con la BD
      callback(0, err.stack);
     console.log(err.stack)
    } else{
      //Verificamos si la consulta regresa un valor
      if(res.rows == ''){
          console.log(res.rows)
      }
      callback(1,res);

    }

  //db.pool.end()
})
})
};

// Función que agrega supervisores
functions.agregarAdministrador = function(nombre, apellido, correo, contrasena, callback){

  const query = {
    text: 'INSERT INTO administrador(nombre, apellido, email, contrasena) VALUES($1, $2, $3, $4) RETURNING idadministrador, nombre, apellido, email, contrasena',
    values: [nombre, apellido, correo, contrasena],
    //rowMode: 'array',
  }
//console.log(query)
  db.pool.connect((err, client, done) => {
    done();
    if (err) throw err

  db.pool.query(query, (err, res) =>{
    if (err) {
      // Error en la conexión con la BD
      if(err.stack[7] === '2'){
        callback(0, err.stack[7]);
      }else{
        callback(0, err.stack);
      }

     console.log(err.stack)
    } else{
      //Verificamos si la consulta regresa un valor
      if(res.rows == ''){
          console.log(res.rows)
      }
      callback(1,res);

    }

  //db.pool.end()
})
})
};

// Función que agrega supervisores
functions.agregarSupervisor = function(nombre, apellido, correo, contrasena, celular, direccion, estatus, zona, callback){

  const query = {
    text: 'INSERT INTO supervisor(nombre, apellido, email, contrasena, celular, direccion, estatus, zonaparken_idzonaparken) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING idsupervisor, nombre, apellido, email, contrasena, celular, direccion, estatus, zonaparken_idzonaparken;',
    values: [nombre, apellido, correo, contrasena, celular, direccion, estatus, zona]
  }
//console.log(query)
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err

  db.pool.query(query, (err, res) =>{
    if (err) {
      // Error en la conexión con la BD
      if(err.stack[7] === '2'){
        callback(0, err.stack.substring(9,40));
      }else{
        if(err.stack[7] === '3'){
          callback(0, err.stack.substring(9,41));
        }else{
          callback(0, err.stack);
        }
      }

     console.log(err.stack)
    } else{
      //Verificamos si la consulta regresa un valor
      if(res.rows == ''){
          console.log(res.rows)
      }
      callback(1,res);

    }

  //db.pool.end()
})
})
};


// Funcíon que regresa la infromación personal de un usuario
functions.obtenerDatosSupervisor = function(id, callback){
  //console.log("ObtenerDatosSupervisor: Entra a la consulta");
  var query = 'SELECT * FROM supervisor s INNER JOIN (SELECT idzonaparken, nombre AS nombreZona FROM zonaparken) AS zp ON s.zonaparken_idzonaparken = zp.idzonaparken WHERE idsupervisor ='+id+';'
  //console.log("ObtenerDatosSupervisor: "+ query);
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err

  db.pool.query(query, (err, res) =>{
    if (err) {
      // Error en la conexión con la BD
      callback(0, err.stack);
     console.log(err.stack)
    } else{
      //Verificamos si la consulta regresa un valor
      callback(1,res);
      //console.log(res.rows)

    }

  //db.pool.end()
})
})
};


// Función que obtiene los espacios parken con sanciones de una zona Parken
functions.obtenerEspaciosParkenConSanciones = function(idzona, callback){

  var query = 'SELECT * FROM sancion s INNER JOIN vehiculo v ON s.vehiculo_idvehiculo = v.idvehiculo WHERE s.espacioparken_zonaparken_idzonaparken = '+ idzona + ' AND s.estatus =\'PENDIENTE\' ORDER BY s.espacioparken_idespacioparken;';
  console.log(query);
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
    db.pool.query(query, (err, res) =>{
      if (err) {
        // Error en la conexión con la BD
        callback(0, err.stack);
      console.log(err.stack)
      } else{
        callback(1,res);
        console.log(res.rows)
      }
    //db.pool.end()
    })
  })
};


// Función que crea una cuenta de Automovilista
functions.crearNuevoVehiculo = function(automovilista, marca, modelo, placa, callback){
  console.log("Agregando vehículo del automovilista...");

  const query = {
    //text: 'add_new_car_relation($1, $2, $3, $4)',
    text: 'SELECT add_new_car_relation($1, $2, $3, $4)',
    //text: 'INSERT INTO vehiculo(placa, marca, modelo, estatus) VALUES($1, $2, $3, $4) RETURNING idvehiculo',
    values: [automovilista, marca, modelo, placa],
  }

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el INSERT regresa un error entonces
    if (err) {
      console.log(err.stack)

        //Si el error es 3: Placas registradas en la base de datos.
        if(err.stack[7] == 3){
          callback(3, err.stack);
        }

        //Si no es ningún de esos errores, hay un error de conexion con la BD
        else{
        callback(0, err.stack);
        }

        //Si el INSERT se generó con éxito entonces
    } else {
      console.log(res.rows[0].add_new_car_relation)
      if (res.rows[0].add_new_car_relation != 2 ){
          callback(1, res);
      }else{
        callback(2, res.rows);
      }
    }
    //db.pool.end()
  })
})
};

// Función que consulta todos los vehiculos registrados de un automovilista
functions.obtenerVehiculosAutomovilista = function(automovilista,callback){
  console.log("Consultando vehículos del automovilista ...");

  const query = {
    //text: 'add_new_car_relation($1, $2, $3, $4)',
    text: 'SELECT v.idvehiculo AS id, v.marca AS marca, v.modelo AS modelo, v.placa AS placa FROM automovilista_has_vehiculo ahv INNER JOIN vehiculo v ON ahv.vehiculo_idvehiculo = v.idvehiculo WHERE automovilista_idautomovilista = $1;',
    values: [automovilista],
  }

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el INSERT se generó con éxito entonces
    } else {
      console.log(res.rows[0])
      callback(1, res);
    }
    //db.pool.end()
    //db.pool.done();
  })
  //client
  })
};


// Función que consulta el id de un vehiculo
functions.obtenerIdVehiculo = function(placa,callback){
  console.log("Consultando el id del vehiculo con placa " + placa +"...");

  const query = {
    //text: 'add_new_car_relation($1, $2, $3, $4)',
    text: 'SELECT * FROM vehiculo WHERE placa = $1;',
    values: [placa],
  }

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      //console.log(err.stack);
        callback(0, err.stack);
        //Si el INSERT se generó con éxito entonces
    } else {
      //console.log(res.rows[0])
      callback(1, res);
    }
    //db.pool.end()
    //db.pool.done();
  })
  //client
  })
};

// Consulta la información de las zonas Parken incluidos los espacios Parken
functions.obtenerInfoZonaParken = function(idZona, callback){
  console.log("Descargando información de las zona Parken"+idZona+"...");

  var qry ='SELECT *, ST_AsText(ep.ubicacion) AS ubicacionEspacioParken, ST_AsText(zp.ubicacion) AS ubicacionZonaParken ' +
  'FROM espacioparken ep ' +
  'INNER JOIN zonaparken zp ' +
  'ON ep.zonaparken_idzonaparken = zp.idzonaparken ' +
  'WHERE zp.idzonaparken =' + idZona +' '+
  'ORDER BY idespacioparken ASC;' ;

  // callback
  db.pool.query(qry, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
       console.log(err.stack);
        callback(0, err.stack);

    } else {
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
};


// Consulta las zonas parken a tantos kilometros de un punto
functions.buscarZonaParken = function(latitud, longitud, distancia, callback){
  console.log("Buscando zonas Parken a " + distancia +" mts...");
  var uno = longitud + ' ' + latitud;
  //console.log(uno);
  var qry = 'SELECT idzonaparken, nombre, distancia, ST_AsText(ubicacion) AS poligono, estatus, radio,'+
  ' ST_AsText(ST_Centroid(ubicacion)) AS centro, precio from ((SELECT zParken.idzonaparken, zParken.precio,'+
  ' max(ST_Distance_Sphere(dump.geom, ST_Centroid(zParken.ubicacion))) AS radio,'+
  ' zParken.nombre, zParken.ubicacion, zParken.estatus, (ST_Length(ST_ShortestLine((zParken.ubicacion),'+
  ' ST_GeomFromText(\'POINT( ~1 )\') )::GEOGRAPHY)) AS distancia FROM zonaparken AS zParken '+
  'JOIN ST_DumpPoints(zParken.ubicacion) dump ON TRUE '+
'GROUP BY zParken.idzonaparken, zParken.nombre)) As sDistance ' +
'WHERE idzonaparken != 0 AND idzonaparken != 1 AND estatus = \'DISPONIBLE\' AND sDistance.distancia <= ~2;';
  var qry2 = qry.replace('~1',uno);
  qry2 = qry2.replace('~2',distancia);
  //console.log(qry2);

/*
  const query = {
    text: 'SELECT idzonaparken, nombre, distancia, ST_AsText(ubicacion) AS poligono, estatus from ' +
    '((SELECT zParken.idzonaparken, zParken.nombre, zParken.ubicacion, zParken.estatus, ' +
    '(ST_Length(ST_ShortestLine((zParken.ubicacion), ST_GeomFromText(\'POINT(-99.1384147 $1)\'' + //latitud +
    ') )::GEOGRAPHY)) ' +
    'AS distancia FROM zonaparken AS zParken)) As sDistance WHERE sDistance.distancia <= $2;',
    values: [latitud, distancia],
  }*/

  // callback
  db.pool.query(qry2, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el INSERT se generó con éxito entonces
    } else {
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
};

// Consulta todas las zonas parken
functions.buscarTodasZonasParken = function(callback){
  console.log("Descargando la información de las zonas Parken...");
  //var qry = 'SELECT *, ST_AsText(ubicacion) AS poligono, ST_AsText(ST_Centroid(ubicacion)) AS centro FROM zonaparken;';
  var qry = 'SELECT *, ST_AsText(ep.ubicacion) AS ubicacionespacioparken, ST_AsText(zp.ubicacion) AS poligono, ST_AsText(ST_Centroid(zp.ubicacion)) AS centro ' +
  'FROM espacioparken ep ' +
  'INNER JOIN zonaparken zp ' +
  'ON ep.zonaparken_idzonaparken = zp.idzonaparken WHERE ep.idespacioparken != 0' +
  'ORDER BY idzonaparken, idespacioparken ASC;'
  db.pool.query(qry, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el INSERT se generó con éxito entonces
    } else {
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
};

// Consulta las zonas parken a tantos kilometros de un punto
functions.obtenerZonasParken = function(idZona, callback){
  console.log("Descargando información de la zona Parken " + idZona + "...");

  var qry = 'SELECT idzonaparken, nombre, ST_AsText(ubicacion) AS poligono, estatus, ' +
   'ST_AsText(ST_Centroid(ubicacion)) AS centro, precio from zonaparken WHERE idzonaparken = ' + idZona + ';';

  db.pool.query(qry, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el INSERT se generó con éxito entonces
    } else {
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
};

// Consulta todas las zonas parken
functions.buscarTodasZonasParkenID = function(callback){
  console.log("Descargando la información de las zonas Parken...");
  var qry = 'SELECT * FROM zonaparken WHERE idzonaparken != 0 AND idzonaparken != 1 ORDER BY idzonaparken;';

  db.pool.query(qry, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el INSERT se generó con éxito entonces
    } else {
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
};


// Consulta las zonas parken a tantos kilometros de un punto
functions.buscarEspacioParken = function(latitud, longitud, distance, callback){
  console.log("Buscando el mejor espacio Parken...");
  var uno = longitud + ' ' + latitud;
  //var uno = latitud + ' ' + longitud;
  //console.log(uno);

  var qry = 'SELECT idespacioparken, direccion, estatus, zonaparken_idzonaparken As zonaparken, nombrezona, coordenada, distancia FROM ' +
  '(SELECT idespacioparken, direccion, esp.estatus, zonaparken_idzonaparken, ST_AsText(esp.ubicacion) AS coordenada, ' +
  '(ST_Distance_Sphere(esp.ubicacion, ST_GeomFromText(\'POINT(~1)\'))) AS distancia, zop.nombre AS nombrezona ' +
  'FROM espacioparken esp INNER JOIN zonaparken zop ON esp.zonaparken_idzonaparken = zop.idzonaparken) AS eParken ' +
  'WHERE eParken.distancia = ('+
  'SELECT MIN(ST_Distance_Sphere(ubicacion, ST_GeomFromText(\'POINT(~1)\'))) FROM espacioparken ' +
  'WHERE estatus = \'DISPONIBLE\') ' +
  'AND zonaparken_idzonaparken IN (SELECT idzonaparken from ((SELECT zParken.idzonaparken, zParken.precio, ' +
    'max(ST_Distance_Sphere(dump.geom, ST_Centroid(zParken.ubicacion))) AS radio, ' +
    'zParken.nombre, zParken.ubicacion, zParken.estatus, (ST_Length(ST_ShortestLine((zParken.ubicacion), ' +
    'ST_GeomFromText(\'POINT(~1)\') )::GEOGRAPHY)) AS distancia FROM zonaparken AS zParken ' +
   'JOIN ST_DumpPoints(zParken.ubicacion) dump ON TRUE ' +
 'GROUP BY zParken.idzonaparken, zParken.nombre)) As sDistance '+
 'WHERE idzonaparken != 0 AND idzonaparken != 1 AND estatus = \'DISPONIBLE\' AND sDistance.distancia <= ~2) AND eParken.estatus = \'DISPONIBLE\' ORDER BY idespacioparken limit 1;';				   

  var qry2 = qry.replace('~1',uno).replace('~1',uno).replace('~1',uno).replace('~2', distance);
  //console.log(qry2);

  // callback
  db.pool.query(qry2, (err, res) => {
  
    db.pool.connect((err, client, done) => {
      done();
      if (err) throw err
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el INSERT se generó con éxito entonces
    } else {
      //console.log(res.rows[0])
      callback(1, res);
      //console.log(res.rows[0])
    }
    //db.pool.end()
  });
});
};


// Consulta las zonas parken a tantos kilometros de un punto
functions.espaciosParken = function(latitud, longitud, distancia, callback){
  console.log("Mostrando todos los espacios Parken...");
  var uno = longitud + ' ' + latitud;
  //console.log(uno);
  //var qry = 'SELECT idzonaparken, nombre, distancia, ST_AsText(ubicacion) AS poligono, estatus, ST_AsText(ST_Centroid(ubicacion)) AS centro from ((SELECT zParken.idzonaparken, zParken.nombre, zParken.ubicacion, zParken.estatus, (ST_Length(ST_ShortestLine((zParken.ubicacion), ST_GeomFromText(\'POINT( ~1 )\') )::GEOGRAPHY)) AS distancia FROM zonaparken AS zParken)) As sDistance WHERE sDistance.distancia <= ~2';
  var qry = 'SELECT idespacioparken, estatus, zonaparken_idzonaparken AS zonaparken, ST_AsText(ubicacion) AS coordenada, (ST_Distance_Sphere(ubicacion, ST_GeomFromText(\'POINT(~1)\'))) AS distancia FROM espacioparken'
  var qry2 = qry.replace('~1',uno);
  //console.log(qry2);

  // callback
  db.pool.query(qry2, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el SELECT se generó con éxito entonces
    } else {
      console.log(res.rows[0])
      callback(1, res);
    }
    //db.pool.end()
  })
};

// Consulta las zonas parken a tantos kilometros de un punto
functions.validarCredencial = function(tipo, credencial, callback){
  console.log("Verificando las credenciales del nuevo automovilista...");
  var qry = '';

if(tipo == 1){
  qry = 'SELECT * FROM automovilista WHERE email ';
}else {
  qry = 'SELECT * FROM automovilista WHERE celular ';
}

  const query = {
    text: qry +  '= $1;',
    values: [credencial],
  }
  //console.log(query);

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el SELECT se generó con éxito entonces
    } else {
      console.log(res.rows);
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Consulta las zonas parken a tantos kilometros de un punto
functions.validarCredencialSupervisor = function(tipo, credencial, callback){
  console.log("Verificando las credenciales del supervisor...");
  var qry = '';

if(tipo == 1){
  qry = 'SELECT * FROM supervisor WHERE email ';
}else {
  qry = 'SELECT * FROM supervisor WHERE celular ';
}

  const query = {
    text: qry +  '= $1;',
    values: [credencial],
  }
  //console.log(query);

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el SELECT se generó con éxito entonces
    } else {
      console.log(res.rows);
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Función que crea una cuenta de Automovilista
functions.actualizar= function(user, id, column, value, callback){

console.log('usuario: ' + user);

  var query;

if(user === 'automovilista'){
  console.log("Se editará el perfil del automovilista...");

  query = 'UPDATE ' + user +
  ' SET ' + column + '=\'' + value +
  '\' WHERE ' + 'id' + user + '=' + id +' RETURNING idautomovilista, nombre, apellido, email, contrasena, celular, puntosparken, estatus;';

} else {

  console.log("Se editará el perfil del supervisor...");

  query = 'UPDATE ' + user +
  ' SET ' + column + '=\'' + value +
  '\' WHERE ' + 'id' + user + '=' + id +' RETURNING idsupervisor, nombre, apellido, email, contrasena, celular, direccion, estatus, zonaparken_idzonaparken, token;';
}
//console.log(query);
  // callback
  db.pool.query(query, (err, res) =>{
    // Si el UPDATE regresa un error entonces
    if (err) {
      console.log(err.stack)
      callback(0,err);
    }else {
      //console.log(res.rows[0])
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
};

// Función para actualizar los puntos Parken del automovlista
functions.actualizarPuntosParken= function(id, value, callback){
  console.log("Actualizando Puntos Parken");

var query = 'SELECT refresh_puntosparken('+ value +', '+ id +')';
//console.log(query);
  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el UPDATE regresa un error entonces
    if (err) {
      console.log(err.stack)
      callback(0,err);
    }else {
      console.log(res.rows[0])
      console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Función que actualiza el token de un usuario (automovilista o supervisor)
functions.actualizarToken= function(id, token, user, callback){
  console.log("Actualizando el token del usuario " + id + "...");

var query = 'UPDATE ' + user +
' SET token =\'' + token +
'\' WHERE ' + 'id' + user + '=' + id;
console.log(query);
  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el UPDATE regresa un error entonces
    if (err) {
      console.log(err.stack)
      callback(0,err);
    }else {
      //console.log(res.rows[0])
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Función que actualiza el perfil del administrador
functions.actualizarAdministrador= function(id, nombre, apellido, contrasena, email, callback){


var query = 'UPDATE ' + 'administrador' +
' SET nombre =\'' + nombre +
'\', apellido =\'' + apellido +
'\', contrasena =\'' + contrasena +
'\', email =\'' + email +
'\' WHERE ' + 'id' + 'administrador' + '=' + id + ' RETURNING idadministrador, nombre, apellido, contrasena, email;';
console.log(query);
  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el UPDATE regresa un error entonces
    if (err) {
      console.log(err.stack)
      callback(0,err);
    }else {
      //console.log(res.rows[0])
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};


// Función que actualiza el perfil del administrador
functions.actualizarSupervisor= function(idsupervisor, nombre, apellido,
  correo, contrasena,
  celular, direccion, estatus, zona, callback){

  var query = 'UPDATE ' + 'supervisor' +
  ' SET nombre =\'' + nombre +
  '\', apellido =\'' + apellido +
  '\', email =\'' + correo +
  '\', contrasena =\'' + contrasena +
  '\', celular =\'' + celular +
  '\', direccion =\'' + direccion +
  '\', estatus =\'' + estatus +
  '\', zonaparken_idzonaparken = ' + zona +
  ' WHERE ' + 'id' + 'supervisor' + '=' + idsupervisor +
  ' RETURNING idsupervisor, nombre, apellido, email, contrasena, celular, direccion, estatus, zonaparken_idzonaparken;';
  console.log(query);
    // callback
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err
    db.pool.query(query, (err, res) => {
      // Si el UPDATE regresa un error entonces
      if (err) {
        if(err.stack[7] === '2'){
          callback(0, err.stack.substring(9,40));
        }else{
          if(err.stack[7] === '3'){
            callback(0, err.stack.substring(9,41));
          }else{
            if(err.stack[7] === '5'){
              callback(0, err.stack.substring(9,28));

            }else{
            callback(0, err.stack);
          }
        }
        }
        console.log(err.stack)
      }else {
        //console.log(res.rows[0])
        //console.log(res.rows)
        callback(1, res);
      }
      //db.pool.end()
    })
  })
  };


// Función par eliminar un vehiculo del automovilista,
// No se elimina el vehiculo de la tabla vehiculo, pero si de la tabla que
//guarda la relación
functions.eliminarVehiculo= function(idvehiculo, idautomovilista, callback){
  console.log("Se eliminará un vehículo de un automovilista...");


  const query = {
    //text: 'add_new_car_relation($1, $2, $3, $4)',
    text: 'DELETE FROM automovilista_has_vehiculo WHERE vehiculo_idvehiculo = $1 AND automovilista_idautomovilista = $2',
    values: [idvehiculo, idautomovilista],
  }
  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el UPDATE regresa un error entonces
    if (err) {
      console.log(err)
      callback(0,err);
    }else {
      console.log(res.rows[0])
      console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Función que crea una cuenta de Automovilista
functions.actualizarVehiculo= function(idvehiculo, marca, modelo, callback){
  console.log("Se editará un vehiculo...");

var query = 'UPDATE vehiculo '+
'SET marca = \'' + marca + '\',' +
'modelo = \'' + modelo + '\'' +
' WHERE idvehiculo = ' + idvehiculo + ';'
//console.log(query);
  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el UPDATE regresa un error entonces
    if (err) {
      console.log(err)
      callback(0,err);
    }else {
      console.log(res.rows[0])
      console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Función que crea una cuenta de Automovilista
functions.actualizarEspacioParken= function(idEspacio, estatus, callback){
  console.log("Se editará un espacio Parken...");

var query = 'UPDATE espacioparken '+
'SET estatus = \'' + estatus  + '\'' +
' WHERE idespacioparken = ' + idEspacio + ';'
//console.log(query);
  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el UPDATE regresa un error entonces
    if (err) {
      console.log(err)
      callback(0,err);
    }else {
      //console.log(res.rows[0])
      //nsole.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

functions.apartarEspacioParken = function(espacioP, zonaP, idAutomovilista, callback){

  console.log("Se va a apartar el espacio Parken " + espacioP + " de la zona " + zonaP);
  const query = {
    text: 'SELECT book_parken_space($1, $2, $3)',
    values: [espacioP, zonaP, idAutomovilista],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {

        if(err.stack[7] == 4){
            callback(2, err.stack);
        }else{
          // Error en la conexión con la BD
          callback(0, err.stack);
        }
       console.log(err.stack)
      } else{
        //Verificamos si la consulta regresa un valor
        if(res.rows == ''){
            console.log(res.rows)
        }

        callback(1,res);

      }

    //db.pool.end()
    })
  })
};

// Función que consulta todas las sanciones del automovilista
functions.obtenerSancionesAutomovilista = function(automovilista, callback){
  console.log("Consultando sanciones del automovilista...");

  var query = 'SELECT idsancion, ' +
'tiempo AS fechasancion, tiempopago AS fechapago, ' +
'to_char(tiempo, \'DD Mon YYYY\') As fecha, to_char(tiempo, \'HH24:MI\') As hora, ' +
'to_char(tiempopago, \'DD Mon YYYY\') As fechapago, to_char(tiempopago, \'HH24:MI\') As horapago, ' +
'monto, observacion, s.estatus, ' +
'automovilista_idautomovilista AS idautomovilista, au.nombre AS nombreautomovilista, au.apellido AS apellidoautomovilista, ' +
'au.email AS correoautomovilista, au.celular AS celularautomovilista, au.token AS tokenautomovilista, ' +
'idvehiculo, placa, marca, modelo, supervisor_idsupervisor AS idsupervisor, ' +
'idespacioparken, ST_AsText(ep.ubicacion) AS coordenadaEP, ep.direccion, ' +
'idzonaparken, zp.nombre ' +
'FROM sancion AS s ' +
'INNER JOIN vehiculo AS v ON s.vehiculo_idvehiculo = v.idvehiculo ' +
'INNER JOIN espacioparken AS ep ON s.espacioparken_idespacioparken = ep.idespacioparken ' +
'INNER JOIN zonaparken AS zp ON ' +
's.espacioparken_zonaparken_idzonaparken = zp.idzonaparken ' +
'INNER JOIN automovilista AS au ON s.automovilista_idautomovilista = au.idautomovilista ' +
'WHERE automovilista_idautomovilista = ' + automovilista +
' AND idzonaparken != 0'+
' AND idzonaparken != 1'+
' ORDER BY tiempo DESC';


  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
        //Si el INSERT se generó con éxito entonces
    } else {
      //console.log(res.rows[0])
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

functions.pagarSancion = function(idSancion, callback){

  const query = {
    text: 'UPDATE sancion SET estatus = \'PAGADA\', tiempopago = NOW() WHERE idsancion = $1 RETURNING automovilista_idautomovilista AS idautomovilista, espacioparken_idespacioparken AS ep, espacioparken_zonaparken_idzonaparken AS zp;',
    values: [idSancion],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          callback(0, err.stack);
       console.log(err.stack)
      } else{
        //Verificamos si la consulta regresa un valor
        if(res.rows == ''){
            console.log(res.rows)
        }
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};

functions.cerrarReporte = function(idreporte, callback){

  const query = {
    text: 'UPDATE reporte SET estatus = \'RESUELTO\' WHERE idreporte = $1 ' +
    'RETURNING idreporte, tiempo, estatus, tipo, observacion, automovilista_idautomovilista AS idautomovilista, supervisor_idsupervisor AS idsupervisor, espacioparken_idespacioparken AS idespacioparken, espacioparken_zonaparken_idzonaparken AS idzonaparken;',
    values: [idreporte],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          callback(0, err.stack);
       console.log(err.stack)
      } else{
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};

// Función que consulta todas las sesiones Parken del automovilista (excepto las que estan reservadas)
functions.obtenerSesionesParken = function(automovilista, callback){
  console.log("Consultando las sesiones del automovilista...");

  var query = '(SELECT idsesionparken, COALESCE(montopago, 0.0) AS montopago, COALESCE(sp.tiempo, \'0\') AS tiempo, sp.estatus, ' +
      'COALESCE(\'\',to_char(fechainicio, \'DD Mon YYYY\')) As fechainicio, COALESCE(\'\',to_char(fechainicio, \'HH24:MI\')) AS horainicio, '+
	     'COALESCE(\'\',to_char(fechafinal, \'DD Mon YYYY\')) As fechafinal, COALESCE(\'\',to_char(fechafinal, \'HH24:MI\')) AS horafinal, ' +
       'sp.automovilista_idautomovilista AS idautomovilista, ' +
       'sp.vehiculo_idvehiculo AS idvehiculo, ' +
       'v.marca, v.modelo, v.placa, ' +
       'sp.espacioparken_idespacioparken AS idespacioparken, ' +
       'ST_AsText(ep.ubicacion) AS coordenadaep, ' +
       'ep.direccion AS direccionEspacioParken, ' +
       'sp.espacioparken_zonaparken_idzonaparken AS idzonaparken, ' +
       'zp.nombre AS nombreZonaParken, ' +
       's.monto AS montoSancion, ' +
       'to_char(s.tiempo, \'DD Mon YYYY\') As fecha, to_char(s.tiempo, \'HH24:MI\') As hora,' +
       's.idsancion ' +
      'FROM public.sesionparken sp ' +
      'INNER JOIN vehiculo v ON sp.vehiculo_idvehiculo = v.idvehiculo ' +
      'INNER JOIN espacioparken ep ON sp.espacioparken_idespacioparken = ep.idespacioparken ' +
      'INNER JOIN zonaparken zp ON sp.espacioparken_zonaparken_idzonaparken = zp.idzonaparken ' +
      'INNER JOIN sancion s ON sp.idsesionparken = s.sesionparken_idsesionparken ' +
      'WHERE sp.estatus != \'RESERVADO\' ' +
      'AND idzonaparken != 0 '+
      ' AND idzonaparken != 1'+
      //'AND s.estatus = \'PENDIENTE\'' +
      'AND sp.automovilista_idautomovilista = ' + automovilista +
      ' ORDER BY fechainicio ASC' +
      ')' +
      'UNION ALL' +
      '(SELECT idsesionparken, COALESCE(montopago, 0.0) AS montopago, COALESCE(sp.tiempo, \'0\') AS tiempo, sp.estatus, ' +
          'to_char(fechainicio, \'DD Mon YYYY\') As fechainicio, to_char(fechainicio, \'HH24:MI\') AS horainicio, '+
    	     'to_char(fechafinal, \'DD Mon YYYY\') As fechafinal, to_char(fechafinal, \'HH24:MI\') AS horafinal, ' +
           'sp.automovilista_idautomovilista AS idautomovilista, ' +
           'sp.vehiculo_idvehiculo AS idvehiculo, ' +
           'v.marca, v.modelo, v.placa, ' +
           'sp.espacioparken_idespacioparken AS idespacioparken, ' +
           'ST_AsText(ep.ubicacion) AS coordenadaep, ' +
           'ep.direccion AS direccionEspacioParken, ' +
           'sp.espacioparken_zonaparken_idzonaparken AS idzonaparken, ' +
           'zp.nombre AS nombreZonaParken, ' +
           '0.0 AS montoSancion, ' +
           '\'\' AS fecha, \'\' AS hora, ' +
           '0 AS idsancion ' +
          'FROM public.sesionparken sp ' +
          'INNER JOIN vehiculo v ON sp.vehiculo_idvehiculo = v.idvehiculo ' +
          'INNER JOIN espacioparken ep ON sp.espacioparken_idespacioparken = ep.idespacioparken ' +
          'INNER JOIN zonaparken zp ON sp.espacioparken_zonaparken_idzonaparken = zp.idzonaparken ' +
          'WHERE sp.estatus != \'RESERVADO\' ' +
          'AND idzonaparken != 0 '+
          ' AND idzonaparken != 1'+
          //'AND s.estatus = \'PENDIENTE\'' +
          'AND sp.automovilista_idautomovilista = ' + automovilista +
          ' ORDER BY fechainicio ASC' +
          ') ORDER BY idsesionparken DESC;';

      //console.log(query);


  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {

    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
    } else {
      //console.log(res.rows[0])
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Función que consulta todas las sesiones Parken del automovilista
functions.obtenerAllSesionesParken = function(automovilista, callback){
  console.log("Consultando las sesiones del automovilista...");

  var query =
        '(SELECT idsesionparken, COALESCE(montopago, 0.0) AS montopago, COALESCE(sp.tiempo, \'0\') AS tiempo, ' +
        ' to_char(fechainicio, \'DD MM YYYY HH24:MI:SS\') AS fechainicio, ' +
        ' EXTRACT(EPOCH FROM AGE (NOW(), fechafinal))/60 AS tiemporestantemin, EXTRACT(EPOCH FROM AGE (NOW(), fechafinal)) AS tiemporestanteseg, ' +
        ' EXTRACT(EPOCH FROM AGE (NOW(), fechainicio))/60 AS tiempotranscurridomin, EXTRACT(EPOCH FROM AGE (NOW(), fechainicio)) AS tiempotranscurridoseg, ' +
        'sp.estatus, ' +
            'to_char(fechainicio, \'DD Mon YYYY\') As fechainicial, to_char(fechainicio, \'HH24:MI\') AS horainicio, '+
      	     'to_char(fechafinal, \'DD Mon YYYY\') As fechafinal, to_char(fechafinal, \'HH24:MI\') AS horafinal, ' +
             'sp.automovilista_idautomovilista AS idautomovilista, ' +
             'sp.vehiculo_idvehiculo AS idvehiculo, ' +
             'v.marca, v.modelo, v.placa, ' +
             'sp.espacioparken_idespacioparken AS idespacioparken, ' +
             'ST_AsText(ep.ubicacion) AS coordenadaep, ' +
             'ep.direccion AS direccionEspacioParken, ' +
             'sp.espacioparken_zonaparken_idzonaparken AS idzonaparken, ' +
             'zp.nombre AS nombreZonaParken, ' +
             '0.0 AS montoSancion, ' +
             '0 AS idsancion ' +
            'FROM public.sesionparken sp ' +
            'INNER JOIN vehiculo v ON sp.vehiculo_idvehiculo = v.idvehiculo ' +
            'INNER JOIN espacioparken ep ON sp.espacioparken_idespacioparken = ep.idespacioparken ' +
            'INNER JOIN zonaparken zp ON sp.espacioparken_zonaparken_idzonaparken = zp.idzonaparken ' +
            //'WHERE sp.estatus != \'RESERVADO\' ' +
            //'AND s.estatus = \'PENDIENTE\'' +
            'AND sp.automovilista_idautomovilista = ' + automovilista +
            ') ORDER BY estatus, fechainicio DESC';

      //console.log(query);


  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
    } else {
      //console.log(res.rows[0])
      callback(1, res);
    }
    //db.pool.end()
  })
})
};


// Función que consulta todas las sesiones Parken del automovilista
functions.obtenerEstatusEspacioParken = function(id, callback){
  console.log("Consultando el estatus del espacio Parken " + id + "...");

  var query =
  'SELECT *, ST_AsText(ep.ubicacion) AS coordenada, ' +
  'au.nombre AS nombreautomovilista, ' +
  'zp.nombre AS nombrezonaparken, ' +
  'sp.estatus AS estatussesionparken, ' +
  'to_char(fechafinal, \'DD MM YYYY HH24:MI:SS\') AS fechafinalformatted,' +
  'ep.estatus AS estatusespacioparken ' +
  'FROM sesionparken sp ' +
  'INNER JOIN automovilista au ON sp.automovilista_idautomovilista = au.idautomovilista ' +
  'INNER JOIN espacioparken ep ON sp.espacioparken_idespacioparken= ep.idespacioparken  ' +
  'INNER JOIN vehiculo v ON sp.vehiculo_idvehiculo = v.idvehiculo ' +
  'INNER JOIN zonaparken zp ON zp.idzonaparken = ep.zonaparken_idzonaparken ' +
  'WHERE sp.espacioparken_idespacioparken = ' + id + ' AND sp.estatus = ' +
  '(SELECT (CASE WHEN estatus = \'DISPONIBLE\' THEN \'DISPONIBLE\' ' +
  		'WHEN estatus = \'RESERVADO\' THEN \'RESERVADO\' ' +
  		'WHEN estatus = \'OCUPADO\' THEN \'ACTIVA\' ' +
  		'WHEN estatus = \'REPORTADO\' THEN \'REPORTADA\' ' +
  		'WHEN estatus = \'SANCIONADO\' THEN \'SANCIONADA\' ' +
      'WHEN estatus = \'SANCION PAGADA\' THEN \'SANCION PAGADA\' ' +
  	   '	ELSE \'\' ' +
  		'END) ' +
  		'FROM espacioparken WHERE idespacioparken = ' + id + ') ORDER BY sp.fechainicio DESC ' +
  		'LIMIT 1;';

      //console.log(query);


  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
        console.log(err.stack);
        callback(0, err.stack);
    } else {
      //console.log(res.rows)
        callback(1,res);

    }
    //db.pool.end()
  })
})
};


// Función que consulta todas las sesiones Parken del automovilista
functions.obtenerEspaciosParkenParaSesion = function(id, callback){
  console.log("Consultando los espacios Parken para sesión " + "...");

  var query = 'SELECT *, ST_AsText(ubicacion) AS coordenada ' +
  'FROM espacioparken ' +
  'WHERE zonaparken_idzonaparken = ' + id + ' AND (estatus = \'DISPONIBLE\' OR estatus = \'OCUPADO\') ORDER BY idespacioparken;';
  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
        console.log(err.stack);
        callback(0, err.stack);
    } else {
      //console.log(res.rows)
        callback(1,res);

    }
    //db.pool.end()
  })
})
};

// Función que consulta todas las sesiones Parken del automovilista
functions.obtenerTodosEspaciosParken = function(id, opc, callback){
  console.log("Consultando todos los espacios Parken" + "...");
  var query;
    if(opc === '1'){
      query = 'SELECT *, ST_AsText(ubicacion) AS coordenada ' +
      'FROM espacioparken ' +
      'WHERE zonaparken_idzonaparken = ' + id + ' ORDER BY idespacioparken ASC;';
    }else{
      query = 'SELECT *, ST_AsText(ubicacion) AS coordenada ' +
      'FROM espacioparken ' +
      'WHERE zonaparken_idzonaparken = ' + id + 'AND estatus != \'SANCIONADO\' ORDER BY idespacioparken ASC;';
    }

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
        console.log(err.stack);
        callback(0, err.stack);
    } else {
      //console.log(res.rows)
        callback(1,res);

    }
    //db.pool.end()
  })
})
};

// Función que consulta todas las sesiones Parken del automovilista
functions.obtenerTodosReportes = function(id, callback){
  console.log("Consultando todos los reportes del supervisor " + id + "...");

  var query = 'SELECT *, ' +
'to_char(tiempo, \'DD MONTH HH24:MI\') AS fechatiempo, ' +
'ST_AsText(ep.ubicacion) AS coordenada, ' +
'r.estatus AS estatusreporte, ' +
'ep.estatus AS estatusespacioparken, ' +
'au.nombre AS nombreautomovilista ' +
'FROM reporte r ' +
'INNER JOIN espacioparken ep ON r.espacioparken_idespacioparken= ep.idespacioparken ' +
'INNER JOIN automovilista au ON r.automovilista_idautomovilista= au.idautomovilista ' +
'WHERE r.supervisor_idsupervisor = ' + id + 'ORDER BY tiempo DESC;';

  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    if (err) {
        console.log(err.stack);
        callback(0, err.stack);
    } else {
        callback(1,res);
    }
    //db.pool.end()
  })
})
};



// Función que consulta todas las sesiones Parken del automovilista
functions.obtenerValoresDelServer = function(callback){

  console.log("Obteniendo valores iniciales...");

  var query ='SELECT tiempo, duracion, ' +
  '(extract(minute from duracion)) AS duracionminutos, ' +
  '(extract(second from duracion)) AS duracionsegundos ' +
  'FROM tiempo ORDER BY idtiempo ASC;';

      //console.log(query);


  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
    } else {
      //console.log(res.rows[0])
      callback(1, res);
    }
    //db.pool.end()
  })
})
};


// Función que genera un reporte
functions.crearReporte = function(estatus, tipo, observaciones, automovilista, espacioparken, zonaparken, callback){
  console.log("Se generará un reporte en la BD");

  var query = 'INSERT INTO public.reporte(' +
            'tiempo, '  +
            'estatus, '  +
            'tipo, '  +
            'observacion, '  +
            'automovilista_idautomovilista, '  +
            //'supervisor_idsupervisor, '  +
            'espacioparken_idespacioparken, '  +
            'espacioparken_zonaparken_idzonaparken)'  +
    'VALUES ( NOW(), ' +
    '\'' + estatus +'\', ' +
    '\'' + tipo + '\', ' +
    '\'' + observaciones + '\', ' +
    automovilista + ', ' +
    //supervisor + ', ' +
    espacioparken + ', ' +
    zonaparken + ') ' +
    'RETURNING idreporte, tipo, estatus ' +
    'tiempo, '  +
    'observacion, '  +
    'automovilista_idautomovilista, '  +
    //'supervisor_idsupervisor, '  +
    'espacioparken_idespacioparken, '  +
    'espacioparken_zonaparken_idzonaparken;';

    //console.log(query);
  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el INSERT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
    } else {
      console.log(res.rows[0])
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Función para insertar una ZonaParken
functions.agregarZonaParken = function(nombreZona, coordenadasZona, coordenadasEspacios,estatusZona, precioZona, callback){
  console.log("Se agregará una zona Parken...");

  var query = 'INSERT INTO public.zonaparken(nombre, ubicacion, estatus, precio) ' +
  'VALUES (\'' +
      nombreZona +'\', ' +
			'ST_GeomFromText(\'POLYGON((' + coordenadasZona + '))\'), \'' +
			estatusZona +'\', ' +
			precioZona + ') RETURNING idzonaparken;';

      console.log(query);

      db.pool.connect((err, client, done) => {     
        done();
        if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el INSERT regresa un error entonces
    if (err) {
      if(err.stack[7]== '0'){
        callback(6, err.stack);
      }else{
        if(err.stack[7]== '1'){
          callback(7, err.stack);
        }else{
          callback(0, err.stack);
        }
      }
      console.log(err.stack);

    } else {
      console.log(res.rows[0])
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

// Función para insertar espaciosParken
 functions.agregarEspacioAZonaParken = async function(coordenadasEspacios, idZona, callback){
  console.log("Se agregarán espacios Parken a la zona " + idZona + "...");

  if(coordenadasEspacios === ""){
    callback(1, "");

  }else{

    var coordenadas = coordenadasEspacios.split(",");

    var query = 'INSERT INTO espacioparken(ubicacion, estatus, zonaparken_idzonaparken, direccion) VALUES ';
    const API_KEY = 'AIzaSyDkmiXSeUvTkbXgV7UYpwmhiysqkrjqcZ0';
    var direccion;
    for(var i = 0; i < coordenadas.length; i++){
      //aqui tenemos lat lng
      //Aqui obtenemos direccion
      var subcoordenada = coordenadas[i].split(" ");
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+subcoordenada[1]+','+subcoordenada[0]+'&key='+API_KEY;
      //console.log(url);
    await axios.get(url)
    .then(response => {
      direccion = response.data.results[0].formatted_address;
      //console.log(direccion);
    })
    .catch(error => {
      console.log(error);
      direccion = "-";
    });
      query = query +
      '(ST_GeomFromText(\'POINT('+coordenadas[i]+')\'), \'DISPONIBLE\', '+idZona+', \''+direccion+'\')';

      if(i != coordenadas.length - 1){
        query = query + ', ';
      }
    }

    console.log(query);

    await db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

     db.pool.query(query, (err, res) => {
      // Si el INSERT regresa un error entonces
      if (err) {
        console.log(err.stack);
          callback(0, err.stack);
      } else {
        //console.log(res.rows)
        callback(1, res);
      }
      //db.pool.end()
    })
  })

  }
  
};


// Función que genera un reporte
functions.crearSancion = function(idAutomovilista, idVehiculo, idSupervisor, idEspacio, idZona, idSesion, monto, callback){
  console.log("Se generará una sanción...");

  var query = 'INSERT INTO sancion( ' +
	'tiempo, ' +
	'monto, ' +
	'observacion, ' +
	'estatus, ' +
	'automovilista_idautomovilista, ' +
	'vehiculo_idvehiculo, ' +
	'supervisor_idsupervisor, ' +
	'espacioparken_idespacioparken, ' +
	'espacioparken_zonaparken_idzonaparken, ' +
	'sesionparken_idsesionparken) ' +
	'VALUES (NOW(), ' +
  monto + ', ' +
  '\'\', ' +
  '\'PENDIENTE\', ' +
  idAutomovilista + ', ' +
  idVehiculo + ', ' +
  idSupervisor + ', ' +
  idEspacio + ', ' +
  idZona +', ' +
  idSesion + ') ' +
  'RETURNING idsancion, tiempo, monto, observacion, estatus, ' +
  'automovilista_idautomovilista, vehiculo_idvehiculo, supervisor_idsupervisor, ' +
	'espacioparken_idespacioparken, espacioparken_zonaparken_idzonaparken, ' +
	'sesionparken_idsesionparken;';
//

db.pool.connect((err, client, done) => {     
  done();
  if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el INSERT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
    } else {

      callback(1, res);
    }
    //db.pool.end()
  })
})
};


// Funcíon que regresa la infromación personal de un usuario
functions.verificarEstatusVehiculo = function(idVehiculo, callback){

  const query = {
    text: 'SELECT idvehiculo, estatus AS disponiblidad FROM vehiculo WHERE idvehiculo = $1',
    values: [idVehiculo],
  }
//console.log(query)
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err

  db.pool.query(query, (err, res) =>{
    if (err) {
      // Error en la conexión con la BD
      callback(0, err.stack);
     console.log(err.stack)
    } else{
      //Verificamos si la consulta regresa un valor
      if(res.rows == ''){
          console.log(res.rows)
      }

      callback(1,res);

    }

  //db.pool.end()
})
})

};

functions.activarSesionParken = function(idSesionParken, idAutomovilista, fechaFinal, monto, tiempo, idVehiculo, puntosParken, ep, zp, opc, callback){

  const query = {
    text: 'SELECT * FROM activate_session($1, $2, $3, $4, $5, $6, $7, $8, $9);',
    values: [idSesionParken, idAutomovilista, monto, tiempo, idVehiculo, puntosParken, ep, zp, opc],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          callback(0, err.stack);
          console.log(err.stack)
      } else{
        callback(1,res);
        console.log(res.rows[0]);
      }

    //db.pool.end()
    })
  })
};

functions.obtenerEspacioParken = function(idEspacioParken, callback){

  const query = {
    text: 'SELECT *, ST_AsText(ep.ubicacion) AS coordenada, ep.estatus AS estatusespacioparken FROM espacioparken ep INNER JOIN zonaparken zp ON ep.zonaparken_idzonaparken = zp.idzonaparken WHERE idespacioparken = $1;',
    values: [idEspacioParken],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          callback(0, err.stack);
          console.log(err.stack)
      } else{

          callback(1,res);
        //console.log(res.rows[0]);
      }

    //db.pool.end()
    })
  })
};

functions.obtenerPuntosParken = function(idAutomovilista, callback){

  const query = {
    text: 'SELECT puntosparken, idautomovilista FROM automovilista WHERE idautomovilista = $1;',
    values: [idAutomovilista],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          callback(0, err.stack);
          console.log(err.stack)
      } else{
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};

functions.eliminarSesionParken = function(sesionparken, callback){

  const query = {
    text: 'DELETE FROM sesionparken WHERE idsesionparken = $1;',
    values: [sesionparken],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          callback(0, err.stack);
          console.log(err.stack)
      } else{
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};

functions.eliminarAdministrador = function(idadministrador, callback){

  const query = {
    text: 'DELETE FROM administrador WHERE idadministrador = $1;',
    values: [idadministrador],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          if(err.stack[7] === '0'){
            callback(2, err.stack[7]);
          }else{
            callback(0, err.stack);
          }
          console.log(err.stack)
      } else{
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};


functions.eliminarEspaciosParken = function(idzona, espaciosParken, callback){

  if(espaciosParken === ""){
    callback(1,"");
  }else{
    var query = 'DELETE FROM espacioparken WHERE zonaparken_idzonaparken = ' + idzona + ' AND idespacioparken IN ' + espaciosParken + ';';
    console.log(query)
      db.pool.connect((err, client, done) => {     
        done();
        if (err) throw err

      db.pool.query(query, (err, res) =>{
        if (err) {
            // Error en la conexión con la BD
            if(err.stack[7] === '0'){
              callback(2, err.stack[7]);
            }else{
              if(err.stack[7] === '7'){
                callback(7, "Espacios Parken no disponibles");
              }else{
              callback(0, err.stack);
              }
            }
            console.log(err.stack)
        } else{
          callback(1,res);
        }

      //db.pool.end()
      })
    })

  }

};

functions.eliminarEspaciosParkenFuera = function(idzona, espaciosParken, callback){

    var query = 'DELETE FROM espacioparken WHERE idespacioparken NOT IN ' +
'(SELECT ep.idespacioparken ' +
		'FROM zonaparken zp ' +
		 'INNER JOIN espacioparken ep ' +
		 'ON ST_Intersects(zp.ubicacion, ep.ubicacion) ' +
     'WHERE zp.idzonaparken = '+ idzona + ')';
     if(espaciosParken != ""){
      query = query + ' AND idespacioparken IN ' + espaciosParken;
     }
     query = query + ' AND zonaparken_idzonaparken = '+idzona+';';
    console.log(query)
      db.pool.connect((err, client, done) => {     
        done();
        if (err) throw err

      db.pool.query(query, (err, res) =>{
        if (err) {
            // Error en la conexión con la BD
            if(err.stack[7] === '7'){
              callback(7, "No es posible eliminar los espacios Parken, no están disponibles.");
            }else{
              if(err.stack[7] === '8'){
                callback(8, "Espacios Parken con reportes pendientes.");
              }else{
                if(err.stack[7] === '9'){
                  callback(9, "Espacios Parken con sanciones pendientes.");
                }else{
                  if(err.stack[7] === '6'){
                    callback(6, "La zona debe tener al menos un espacio Parken.");
                  }else{
                    if(err.stack[7] === '4'){
                      callback(4, "No se han finalizado algunas sesiones Parken en la zona.");
                    }else{
                      callback(0, "No es posible eliminar espacios Parken.");
                    }
                  }
                }

              }
            }

            console.log(err.stack)
        } else{
          callback(1,res);
        }

      //db.pool.end()
      })
    })
};


functions.eliminarSupervisor= function(idsupervisor, callback){

  const query = {
    text: 'DELETE FROM supervisor WHERE idsupervisor = $1 RETURNING idsupervisor, token;',
    values: [idsupervisor],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          if(err.stack[7] === '0'){
            callback(2, err.stack[7]);
          }else{
            if(err.stack[7] === '5'){
              callback(3, err.stack[7]);
            }else{
              callback(0, err.stack);
            }
          }
          console.log(err.stack)
      } else{
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};

functions.eliminarZonaParken= function(idzonaparken, callback){

  const query = {
    text: 'DELETE FROM zonaparken WHERE idzonaparken = $1;',
    values: [idzonaparken],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          switch(err.stack[7]){
            case '0':
              callback(0, err.stack);
            break;

            case '7':
              callback(7, err.stack);
            break;

            case '6':
              callback(6, err.stack);
            break;

            case '5':
              callback(5, err.stack);
            break;

            case '4':
              callback(4, err.stack);
            break;

            case '3':
              callback(3, err.stack);
            break;

            default:
              callback(0, err.stack);
            break;
          }
          console.log(err.stack)
      } else{
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};


functions.actualizarZonaParken= function(idzona, nombre, estatus, precio, coordenadasZona, callback){

  var query = 'UPDATE zonaparken SET nombre = \'' + nombre +
  '\' , estatus = \'' + estatus + '\', ' +
  'precio = ' + precio + ', ' +
  'ubicacion = ST_GeomFromText(\'POLYGON((' + coordenadasZona + '))\') ' +
  ' WHERE idzonaparken = ' + idzona + ' RETURNING idzonaparken, nombre, estatus, precio, ubicacion;';

  console.log(query);
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          switch(err.stack[7]){
            case '0':
              callback(0, err.stack);
            break;

            case '2':
              callback(6, err.stack);
            break;

            case '3':
              callback(3, "La zona intersecta con otra zona Parken.");
            break;

            case '4':
              callback(4, err.stack);
            break;

            case '5':
              callback(7, err.stack);
            break;

            default:
              callback(0, err.stack);
            break;
          }
          console.log(err.stack)
      } else{
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};



functions.obtenerSupervisoresXZona = function(idzona, callback){

  var qry;
  if(idzona == '0'){
    qry = 'SELECT *, zp.nombre AS nombrezona, s.nombre AS nombresupervisor FROM supervisor s INNER JOIN zonaparken zp ON s.zonaparken_idzonaparken=zp.idzonaparken WHERE zonaparken_idzonaparken != 0 AND zonaparken_idzonaparken != 1 ORDER BY s.nombre;';
  }else{
    qry = 'SELECT *, zp.nombre AS nombrezona, s.nombre AS nombresupervisor FROM supervisor s INNER JOIN zonaparken zp ON s.zonaparken_idzonaparken=zp.idzonaparken WHERE zonaparken_idzonaparken = ' + idzona + ' ORDER BY s.nombre;';
  }

  //console.log(qry)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(qry, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          callback(0, err.stack);
          console.log(err.stack)
      } else{
        callback(1,res);
      }
    //db.pool.end()
    })
  })
};


functions.modificarSesionParken = function(idSesion, estatus, fecha, callback){

    var query;
    if(fecha){
      query = {
        text: 'UPDATE sesionparken SET estatus = $2, fechafinal = NOW()  WHERE idsesionparken = $1;',
        values: [idSesion, estatus],
      }
    }else{
      query = {
        text: 'UPDATE sesionparken SET estatus = $2 WHERE idsesionparken = $1;',
        values: [idSesion, estatus],
      }
    }

    console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          callback(0, err.stack);
       console.log(err.stack)
      } else{
        //Verificamos si la consulta regresa un valor
        if(res.rows == ''){
            console.log(res.rows)
        }
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};

functions.sesionParkenPagando= function(idSesion, minutos, segundos, callback){

/*
  const query = {
    text: 'UPDATE sesionparken SET estatus = \'PAGANDO\', fechafinal = NOW() + interval \' $1 minutes  $2 seconds\' WHERE idsesionparken = $3;',
    values: [minutos, segundos, idSesion],
  }
  console.log(query);
*/
  var query = 'UPDATE sesionparken SET estatus = \'PAGANDO\', fechafinal = NOW() + interval \''+ minutos +' minutes '+ segundos +' seconds\' WHERE idsesionparken ='+ idSesion +' RETURNING idsesionparken, espacioparken_idespacioparken, espacioparken_zonaparken_idzonaparken;';
  console.log(query);

  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) throw err

    db.pool.query(query, (err, res) =>{
      if (err) {
          // Error en la conexión con la BD
          callback(0, err.stack);
       console.log(err.stack)
      } else{
        //Verificamos si la consulta regresa un valor
        if(res.rows == ''){
            console.log(res.rows)
        }
        console.log(res.rows)
        callback(1,res);
      }

    //db.pool.end()
    })
  })
};


// Funcíon que regresa la infromación personal de un usuario
functions.verificarEstatusSesionParken = function(idSesion, estatus, callback){

  const query = {
    text: 'SELECT * FROM sesionparken WHERE estatus = $2 AND idsesionparken = $1;',
    values: [idSesion, estatus]
    //rowMode: 'array',
  }
//console.log(query)
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err

  db.pool.query(query, (err, res) =>{
    if (err) {
      // Error en la conexión con la BD
      callback(0, err.stack);
     console.log(err.stack)
    } else{
      //Verificamos si la consulta regresa un valor
      if(res.rows == ''){
          console.log(res.rows)
          callback(2,res);
      }else {
        callback(1,res);
      }


    }

  //db.pool.end()
})
})
};

// Funcíon que regresa la infromación personal de un usuario

functions.verificarAdministrador = function(id, callback){
console.log("Verificando administrador...");
  const query = {
    text: 'SELECT * FROM administrador WHERE idadministrador = $1;',
    values: [id]
  }
  //console.log(query)
  db.pool.connect((err, client, done) => {     
    done();
    if (err) return done(err)
    db.pool.query(query, (err, res) =>{
      if (err) {
        // Error en la conexión con la BD
        callback(0, err.stack);
        console.log(err.stack)
      } else{
        callback(1,res);
      }
    })
  })
};

// Funcíon que regresa la infromación personal de un usuario
functions.verificarSupervisor = function(id, callback){
  console.log("Verificando supervisor...");
    const query = {
      text: 'SELECT * FROM supervisor WHERE idsupervisor = $1;',
      values: [id]
      //rowMode: 'array',
    }
  //console.log(query)
    db.pool.connect((err, client, done) => {     
      done();
      if (err) return done(err)

    db.pool.query(query, (err, res) =>{
      if (err) {
        // Error en la conexión con la BD
        callback(0, err.stack);
       console.log(err.stack)
      } else{
          callback(1,res);
      }

    //db.pool.end()
  })
  })
  };

// Crea una tabla con las distancias de los supervisores y el numero de reportes asignados
functions.obtenerMejorSupervisor = function(supervisores, idEspacioParken, peticion, callback){
  console.log("Buscando al mejor supervisor...");

  //Tenemos supervisores[{id: 3, lat:19.56, ln: 99.875}, {id: 3, lat:19.56, ln: 99.875}]
  //Recorremos el json y por cada arreglo vamos creando el texto con la consulta asi:

  var queryCREATE = 'CREATE TEMPORARY TABLE temp_supers_distance' + peticion + '(id integer, distancia double precision, estatus varchar, reportes int); ';

  var queryINSERT = 'INSERT INTO temp_supers_distance' + peticion + '(id, distancia, estatus, reportes) VALUES';

  for(var i = 0; i < supervisores.length; i++){
    queryINSERT = queryINSERT + '(' + supervisores[i].id + ', ' + 
    '(ST_Distance_Sphere(' +
			'(SELECT ubicacion FROM espacioparken WHERE idespacioparken = ' + idEspacioParken + '), ' + 
      'ST_GeomFromText(\'POINT(' + supervisores[i].lng + ' ' + supervisores[i].lat + ')\'))), ' +	   
      '(SELECT estatus FROM supervisor WHERE idsupervisor = ' + supervisores[i].id + '), ' +
    '(SELECT count(*) FROM reporte WHERE supervisor_idsupervisor = ' + supervisores[i].id + ' AND estatus = \'ASIGNADO\'))';
    
    if(i != supervisores.length - 1){
      queryINSERT = queryINSERT + ', ';
    }else{
      queryINSERT = queryINSERT + '; ';
    }
  }

  var querySELECT = 'SELECT * FROM temp_supers_distance' + peticion + 
    ' ORDER BY distancia, estatus, reportes ASC;';

  var query = queryCREATE + queryINSERT + querySELECT;
  console.log(query);
  
  // callback
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
    } else {
      console.log(res.rows);
      callback(1, res);
    }
  })
};

// Asigna un registro de la tabla reorte a un supervisor
functions.asignarReporte = function(idReporte, idSupervisor, callback){
  console.log("Asignando reporte a supervisor...");

  var query ='UPDATE reporte SET estatus = \'ASIGNADO\', ' +
   'supervisor_idsupervisor = ' + idSupervisor +
   'WHERE idreporte = ' + idReporte + ';';
  
  console.log(query);
  
  // callback
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
      callback(0, err.stack);
    } else {
      //console.log(res.rows);
      callback(1, res);
    }
  })
};
// Elimina la tabla temporal para obtener la distancia de los suepervisores
functions.eliminarTableTemp = function(peticion, callback){
  console.log("Eliminando tabla temporal...");

  var query ='DROP TABLE temp_supers_distance' + peticion + ';';
  console.log(query);
  
  // callback
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
      callback(0, err.stack);
    } else {
      //console.log(res.rows);
      callback(1, res);
    }
  })
};

// Obtiene el reporte más antiguo para que sea atendido
functions.obtenerReporteUrgente = function(idZona, callback){
  console.log("Buscando el reporte más antiguo...");

  var query =' SELECT * FROM reporte WHERE estatus = \'PENDIENTE\' AND espacioparken_zonaparken_idzonaparken = ' + idZona + ' ORDER BY tiempo ASC;'
  
  console.log(query);
  
  // callback
  db.pool.query(query, (err, res) => {
    // Si el SELECT regresa un error entonces
    if (err) {
      console.log(err.stack);
      callback(0, err.stack);
    } else {
      if(res.rows!=''){
        callback(1, res);
      }else{
        callback(-1, res);
      }
      //console.log(res.rows);
      
    }
  })
};

// Función que crea una cuenta de Automovilista
functions.liberarVehiculo= function(user, id, column, value, callback){
  console.log("Se editará el perfil del automovilista...");

var query = 'UPDATE ' + user +
' SET ' + column + '=\'' + value +
'\' WHERE ' + 'id' + user + '=' + id +' RETURNING idautomovilista, nombre, apellido, email, contrasena, celular, puntosparken, estatus;';
//console.log(query);
  // callback
  db.pool.connect((err, client, done) => {     
    done();
    if (err) throw err
  db.pool.query(query, (err, res) => {
    // Si el UPDATE regresa un error entonces
    if (err) {
      console.log(err.stack)
      callback(0,err);
    }else {
      //console.log(res.rows[0])
      //console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
  })
})
};

functions.obtenerUbicacionSupervisores = function(idZona, callback){
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

functions.agregarUbicacionSupervisores = function(json){
  var j =[];
  j = j.concat(json);

  for(var i = 0; i < jsonSupers.length; i++){ 
    if(jsonSupers[i].socket == j[0].socket){ //Si existe el socket, entonces lo actualizamos
      jsonSupers[i].lat = j[0].lat;
      jsonSupers[i].lng = j[0].lng;
      break;
    }

    if(i == jsonSupers.length - 1){ //Entonces llegamos al final de todo y no encontro nada, entonces lo concatenamos
      //Es aqui donde se coloca la primera vez, es decir se acaba de conectar y aqui es donde vamos a solicitar la asignación
      //Puesto que ya se va a encontrar registrado en la bd
      jsonSupers = jsonSupers.concat(json);

      functions.asignarReportesAutomaticamente(jsonSupers[i].idZona, function(status){
        //Aqui es donde checamos si se llevó a acabo la asignación correctamente
        switch(status){
          case 1:
            console.log('Reporte asignado exitosamente');
            break;

          case 1.5:
            console.log('Reportes asignado exitosamente con errores');
          break;

          case -1:
            console.log('No hay reportes pendientes');
            break;

          case -2:
            console.log('No hay supervisores disponibles');
            break;

          case -3:
            console.log('No hay supervisores disponibles');
            break;

          case -3.2:
            console.log('No hay supervisores disponibles');
            break;

          case -4:
            console.log('Error al asignar el reporte al supervisor');
            break;

          case 0:
            console.log('Error con la base de datos');
            break;

            default: 
              console.log('ERROR');
              break;
        }
      });
    }
  }
  if(jsonSupers.length == 0){
    jsonSupers = jsonSupers.concat(json);

    functions.asignarReportesAutomaticamente(jsonSupers[i].idZona, function(status){
      //Aqui es donde checamos si se llevó a acabo la asignación correctamente
      switch(status){
        case 1:
          console.log('Reporte asignado exitosamente');
          break;
        case 1.5:
          console.log('Reportes asignado exitosamente con errores');
          break;
        case -1:
          console.log('No hay reportes pendientes');
          break;

        case -2:
          console.log('No hay supervisores disponibles');
          break;

        case -3:
          console.log('No hay supervisores disponibles');
          break;

        case -3.2:
          console.log('No hay supervisores disponibles');
          break;

        case -4:
          console.log('Error al asignar el reporte al supervisor');
          break;

        case 0:
          console.log('Error con la base de datos');
          break;

          default: 
            console.log('ERROR');
            break;
      }
    });

  }
  

  //jsonSupers = jsonSupers.concat(json);
};

functions.asignarReportesAutomaticamente = function(idZona, callback){
  //Hay reportes pendientes?
  functions.obtenerReporteUrgente(idZona, function(status, data){

    if(status === 1){//Si hay reportes pendientes, los asignamos, y obtenemos el reporte
      functions.onAssignReport(data, function(data){
        callback(data);
      }); 
                    
    }else{
      if(status === -1){
        //No hay reportes pendientes
        callback(-1);
      }else{
        //Error con la base de datos
        callback(0);
      }
    }
  });
};

functions.deleteSuperJson = function(socket){
  for(var i = 0; i < jsonSupers.length; i++){
    if(jsonSupers[i].socket == socket){
      jsonSupers.splice(i, 1);
      break;
    }
  }
};

functions.onAssignReport = function(data, callback){

  //Listos para asignar
  var idEspacioReport = data.rows[0].espacioparken_idespacioparken;
  var idReport = data.rows[0].idreporte;
  var tipoReport = data.rows[0].tipo;
  var estatusReport =  data.rows[0].estatus;
  var tiempoReport = data.rows[0].tiempo;
  var observacionReport = data.rows[0].observacion;
  var idautomovilistaReport = data.rows[0].automovilista_idautomovilista;
  var idzonaparkenReport =  data.rows[0].espacioparken_zonaparken_idzonaparken;

//Obtenemos todas las ubicaciones de los supervisores
functions.obtenerUbicacionSupervisores(idzonaparkenReport, function(supervisores){
  if(supervisores == []){ //No hay supers
    callback(-2);
  }else{
    //Obtenemos al mejor supervisor
    functions.obtenerMejorSupervisor(supervisores, idEspacioReport, idReport, function(status, data){
      if(status === 1){
        var mejorSuper;
        if(data.rowCount != 0){
          //Encontramos al mejor supervisor
          mejorSuper = data.rows[0].id;
          //Asignar reporte
          functions.asignarReporte(idReport, mejorSuper, function(status, data){
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

              functions.androidNotificationSingle(mejorSuper, 'supervisor', 'Nueva reporte', 'Necesitamos de tu ayuda. Revisa que sucede en el espacio Parken.', '{ "datos" : "OK", "idNotification" : "100", ' + jsonReporte + ' }');

              functions.eliminarTableTemp(idReport, function(status, data){
                if(status === 1){
                  //Asignación completa
                  callback(1);
                }else{
                  //Asignación exitosa pero incompleta, se asignó el reporte,
                  //pero no se eliminó la tabla temporal
                  callback(1.5);
                }
              });
              

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


module.exports = functions;
