//Archivo que contiene las funciones del servidor

var db = require('../db/pgConfig');
var functions = {};
var admin = require('firebase-admin');

var serviceAccount = require('../parken-1520827408399-firebase-adminsdk-fpu48-e36c594626.json');



//Fragmento para inicializa el SDK de Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  databaseURL: 'http://localhost:50546/'
});


functions.sendNotificationSingle = function(idToken, tipo, titulo, mensaje, accion, callback){
  // This registration token comes from the client FCM SDKs.
  //var registrationToken = 'fulhK3so0j0:APA91bFT-80RJknl2YJVPacQP4u-SjgWmxjuum9Je084MSEHQO1sqqX4OJ9TBMhsywKb-8l8WWEQLcqgYc2ganME4r5DGcgKbvOW8sWUrbwbisPpvADHuii0WJq7lGCi-t0dgj_78DTl6mkmfnBvnaGMUN1_odmwhw';
var registrationToken = idToken;

  var message = {
    android: {
      ttl: 3600 * 1000, // 1 hour in milliseconds
      priority: 'normal',
      notification: {
        //title: '$GOOG up 1.43% on the day',
        title: titulo,
        //body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.',
        body: mensaje,
        color: '#f45342'
      }
    },
  	token: registrationToken
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  /*
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
*/

functions.sendNotificationTopic = function(topic, tipo, titulo, mensaje, accion, callback){
  // This registration token comes from the client FCM SDKs.

  var message = {
    notification: {
      title: titulo,
      body: mensaje
    },
    topic: topic
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  /*
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
*/

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
};

// Funcíon que valida el inicio de sesión en la BD para todos los usuarios
functions.iniciarSesion = function(correo, contrasena, usuario, callback){

  var user;
  var user2;
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
    values: [correo, contrasena],
    //rowMode: 'array',
  }
//console.log(query)
  db.pool.connect((err, client, done) => {
    if (err) throw err

  db.pool.query(query, (err, res) =>{
    if (err) {
      // Error en la conexión con la BD
      callback(0, err.stack);
     console.log(err.stack)
    } else{
      //Verificamos si la consulta regresa un valor
      if(res.rows == ''){
          //console.log(res.rows)
      }

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
    values: [id],
    //rowMode: 'array',
  }
//console.log(query)
  db.pool.connect((err, client, done) => {
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

// Funcíon que regresa la infromación personal de un usuario
functions.obtenerDatosSupervisor = function(id, callback){

  const query = {
    text: 'SELECT * FROM supervisor WHERE idsupervisor = $1;',
    values: [id],
    //rowMode: 'array',
  }
//console.log(query)
  db.pool.connect((err, client, done) => {
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
      //console.log(res.rows[0].add_new_car_relation)
      if (res.rows[0].add_new_car_relation != 2 ){
          callback(1, res);
      }else{
        callback(2, res.rows);
      }
    }
    //db.pool.end()
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
    //db.pool.done();
  })
  //client

};

// Consulta las zonas parken a tantos kilometros de un punto
functions.buscarZonaParken = function(latitud, longitud, distancia, callback){
  console.log("Buscando zonas Parken...");
  var uno = longitud + ' ' + latitud;
  //console.log(uno);
  var qry = 'SELECT idzonaparken, nombre, distancia, ST_AsText(ubicacion) AS poligono, estatus, radio,'+
  ' ST_AsText(ST_Centroid(ubicacion)) AS centro, precio from ((SELECT zParken.idzonaparken, zParken.precio,'+
  ' max(ST_Distance_Sphere(dump.geom, ST_Centroid(zParken.ubicacion))) AS radio,'+
  ' zParken.nombre, zParken.ubicacion, zParken.estatus, (ST_Length(ST_ShortestLine((zParken.ubicacion),'+
  ' ST_GeomFromText(\'POINT( ~1 )\') )::GEOGRAPHY)) AS distancia FROM zonaparken AS zParken '+
  'JOIN ST_DumpPoints(zParken.ubicacion) dump ON TRUE '+
'GROUP BY zParken.idzonaparken, zParken.nombre)) As sDistance '+
//'WHERE idzonaparken in (4)';
//'WHERE sDistance.distancia <= ~2';
'WHERE sDistance.distancia <= 10000';
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

// Consulta las zonas parken a tantos kilometros de un punto
functions.buscarEspacioParken = function(latitud, longitud, callback){
  console.log("Buscando espacio Parken...");
  var uno = longitud + ' ' + latitud;
  //console.log(uno);

  var qry = 'SELECT idespacioparken, direccion, estatus, zonaparken_idzonaparken As zonaparken, coordenada, distancia FROM ' +
  '(SELECT idespacioparken, direccion, estatus, zonaparken_idzonaparken, ST_AsText(ubicacion) AS coordenada, ' +
  '(ST_Distance_Sphere(ubicacion, ST_GeomFromText(\'POINT(~1)\'))) AS distancia ' +
  'FROM espacioparken) AS eParken ' +
  'WHERE eParken.distancia = ('+
  'SELECT MIN(ST_Distance_Sphere(ubicacion, ST_GeomFromText(\'POINT(~1)\'))) FROM espacioparken ' +
  'WHERE estatus = \'DISPONIBLE\')';

  var qry2 = qry.replace('~1',uno).replace('~1',uno);
  //console.log(qry2);

  // callback
  db.pool.query(qry2, (err, res) => {
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
};

// Función que crea una cuenta de Automovilista
functions.actualizar= function(user, id, column, value, callback){
  console.log("Se editará el perfil del automovilista...");

var query = 'UPDATE ' + user +
' SET ' + column + '=\'' + value +
'\' WHERE ' + 'id' + user + '=' + id +';';
//console.log(query);
  // callback
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
};

// Función para actualizar los puntos Parken del automovlista
functions.actualizarPuntosParken= function(id, value, callback){
  console.log("Actualizando Puntos Parken");

var query = 'SELECT refresh_puntosparken('+ value +', '+ id +')';
//console.log(query);
  // callback
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
};

// Función que actualiza el token de un usuario (automovilista o supervisor)
functions.actualizarToken= function(id, token, user, callback){
  console.log("Actualizando el token del usuario " + id + "...");

var query = 'UPDATE ' + user +
' SET token =\'' + token +
'\' WHERE ' + 'id' + user + '=' + id;
//console.log(query);
  // callback
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
};

functions.apartarEspacioParken = function(espacioP, zonaP, idAutomovilista, callback){

  const query = {
    text: 'SELECT book_parken_space($1, $2, $3)',
    values: [espacioP, zonaP, idAutomovilista],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {
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
' ORDER BY tiempo DESC';


  // callback
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
};

functions.pagarSancion = function(idSancion, callback){

  const query = {
    text: 'UPDATE sancion SET estatus = \'PAGADA\', tiempopago = NOW() WHERE idsancion = $1 RETURNING automovilista_idautomovilista AS idautomovilista, espacioparken_idespacioparken AS ep, espacioparken_zonaparken_idzonaparken AS zp;',
    values: [idSancion],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {
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
      //'AND s.estatus = \'PENDIENTE\'' +
      'AND sp.automovilista_idautomovilista = ' + automovilista +
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
          //'AND s.estatus = \'PENDIENTE\'' +
          'AND sp.automovilista_idautomovilista = ' + automovilista +
          ') ORDER BY fechainicio DESC';

      //console.log(query);


  // callback
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
            ') ORDER BY fechainicio DESC';

      //console.log(query);


  // callback
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
};

// Función que consulta todas las sesiones Parken del automovilista
functions.obtenerValoresDelServer = function(callback){

  console.log("Obteniendo valores iniciales...");

  var query ='SELECT tiempo, duracion, ' +
  '(extract(minute from duracion)) AS duracionminutos, ' +
  '(extract(second from duracion)) AS duracionsegundos ' +
  'FROM tiempo ORDER BY idtiempo ASC';

      //console.log(query);


  // callback
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
    'RETURNING idreporte, tipo, estatus';

    //console.log(query);
  // callback
  db.pool.query(query, (err, res) => {
    // Si el INSERT regresa un error entonces
    if (err) {
      console.log(err.stack);
        callback(0, err.stack);
    } else {
      console.log(res.rows[0])
      console.log(res.rows)
      callback(1, res);
    }
    //db.pool.end()
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

functions.activarSesionParken = function(idSesionParken, idAutomovilista, fechaFinal, monto, tiempo, idVehiculo, puntosParken, opc, callback){

  const query = {
    text: 'SELECT * FROM activate_session($1, $2, $3, $4, $5, $6, $7);',
    values: [idSesionParken, idAutomovilista, monto, tiempo, idVehiculo, puntosParken, opc],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {
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

functions.obtenerPuntosParken = function(idAutomovilista, callback){

  const query = {
    text: 'SELECT puntosparken, idautomovilista FROM automovilista WHERE idautomovilista = $1;',
    values: [idAutomovilista],
  }

  //console.log(query)
    db.pool.connect((err, client, done) => {
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

  //console.log(query)
    db.pool.connect((err, client, done) => {
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
  //console.log(query);

  //console.log(query)
    db.pool.connect((err, client, done) => {
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


// Funcíon que regresa la infromación personal de un usuario
functions.verificarEstatusSesionParken = function(idSesion, estatus, callback){

  const query = {
    text: 'SELECT * FROM sesionparken WHERE estatus = $2 AND idsesionparken = $1;',
    values: [idSesion, estatus]
    //rowMode: 'array',
  }
//console.log(query)
  db.pool.connect((err, client, done) => {
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
module.exports = functions;
