var Requests = require('../models/functions');
var Reque = {};
var schedule = require('node-schedule');

const Store = require('data-store');
const store = new Store({ path: '../config.json' });

//Variables Timers en minutos
//Timer espacio RESERVADO
var timerMinutosEspacioReservado;
var timerSegundosEspacioReservado;

var timerAux = 5;

//var fire = require('./firebase');

/*
Enviar cuando recibe una peticion
Enviar cuando envia una respuesta
Hora - Fecha: Request from: remoteAddress: Function->Data Response:
Hora - Fecha: Response to: remoteAddress: Function->Data Response:
*/
//Requests.sendNotificationTopic('automovilista', 'Hola', 'como', 'estas', 'jajaj',function(status){});
//Requests.obtenerDatosAutomovilista('10002', function(status, response){});
//Requests.sendNotificationSingle()
/*
Declarar la funcion que enviara notificiaciones
esa funcion obtendra el valor del token
despues esa misma funcion con la variable del token
enviara un token
*/
/*
jsonReporte = '{ ' +
'idreporte: ' + data.rows[0].idreporte +', ' +
'tipo: "' + data.rows[0].tipo +'", ' +
'estatus: "' + data.rows[0].estatus +'", ' +
'tiempo: "'  + data.rows[0].tiempo +'", ' +
'observacion: '  + data.rows[0].observacion +', ' +
'idautomovilista: '  + data.rows[0].automovilista_idautomovilista +', ' +
'idsupervisor: '  + data.rows[0].supervisor_idsupervisor +', ' +
'idespacioparken: '  + data.rows[0].espacioparken_idespacioparken +', ' +
'idzonaparken: ' + data.rows[0].espacioparken_zonaparken_idzonaparken + ' } ';

jsonReporte =
'"idreporte": "' + 10571 +'", ' +
'"tipo": "' + 'PAGO' +'", ' +
'"estatus": "' + 'PENDIENTE' +'", ' +
'"tiempo": "'  + '2018-11-19 12:23:52' +'", ' +
'"observacion": " ", ' +
'"idautomovilista": "' + 10002 +'", ' +
'"idsupervisor": "' + 20074 +'", ' +
'"idespacioparken": "'  + 321 +'", ' +
'"idzonaparken": "' + 18 +'"';
//Requests.androidNotificationSingle(10002, 'automovilista', 'Notificación Parken', 'Prueba', '{ "datos" : "OK", "idNotification" : "1", "title": "Notificación Parken", "msg": "Prueba"}');
console.log("Nuevo reporte");
console.log("Datos del reporte: ");
console.log(jsonReporte);
Requests.androidNotificationSingle(20074, 'supervisor', 'Nueva reporte', 'Necesitamos de tu ayuda. Revisa que sucede en el espacio Parken.', '{ "datos" : "OK", "idNotification" : "100", ' + jsonReporte+' }');

//Requests.androidNotificationSingle(20035, 'supervisor', 'Supervisor eliminado', 'Tu cuenta ha sido eliminada', '{ "datos" : "OK", "idNotification" : "200"}');
*/
//Funcionparaobtenerlos valores iniciales tambien aqui
Requests.obtenerValoresDelServer(function(status,data){

	if(status==1) {

		timerMinutosEspacioReservado = data.rows[0].duracionminutos;
		timerSegundosEspacioReservado = data.rows[0].duracionsegundos;
		//console.log('Timer espacioParkenReservado: ' + timerMinutosEspacioReservado + ':' + timerSegundosEspacioReservado);

		timerMinutosDialogParken = data.rows[1].duracionminutos;
		timerSegundosDialogParken = data.rows[1].duracionsegundos ;
		//console.log('Timer DialogParken: ' + timerMinutosDialogParken + ':' + timerSegundosDialogParken);

		timerMinutosPago = data.rows[2].duracionminutos;
		timerSegundosPago = data.rows[2].duracionsegundos;
		//console.log('Timer SegundosPago: ' + timerMinutosPago+ ':' + timerSegundosPago);

		timerMinutosCheckMove = data.rows[3].duracionminutos;
		timerSegundosCheckMove = data.rows[3].duracionsegundos;
		//console.log('Timer CheckMove: ' + timerMinutosCheckMove + ':' + timerSegundosCheckMove);

		timerMinutosMinSesionParken = data.rows[4].duracionminutos;
		timerSegundosMinSesionParken = data.rows[4].duracionsegundos;
		//console.log('Timer SesionParken: ' + timerMinutosMinSesionParken + ':' + timerSegundosMinSesionParken);

		timerMinutosTolerancia = data.rows[5].duracionminutos;
		timerSegundosTolerancia = data.rows[5].duracionsegundos;
		//console.log('Timer Tolerancia: ' + timerMinutosTolerancia + ':' + timerSegundosTolerancia);

// Ocurrió un error
	} else {
		console.log("Error al cargar los datos iniciales");
	}
});




// Función que recibe un JSON para crear una cuenta de automovilista
module.exports  = function(app) {

		app.post("/automovilista/sigIn", function(req,res){

		var nombre = req.body.nombre;
		var apellido =req.body.apellido;
		var correo = req.body.correo;
		var contrasena = req.body.contrasena;
		var celular = req.body.celular;

		Requests.crearCuentaAuto(nombre, apellido, correo, contrasena, celular, function(status,data){

		/* Respuesta JSON
		{
		success: 1
		}
		*/

		// Se ha creado exitosamente la cuenta.
		 var jsonResponse = 'null' ;
			if(status==1) {
				jsonResponse = '{success:1, id:'+data.rows[0].idautomovilista+' }';
				res.send(jsonResponse);
	  // Ocurrió un error
			} else {
				if(status ==2){
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				} else if(status == 3){
					jsonResponse = '{success:3}';
					res.send(jsonResponse);
				} else {
					jsonResponse = '{success:0}';
						res.send(jsonResponse);
				}

			}
		});

	});

	// Función que recibe un JSON para crear un vehiculo de un automovilista
			app.post("/automovilista/addCar", function(req,res){


			var marca = req.body.marca;
			var modelo =req.body.modelo;
			var placa = req.body.placa;
			var automovilista = req.body.idAutomovilista;

			Requests.crearNuevoVehiculo(automovilista, marca, modelo, placa, function(status, data){


			/* Respuesta JSON
			{
			success: 1
			}
			*/
			var jsonResponse = null;
			// Se ha creado exitosamente un vehiculo
				if(status==1) {
					jsonResponse = '{success:1, '+
					'idVehiculo:'+ data.rows[0].add_new_car_relation + '}';
					res.send(jsonResponse);
		  // Ocurrió un error
				} else {

					//Ya existe el vehiculo, pero se agregará al perfil del automovilista
					if(status ==2){
						jsonResponse = '{success:2}';
						res.send(jsonResponse);
						//Ya existe el vehiculo en la cuenta del automovilista
					} else if(status == 3){
						jsonResponse = '{success:3}';
						res.send(jsonResponse);
					} else {
						jsonResponse = '{success:0}';
							res.send(jsonResponse);
					}

				}
			});

		});

	// Función para validar el inicio de sesión
	app.post("/login", function(req,res, next){
		console.log(req.headers.origin);
		console.log(req.body);
		var correo = req.body.correo;
		var contrasena = req.body.contrasena;
		var usuario = req.body.app;

		Requests.iniciarSesion(correo, contrasena, usuario, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Existe el usuario
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
					if (data.rows[0].id != null){
							//if (data.rows[0].idautomovilista != null){


								if (data.rows[0].idautomovilista != null){
									//id
									//nombre
									//Apellido
									//Celular
									//Email
									//Contrasena
									//PuntosParken
									//estatus
									//Sexo
									//token
									 jsonResponse = '{success:1, id:'+ data.rows[0].idautomovilista + ',' +
									 'Nombre: "' + data.rows[0].nombre + '",' +
									 'Apellido: "' + data.rows[0].apellido + '",' +
									 'Email: "' + data.rows[0].email + '",' +
									 'Contrasena: "' + data.rows[0].contrasena + '",' +
									 'Celular: "' + data.rows[0].celular + '",' +
									 'PuntosParken: ' + data.rows[0].puntosparken + ',' +
									 'Estatus: "' + data.rows[0].estatus + '",' +
									 'Sexo: "' + data.rows[0].sexo + '",' +
									 'Token: "' + data.rows[0].token + '"}';

								}

								if (data.rows[0].idsupervisor != null){
									//id
									//nombre
									//Apellido
									//Celular
									//Email
									//Contrasena
									//Direccion
									//Estatus
									//Zona
									//Token
									jsonResponse = '{success:1, id:'+ data.rows[0].idsupervisor + ',' +
									'Nombre: "' + data.rows[0].nombre + '",' +
									'Apellido: "' + data.rows[0].apellido + '",' +
									'Email: "' + data.rows[0].email + '",' +
									'Contrasena: "' + data.rows[0].contrasena + '",' +
									'Celular: "' + data.rows[0].celular + '",' +
									'Direccion: "' + data.rows[0].direccion + '",' +
									'Estatus: "' + data.rows[0].estatus + '",' +
									'Zona: "' + data.rows[0].zonaparken_idzonaparken + '",' +
									'Token: "' + data.rows[0].token + '"}';
								}

								if (data.rows[0].idadministrador != null){
									jsonResponse = '{ "success":1, "id":'+ data.rows[0].idadministrador + ',' +
									'"Nombre": "' + data.rows[0].nombre + '",' +
									'"Apellido": "' + data.rows[0].apellido + '",' +
									'"Email": "' + data.rows[0].email + '",' +
									'"Contrasena": "' + data.rows[0].contrasena + '"}';
									}
								}

								var user;
								if(usuario === '1') user = 'automovilista';
								if(usuario === '2') user = 'supervisor';
								if(usuario === '3') user = 'administrador';

							console.log("El usuario " +  user + " " + data.rows[0].id  + " inició sesión");
console.log("Json response: " +jsonResponse);
							res.send(jsonResponse);
					//No existe el ususario

				}else{
					jsonResponse = '{"success":2, "id":0}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{"success":0}';
				console.log("Json response: " +jsonResponse);
				res.send(jsonResponse);
			}
		});

	});





	// Función para obtener los vehiculos registrados  del automovilista
	app.post("/automovilista/cars", function(req,res){
/*
{ "success":1,
	"Vehiculos":[
		{
			"id":130,
			"modelo":"Nissan",
			"marca":"Versa",
			"placa":"D886ACN"
		},
		{
			"id":131,
			"modelo":"Nissan",
			"marca":"Versa",
			"placa":"DT6ACN"
		}
	]
}

*/

		var idAutomovilista = req.body.idAutomovilista;
		var jeison;
		Requests.obtenerVehiculosAutomovilista(idAutomovilista, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
							//if (data.rows[0].idautomovilista != null){
							jeison = '{ "success": 1, ' +
							'"vehiculosNumber":"' + data.rowCount + '",'+
							'"Vehiculos":[';
							for(var i = 0; i < data.rowCount; i++){

								jeison = jeison +
								'{ "id":' + data.rows[i].id + ', ' +
								'"marca":"' + data.rows[i].marca + '", ' +
								'"modelo":"' + data.rows[i].modelo + '", ' +
								'"placa":"' + data.rows[i].placa + '"';
								if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
							}
							jeison = jeison + '] }';
							jsonResponse = jeison;
							console.log(jsonResponse);
							res.send(jsonResponse);
							/*res.send('{success:1, id:'+data.rows[0].idautomovilista+', '+

							'nombre:'+data.rows[0].nombre+', '+
							'apellido:'+data.rows[0].apellido+', '+
							'email:'+data.rows[0].email+', '+
							'password:'+data.rows[0].contrasena+', '+
							'celular:'+data.rows[0].celular+', '+
							'puntos:'+data.rows[0].puntosparken+'}');*/

					//No existe el ususario

				}else{
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});


	// Función para obtener el id del vehiculo
	app.post("/supervisor/obtenerIdVehiculo", function(req,res){
		var placa = req.body.placa;
		var jeison;
		Requests.obtenerIdVehiculo(placa, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
							//if (data.rows[0].idautomovilista != null){
							jeison = '{ success: 1, ' +
								'"id":' + data.rows[0].idvehiculo + ', ' +
								'"marca":"' + data.rows[0].marca + '", ' +
								'"modelo":"' + data.rows[0].modelo + '", ' +
								'"placa":"' + data.rows[0].placa + '"}';

				}else {
					jeison = '{success:2}';

				}
				jsonResponse = jeison;
				res.send(jsonResponse);

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para obtener todos los administradores del sistema
	app.get("/administrador/obtenerAdministradores", function(req,res){

		var jeison;
		Requests.obtenerAdministradores(function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){

					jeison = '[ ';

					for(var i = 0; i < data.rowCount; i++){

						jeison = jeison + '{ ' +
								'"id":' + data.rows[i].idadministrador + ', ' +
								'"nombre":"' + data.rows[i].nombre + '", ' +
								'"apellido":"' + data.rows[i].apellido + '", ' +
								'"correo":"' + data.rows[i].email + '", ' +
								'"contrasena":"' + data.rows[i].contrasena + '"}';

								if(i === data.rowCount - 1){
									jeison = jeison + ']';
								}else{
									jeison = jeison + ', ';
								}
					}

				}else {
					jeison = '{"success":2}';

				}
				jsonResponse = jeison;
				res.send(jsonResponse);

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{"success":0}';
				res.send(jsonResponse);
			}
		});

	});

// Función para verificar que el administrador todavia existe en el sistema
app.get("/administrador/verificarAdministrador", function(req,res, next){

	console.log("From: " + req.headers.origin);
	var jeison;
	var administrador = req.query.administrador;
	if(administrador){
	Requests.verificarAdministrador(administrador, function(status, data){

		var jsonResponse = null;
		// Consuta generada con éxito
		if(status==1) {
			//Primero validamos si data nos devuelve un registros
			if(data.rowCount != 0){
				jeison ='{ "success": 1, ' +
						'"id":' + data.rows[0].idadministrador + ', ' +
						'"nombre":"' + data.rows[0].nombre + '", ' +
						'"apellido":"' + data.rows[0].apellido + '", ' +
						'"correo":"' + data.rows[0].email + '", ' +
						'"contrasena":"' + data.rows[0].contrasena + '"}';

			}else {
				jeison = '{"success":2}';

			}
			jsonResponse = jeison;
			console.log("Json Response: " +jsonResponse);
			res.send(jsonResponse);

	// Error con la conexion a la bd
		} else {
			console.log("Json Response: " +jsonResponse);
			jsonResponse = '{"success":0}';
			res.send(jsonResponse);
		}
	});
}else{
	return next();
}
});


// Función para verificar que el administrador todavia existe en el sistema
app.post("/supervisor/verificarSupervisor", function(req,res, next){

	console.log("From: " + req.headers.origin);
	var jeison;
	var supervisor = req.body.idSupervisor;
	console.log(supervisor);
	if(supervisor){
	Requests.verificarSupervisor(supervisor, function(status, data){

		var jsonResponse = null;
		// Consuta generada con éxito
		if(status==1) {
			//Primero validamos si data nos devuelve un registros
			if(data.rowCount != 0){

				jeison ='{ "success": 1, ' +
						'"id":' + data.rows[0].idadministrador + ', ' +
						'"nombre":"' + data.rows[0].nombre + '", ' +
						'"apellido":"' + data.rows[0].apellido + '", ' +
						'"correo":"' + data.rows[0].email + '", ' +
						'"celular":"' + data.rows[0].celular + '", ' +
						'"token":"' + data.rows[0].token + '", ' +
						'"contrasena":"' + data.rows[0].contrasena + '"}';

			}else {
				jeison = '{"success":2}';

			}
			jsonResponse = jeison;
			console.log("Json Response: " +jsonResponse);
			res.send(jsonResponse);

	// Error con la conexion a la bd
		} else {
			console.log("Json Response: " +jsonResponse);
			jsonResponse = '{"success":0}';
			res.send(jsonResponse);
		}
	});
}else{
	return next();
}
});


// Función para obtener todos los administradores del sistema
app.post("/administrador/agregarAdministrador", function(req,res){

	var nombre = req.body.nombre;
	var apellido = req.body.apellido;
	var correo = req.body.correo;
	var contrasena = req.body.contrasena;

	var jeison;
	Requests.agregarAdministrador(nombre, apellido, correo, contrasena,function(status, data){

		var jsonResponse = null;
		// Consuta generada con éxito
		if(status==1) {
			//Primero validamos si data nos devuelve un registros
			if(data.rowCount != 0){

					jeison = '{ "success": 1, ' +
							'"id":' + data.rows[0].idadministrador + ', ' +
							'"nombre":"' + data.rows[0].nombre + '", ' +
							'"apellido":"' + data.rows[0].apellido + '", ' +
							'"correo":"' + data.rows[0].email + '", ' +
							'"contrasena":"' + data.rows[0].contrasena + '"}';
			}else {
				jeison = '{"success":2}';

			}
			jsonResponse = jeison;
			res.send(jsonResponse);

	// Error con la conexion a la bd
		} else {
				jsonResponse = '{"success":0, ' +
				'"error": ' + data +
				' }';
				console.log(jsonResponse);
			res.send(jsonResponse);
		}
	});

});

// Función para obtener todos los administradores del sistema
app.post("/administrador/agregarSupervisor", function(req,res){

	console.log(req.body);
	var nombre = req.body.nombre;
	var apellido = req.body.apellido;
	var correo = req.body.correo;
	var contrasena = req.body.contrasena;
	var celular = req.body.celular;
	var direccion = req.body.direccion;
	var estatus = req.body.estatus;
	var zona = req.body.zona;

	var jeison;
	Requests.agregarSupervisor(nombre, apellido, correo, contrasena, celular, direccion, estatus, zona, function(status, data){

		var jsonResponse = null;
		// Consuta generada con éxito
		if(status==1) {
			//Primero validamos si data nos devuelve un registros
			if(data.rowCount != 0){

					jeison = '{ "success": 1, ' +
							'"id":' + data.rows[0].idsupervisor + ', ' +
							'"nombre": "' + data.rows[0].nombre + '", ' +
							'"apellido":"' + data.rows[0].apellido + '", ' +
							'"email":"' + data.rows[0].email + '", ' +
							'"contrasena":"' + data.rows[0].contrasena + '", ' +
							'"celular":"' + data.rows[0].celular + '", ' +
							'"direccion":"' + data.rows[0].direccion + '", ' +
							'"estatus":"' + data.rows[0].estatus + '", ' +
							'"zonaparken":' + data.rows[0].zonaparken_idzonaparken + ' }';

			}else {
				jeison = '{"success":2}';

			}
			jsonResponse = jeison;
			res.send(jsonResponse);

	// Error con la conexion a la bd
		} else {
				jsonResponse = '{ "success" : 0, ' +
				'"error": "' + data + '" }';
				console.log(jsonResponse);
			res.send(jsonResponse);
		}
	});

});


// Función para agregar zonas Parken
app.post("/administrador/agregarZonaParken", function(req,res){

	//console.log(req.body);
	var nombreZona = req.body.nombre;
	var estatusZona = req.body.estatus;
	var precioZona = req.body.precio;
	var coordenadasZona = req.body.coordenadasPoly;
	var coordenadasEspacios = req.body.coodenadasMarker;

	var jeison;

	var coordenadaZ = '';
	for(var i = 0; i < coordenadasZona.length; i++){
		coordenadaZ = coordenadaZ + coordenadasZona[i].lng + ' ' + coordenadasZona[i].lat;

		//Vamos a armar el string de la siguinte forma
		//'lat0 lng0, lat1 lng1, lat2 lng2,'
		if(i != coordenadasZona.length - 1) {
			coordenadaZ = coordenadaZ + ',';
		}
	}

	var coordenadaE = '';
	for(var i = 0; i < coordenadasEspacios.length; i++){
		coordenadaE = coordenadaE + coordenadasEspacios[i].coordinates.lng + ' ' + coordenadasEspacios[i].coordinates.lat;

		//Vamos a armar el string de la siguinte forma
		//'lat0 lng0, lat1 lng1, lat2 lng2,'
		if(i != coordenadasEspacios.length - 1) {
			coordenadaE = coordenadaE + ',';
		}
	}

	//console.log(coordenadaZ);
	//console.log(coordenadaE);


	Requests.agregarZonaParken(nombreZona, coordenadaZ, coordenadaE, estatusZona, precioZona, function(status, data){

		var jsonResponse = null;
		// Consuta generada con éxito
		if(status === 1) {
			//Primero validamos si data nos devuelve un registros
			if(data.rowCount != 0){
					var zonita = data.rows[0].idzonaparken;

					Requests.agregarEspacioAZonaParken(coordenadaE, data.rows[0].idzonaparken, function(status, data){
						if(status === 1){
							console.log("se agregaron los espacios");
							jeison = '{ "success": 1, "idzonaparken": '+ zonita +'}';
							jsonResponse = jeison;
							console.log(jsonResponse);
							res.send(jsonResponse);
						}else{
							jeison = '{"success":4}';
							jsonResponse = jeison;
							console.log(jsonResponse);
							res.send(jsonResponse);
						}
					});
					
			}else {
				jeison = '{"success":2}';
				jsonResponse = jeison;
				console.log(jsonResponse);
				res.send(jsonResponse);
			}

			
	// Error con la conexion a la bd
		} else {

			if(status == 6){
				jsonResponse = '{"success":6, ' +
				'"error": "name_duplicate" }';
			}else{
				if(status == 7){
					jsonResponse = '{"success":7, ' +
					'"error": "zone_intersects" }';
				}else{
					jsonResponse = '{"success":0, ' +
					'"error": ' + data +
					' }';
				}
			}

			//console.log(jsonResponse);
			res.send(jsonResponse);
		}
	});

});

	// Función para obtener la informacion de una zona Parken incluidas los espacios Parken
	app.post("/administrador/obtenerInfoZonaParken", function(req,res){
		/*
		{ "success":1,
		"Zonas": 3,
		"ZonasParken":[
			{
				"id":130,
				"nombre":"Nissan",
				"distancia":"Versa",
				"estatus":"D886ACN",
				"centro": [ {
						"latitud": -99.0,
						"longitud": 12.34 } ],
				"coordenadas":[
						{
							"latitud":-99.90,
							"longitud":12.09
						},
						{
							"latitud":-99.90,
							"longitud":12.09
						},
						{
							"latitud":-99.90,
							"longitud":12.09
						}
				]
			},
			{
				"id":130,
				"nombre":"Nissan",
				"distancia":"Versa",
				"estatus":"D886ACN",
				"centro": [ {
						"latitud": -99.0,
						"longitud": 12.34 } ],
				"coordenadas":[
						{
							"latitud":-99.90,
							"longitud":12.09
						},
						{
							"latitud":-99.90,
							"longitud":12.09
						},
						{
							"latitud":-99.90,
							"longitud":12.09
						}
				]
			}
		]
		}

		*/
			var jeison;
			var latitud = req.body.latitud;
			var longitud	 = req.body.longitud;
			var distancia	 = req.body.distancia;

			//console.log(req);

			Requests.buscarZonaParken(latitud, longitud, distancia, function(status, data){

				var jsonResponse = null;
				// Consuta generada con éxito
				if(status==1) {
					//Primero validamos si data nos devuelve un registros
					if(data.rowCount != 0){
								//if (data.rows[0].idautomovilista != null){

								jeison = '{ "success":1, ' +
								'"Zonas":' + data.rowCount + ', ' +
								'"ZonasParken":[';

								for(var i = 0; i < data.rowCount; i++){

									var ini = "POINT(".length;
									var f = data.rows[i].centro.length - 1;
									var coordenadasCentro = data.rows[i].centro.substring(ini, f)
									var centroArray = coordenadasCentro.split(" ");

									jeison = jeison +
									'{ "id":' + data.rows[i].idzonaparken + ', ' +
									'"nombre": "' + data.rows[i].nombre + '", ' +
									'"distancia":' + data.rows[i].distancia + ', ' +
									'"estatus":"' + data.rows[i].estatus + '", ' +
									'"precio":' + data.rows[i].precio + ', ' +
									'"radio":"' + data.rows[i].radio +'",' +
									'"centro": [ {' +
									'"latitud":' + centroArray[0] + ', ' +
									'"longitud":' + centroArray[1] + ' } ]' + ', ' +
									'"coordenadas":[';



									//Obtenemos solo las coordenadas
									//var inicio = length("POLYGON((");
									var inicio = "POLYGON((".length;
									var fin = data.rows[i].poligono.length - 2;
									var coordenadas = data.rows[i].poligono.substring(inicio, fin)
									var coordenadasArray = coordenadas.split(",")
									/*Hasta este punto ya tenemos algo asi:
									coordenadasArray[0]= "-99.0 12.09"
									coordenadasArray[1]= "-99.0 12.09"
									coordenadasArray[2]= "-99.0 12.09"
									*/
									for(var j = 0; j < coordenadasArray.length; j++){
										var coorArray = coordenadasArray[j].split(" ");
										//Ahora solo tenemos 2 elementos en el array que se unirán al JSON
										jeison = jeison + '{ ' +
										'"latitud":' + coorArray[0] + ', ' +
										'"longitud":' + coorArray[1];

										if(j == coordenadasArray.length - 1){	jeison = jeison + ' } ]'; } else { jeison = jeison + ' },'; }
									}

									if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
								}
								jeison = jeison + '] }';
								jsonResponse = jeison;
								//console.log(jsonResponse);
								res.send(jsonResponse);

						//No existe el ususario

					}else{
						jsonResponse = '{"success":2, "Zonas": 0}';
						res.send(jsonResponse);
					}

			// Error con la conexion a la bd
				} else {
					jsonResponse = '{"success":0}';
					res.send(jsonResponse);
				}
			});

		});



	// Función para buscar si existen zonas parken cercanas a un punto geografico.
	app.post("/automovilista/buscarZonaParken", function(req,res){
	/*
	{ "success":1,
	"Zonas": 3,
	"ZonasParken":[
		{
			"id":130,
			"nombre":"Nissan",
			"distancia":"Versa",
			"estatus":"D886ACN",
			"centro": [ {
					"latitud": -99.0,
					"longitud": 12.34 } ],
			"coordenadas":[
					{
						"latitud":-99.90,
						"longitud":12.09
					},
					{
						"latitud":-99.90,
						"longitud":12.09
					},
					{
						"latitud":-99.90,
						"longitud":12.09
					}
			]
		},
		{
			"id":130,
			"nombre":"Nissan",
			"distancia":"Versa",
			"estatus":"D886ACN",
			"centro": [ {
					"latitud": -99.0,
					"longitud": 12.34 } ],
			"coordenadas":[
					{
						"latitud":-99.90,
						"longitud":12.09
					},
					{
						"latitud":-99.90,
						"longitud":12.09
					},
					{
						"latitud":-99.90,
						"longitud":12.09
					}
			]
		}
	]
	}

	*/
		var jeison;
		var latitud = req.body.latitud;
		var longitud	 = req.body.longitud;
		var distancia	 = req.body.distancia;

		//console.log(req);

		Requests.buscarZonaParken(latitud, longitud, distancia, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
							//if (data.rows[0].idautomovilista != null){

							jeison = '{ "success":1, ' +
							'"Zonas":' + data.rowCount + ', ' +
							'"ZonasParken":[';

							for(var i = 0; i < data.rowCount; i++){

								var ini = "POINT(".length;
								var f = data.rows[i].centro.length - 1;
								var coordenadasCentro = data.rows[i].centro.substring(ini, f)
								var centroArray = coordenadasCentro.split(" ");

								jeison = jeison +
								'{ "id":' + data.rows[i].idzonaparken + ', ' +
								'"nombre": "' + data.rows[i].nombre + '", ' +
								'"distancia":' + data.rows[i].distancia + ', ' +
								'"estatus":"' + data.rows[i].estatus + '", ' +
								'"precio":' + data.rows[i].precio + ', ' +
								'"radio":"' + data.rows[i].radio +'",' +
								'"centro": [ {' +
								'"latitud":' + centroArray[0] + ', ' +
								'"longitud":' + centroArray[1] + ' } ]' + ', ' +
								'"coordenadas":[';



								//Obtenemos solo las coordenadas
								//var inicio = length("POLYGON((");
								var inicio = "POLYGON((".length;
								var fin = data.rows[i].poligono.length - 2;
								var coordenadas = data.rows[i].poligono.substring(inicio, fin)
								var coordenadasArray = coordenadas.split(",")
								/*Hasta este punto ya tenemos algo asi:
								coordenadasArray[0]= "-99.0 12.09"
								coordenadasArray[1]= "-99.0 12.09"
								coordenadasArray[2]= "-99.0 12.09"
								*/
								for(var j = 0; j < coordenadasArray.length; j++){
									var coorArray = coordenadasArray[j].split(" ");
									//Ahora solo tenemos 2 elementos en el array que se unirán al JSON
									jeison = jeison + '{ ' +
									'"latitud":' + coorArray[0] + ', ' +
									'"longitud":' + coorArray[1];

									if(j == coordenadasArray.length - 1){	jeison = jeison + ' } ]'; } else { jeison = jeison + ' },'; }
								}

								if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
							}
							jeison = jeison + '] }';
							jsonResponse = jeison;
							//console.log(jsonResponse);
							res.send(jsonResponse);

					//No existe el ususario

				}else{
					jsonResponse = '{"success":2, "Zonas": 0}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{"success":0}';
				res.send(jsonResponse);
			}
		});

	});

// Función para buscar si existen zonas parken cercanas a un punto geografico.
app.get("/administrador/obtenerZonasParkenID", function(req,res){

	Requests.buscarTodasZonasParkenID(function(status, data){

		var jsonResponse = null;
		var jeison;
		// Consuta generada con éxito
		if(status==1) {
			//Primero validamos si data nos devuelve un registros
			if(data.rowCount != 0){
						//if (data.rows[0].idautomovilista != null){

						jeison = '{ "success":1, ' +
						'"numerozonas":' + data.rowCount + ', ' +
						'"zonasParken":[';

						for(var i = 0; i < data.rowCount; i++){

							jeison = jeison +
							'{ "id":' + data.rows[i].idzonaparken + ', ' +
							'"nombre": "' + data.rows[i].nombre + '"} ';

							if(i != data.rowCount - 1){	jeison = jeison + ', '; }

						}
						jeison = jeison + '] }';
						jsonResponse = jeison;
						res.send(jsonResponse);

			}else{
				jsonResponse = '{"success":2, "numerozonas": 0}';
				res.send(jsonResponse);
			}

	// Error con la conexion a la bd
		} else {
			jsonResponse = '{"success":0}';
			res.send(jsonResponse);
		}
	});
});



// Función para buscar si existen zonas parken cercanas a un punto geografico.
app.get("/administrador/obtenerZonasParken", function(req,res){

Requests.buscarTodasZonasParken(function(status, data){

	var jsonResponse = null;
	var jeison;
	// Consuta generada con éxito
	if(status==1) {
		//Primero validamos si data nos devuelve un registros
		if(data.rowCount != 0){
					//if (data.rows[0].idautomovilista != null){

					jeison = '{ "success":1, ' +
					'"Zonas":' + data.rowCount + ', ' +
					'"ZonasParken":[';

					var aidi = 0;

					for(var i = 0; i < data.rowCount; i++){

						if(aidi != data.rows[i].idzonaparken){
							//Si son diferentes, entonces agregamos al jeison el nuevo header con la info
							if(aidi != 0){
								jeison = jeison + ']}, ';
							}

							var ini = "POINT(".length;
						var f = data.rows[i].centro.length - 1;
						var coordenadasCentro = data.rows[i].centro.substring(ini, f)
						var centroArray = coordenadasCentro.split(" ");

						jeison = jeison +
						'{ "id":' + data.rows[i].idzonaparken + ', ' +
						'"nombre": "' + data.rows[i].nombre + '", ' +
						'"estatus":"' + data.rows[i].estatus + '", ' +
						'"precio":' + data.rows[i].precio + ', ' +
						'"centro": [ {' +
						'"lat":' + centroArray[1] + ', ' +
						'"lng":' + centroArray[0] + ' } ]' + ', ' +
						'"coordenadas":[';

						//Obtenemos solo las coordenadas
						//var inicio = length("POLYGON((");
						var inicio = "POLYGON((".length;
						var fin = data.rows[i].poligono.length - 2;
						var coordenadas = data.rows[i].poligono.substring(inicio, fin)
						var coordenadasArray = coordenadas.split(",")

						for(var j = 0; j < coordenadasArray.length; j++){
							var coorArray = coordenadasArray[j].split(" ");
							//Ahora solo tenemos 2 elementos en el array que se unirán al JSON
							jeison = jeison + '{ ' +
							'"lat":' + coorArray[1] + ', ' +
							'"lng":' + coorArray[0];

							if(j == coordenadasArray.length - 1){	jeison = jeison + ' } ]'; } else { jeison = jeison + ' },'; }
						}
						//Como es el header agregamos el subheader de espacio parken
						ini = "POINT(".length;
						f = data.rows[i].ubicacionespacioparken.length - 1;
						coordenadasEP = data.rows[i].ubicacionespacioparken.substring(ini, f);
						centroArray = coordenadasEP.split(" ");
						jeison = jeison + ', "espaciosParken": [{ "idespacio":'+ data.rows[i].idespacioparken+', "coordinates": { "lat":' + centroArray[1] +', "lng":' + centroArray[0]+'}}';
						}else{
							//Si son iguales unicamente agregamos la coordenada del espacio Parken
						var ini = "POINT(".length;
						var f = data.rows[i].ubicacionespacioparken.length - 1;
						var coordenadasEP = data.rows[i].ubicacionespacioparken.substring(ini, f)
						var centroArray = coordenadasEP.split(" ");
						jeison = jeison + ', { "idespacio":'+ data.rows[i].idespacioparken+', "coordinates": { "lat":' + centroArray[1] +' , "lng":' + centroArray[0]+'}}';

						}

	//					', "espaciosParken": ['
					//Debemos agregar un array que diga
					//"espacios Parken"
					/*
					"espaciosParken":{
						{ coordinates: {
							lat:0 lng:0
							}
						},
						{ coordinates: {
							lat:0 lng:0
							}
						},
						{ coordinates: {
							lat:0 lng:0
							}
						}
					}
					*/


						if(i == data.rowCount - 1){	jeison = jeison + ']}'; } /*else { jeison = jeison + ' },'; }*/
						aidi = data.rows[i].idzonaparken;
					}
					jeison = jeison + '] }';
					jsonResponse = jeison;
					//console.log(jsonResponse);
					res.send(jsonResponse);


			//No existe el ususario

		}else{
			jsonResponse = '{"success":2, "Zonas": 0}';
			console.log(jsonResponse);
			res.send(jsonResponse);
		}

// Error con la conexion a la bd
	} else {
		jsonResponse = '{"success":0}';
		console.log(jsonResponse);
		res.send(jsonResponse);
	}
});

});

// Función para obtener la información de los supervisores por zona
app.get("/administrador/obtenerSupervisoresXZona", function(req,res){

	//console.log(req);
	var idZona = req.query.idzona;

	//console.log(idZona);

	Requests.obtenerSupervisoresXZona(idZona, function(status, data){

		var jsonResponse = null;
		var jeison;
		// Consuta generada con éxito
		if(status==1) {
			//Primero validamos si data nos devuelve un registros
			if(data.rowCount != 0){

				jeison = '{ "success":1, ' +
				'"numerosupervisores":' + data.rowCount + ', ' +
				'"supervisores":[';

				for(var i = 0; i < data.rowCount; i++){
						jeison = jeison +
						'{ "id":' + data.rows[i].idsupervisor + ', ' +
						'"nombre": "' + data.rows[i].nombresupervisor + '", ' +
						'"apellido":"' + data.rows[i].apellido + '", ' +
						'"email":"' + data.rows[i].email + '", ' +
						'"contrasena":"' + data.rows[i].contrasena + '", ' +
						'"celular":"' + data.rows[i].celular + '", ' +
						'"direccion":"' + data.rows[i].direccion + '", ' +
						'"estatus":"' + data.rows[i].estatus + '", ' +
						'"zonaparken":' + data.rows[i].zonaparken_idzonaparken + ', ' +
						'"nombrezonaparken":"' + data.rows[i].nombrezona + '", ' +
						'"token":"' + data.rows[i].token + '"} ';

					if(i != data.rowCount - 1){	jeison = jeison + ', ';}
				}

				jeison = jeison + '] }';
				jsonResponse = jeison;
				//console.log(jsonResponse);
				res.send(jsonResponse);

			}else{
				jsonResponse = '{"success":2, "numerosupervisores": 0, "supervisores":[{}]}';
				console.log(jsonResponse);
				res.send(jsonResponse);
			}

	// Error con la conexion a la bd
		} else {
			jsonResponse = '{ "success" : 0 }';
			console.log(jsonResponse);
			res.send(jsonResponse);
		}
	});

});



	// Función para buscar si existen zonas parken cercanas a un punto geografico.
	app.post("/obtenerZonasParken", function(req,res){

		var jeison;
		var idZona = req.body.zonaParken;

		Requests.obtenerZonasParken(idZona, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
							//if (data.rows[0].idautomovilista != null){

							jeison = '{ success : 1, ' +
							'zonas :' + data.rowCount + ', ' +
							'zonasparken : [';

							for(var i = 0; i < data.rowCount; i++){

								var ini = "POINT(".length;
								var f = data.rows[i].centro.length - 1;
								var coordenadasCentro = data.rows[i].centro.substring(ini, f)
								var centroArray = coordenadasCentro.split(" ");

								jeison = jeison +
								'{ idzonaparken:' + data.rows[i].idzonaparken + ', ' +
								'nombre: "' + data.rows[i].nombre + '", ' +
								'estatus: "' + data.rows[i].estatus + '", ' +
								'precio:' + data.rows[i].precio + ', ' +
								'centro: [ {' +
								'latitud:' + centroArray[0] + ', ' +
								'longitud:' + centroArray[1] + ' } ]' + ', ' +
								'coordenadas:[';



								//Obtenemos solo las coordenadas
								//var inicio = length("POLYGON((");
								var inicio = "POLYGON((".length;
								var fin = data.rows[i].poligono.length - 2;
								var coordenadas = data.rows[i].poligono.substring(inicio, fin)
								var coordenadasArray = coordenadas.split(",")
								/*Hasta este punto ya tenemos algo asi:
								coordenadasArray[0]= "-99.0 12.09"
								coordenadasArray[1]= "-99.0 12.09"
								coordenadasArray[2]= "-99.0 12.09"
								*/
								for(var j = 0; j < coordenadasArray.length; j++){
									var coorArray = coordenadasArray[j].split(" ");
									//Ahora solo tenemos 2 elementos en el array que se unirán al JSON
									jeison = jeison + '{ ' +
									'latitud:' + coorArray[0] + ', ' +
									'longitud:' + coorArray[1];

									if(j == coordenadasArray.length - 1){	jeison = jeison + ' } ]'; } else { jeison = jeison + ' },'; }
								}

								if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
							}
							jeison = jeison + '] }';
							jsonResponse = jeison;
							res.send(jsonResponse);

					//No existe el ususario

				}else{
					jsonResponse = '{ success: 2, zonas: 0 }';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{ success : 0 }';
				res.send(jsonResponse);
			}
		});

	});

	// Función para buscar si existen zonas parken cercanas a un punto geografico.
	app.post("/automovilista/mostrarEspaciosParken", function(req,res){
	/*
	{ "success":1,
	"Espacios": 3,
	"EspaciosParken":[
		{
			"id":130,
			"estatus":"D886ACN",
			"zona": 4,
			"cordenadas": [ {
					"latitud": -99.0,
					"longitud": 12.34 } ]
		},
		{ "success":1,
		"Espacios": 3,
		"EspaciosParken":[
			{
				"id":130,
				"estatus":"D886ACN",
				"zona": 4,
				"cordenadas": [ {
						"latitud": -99.0,
						"longitud": 12.34 } ]
			}
	]
	}

	*/
		var jeison;
		var latitud = req.body.latitud;
		var longitud	 = req.body.longitud;
		var distancia	 = req.body.distancia;

		Requests.espaciosParken(latitud, longitud, distancia, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
							//if (data.rows[0].idautomovilista != null){

							jeison = '{ "success":1, ' +
							'"Espacios":' + data.rowCount + ', ' +
							'"EspaciosParken":[';
							var ini = "POINT(".length;

							for(var i = 0; i < data.rowCount; i++){


								var f = data.rows[i].coordenada.length - 1;
								var coordenadasCentro = data.rows[i].coordenada.substring(ini, f)
								var centroArray = coordenadasCentro.split(" ");

								jeison = jeison +
								'{ "id":' + data.rows[i].idespacioparken + ', ' +
								'"estatus":"' + data.rows[i].estatus + '", ' +
								'"zonaparken":' + data.rows[i].zonaparken + ', ' +
								'"coordenada": [ {' +
								'"latitud":' + centroArray[0] + ', ' +
								'"longitud":' + centroArray[1] + ' } ]';

								if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
							}
							jeison = jeison + '] }';
							jsonResponse = jeison;
							res.send(jsonResponse);

					//No existe el ususario

				}else{
					jsonResponse = '{"success":2, "Espacios": 0}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{"success":0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para buscar si existen zonas parken cercanas a un punto geografico.
	app.post("/automovilista/buscarEspacioParken", function(req,res){
		//console.log("JSON Request: ");
		//console.log(req.body);
		var jeison;
		var latitud = req.body.latitud;
		var longitud = req.body.longitud;
		var distancia = req.body.distancia;
		var idAuto = req.body.idAutomovilista.toString();

    Requests.buscarEspacioParken(latitud, longitud, distancia, function(status, data){
		var jsonResponse = null;
		if(status === 1) {
		  if(data.rowCount != 0){
			var ini = "POINT(".length;
			var f = data.rows[0].coordenada.length - 1;
			var coordenadasCentro = data.rows[0].coordenada.substring(ini, f);
			var centroArray = coordenadasCentro.split(" ");
				jeison = '{ "success":1, ' +
					'"id":' + data.rows[0].idespacioparken + ', ' +
					'"zona":' + data.rows[0].zonaparken + ', ' +
					'"nombrezona":"' + data.rows[0].nombrezona + '", ' +
					'"direccion":"' + data.rows[0].direccion + '", ' +
					'"coordenada": [ {' +
						'"latitud":' + centroArray[1] + ', ' +
						'"longitud":' + centroArray[0] + '} ] }';
	
				  if(store.hasOwn(idAuto)){
					  //console.log("HAsOWn");
					if(store.get(idAuto) != data.rows[0].idespacioparken.toString()){
						//console.log("Sending NOtificaction");
					  Requests.androidNotificationSingle(idAuto, 
						'automovilista', 'Nuevo espacio Parken', 
						'El espacio '+ data.rows[0].idespacioparken.toString() + 
						' ahora es el más cercano a tu destino.', 
						'{ "datos" : "OK", "idNotification" : "200", "espacioParken" : "' 
						+ data.rows[0].idespacioparken.toString() + '" }');
					}
					//console.log("Nothing");
					store.set(idAuto, data.rows[0].idespacioparken.toString());
				  }else {
					//console.log("Lovely");
					store.set(idAuto, data.rows[0].idespacioparken.toString());
				  }
				  jsonResponse = jeison;
				  //console.log("Respuesta JSON: " + jsonResponse);
				  res.send(jsonResponse);
				  
		  }else{
			//NO hay espacios Parken Disponible
			jsonResponse = '{"success":2}';

			if(store.hasOwn(idAuto)){
				//console.log("HAsOWn");
			  if(store.get(idAuto) != "0"){
				  //console.log("Sending NOtificaction");
				Requests.androidNotificationSingle(idAuto, 
				  'automovilista', 'Espacios Parken no disponibles', 
				  'No hay espacios Parken disponibles', 
				  '{"datos": "OK", "idNotification": "1", "title": "Espacios Parken no disponibles", "msg": "No te preocupess, te notificaremos cuando un espacio este disponible."}');
			  }
			  //console.log("Nothing");
			  store.set(idAuto, "0");
			}else {
			  //console.log("Lovely");
			  store.set(idAuto,"0");
			}

			res.send(jsonResponse);
			//console.log("Respuesta JSON: " + jsonResponse);
		  }
	  // Error con la conexion a la bd
		} else {
		  jsonResponse = '{"success":0}';
		  res.send(jsonResponse);
		  //console.log("Respuesta JSON: " + jsonResponse);
		}
	  });
	});

/*
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
								'"direccion": "' + data.rows[0].direccion + '", ' +
								'"coordenada": [ {' +
								'"latitud":' + centroArray[0] + ', ' +
								'"longitud":' + centroArray[1] + '} ] }';

								jsonResponse = jeison;
							res.send(jsonResponse);



				}else{
					//NO hay espacios Parken Disponible
					jsonResponse = '{"success":2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{succes:0}';
				res.send(jsonResponse);
			}
		});
*/
	

	// Función para obtener los datos del automovilista
	app.post("/automovilista/data", function(req,res){


		//
		var idAutomovilista = req.body.idAutomovilista;

		Requests.obtenerDatosAutomovilista(idAutomovilista, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Existe el usuario
				//Primero validamos si data nos devuelve un registros

				if(data.rowCount != 0){
					if (data.rows[0].idautomovilista != null){
							//if (data.rows[0].idautomovilista != null){
							jsonResponse ='{success:1, id:'+data.rows[0].idautomovilista+', '+
							'nombre:"'+data.rows[0].nombre+'", '+
							'apellido:"'+data.rows[0].apellido+'", '+
							'email:'+data.rows[0].email+', '+
							'password:'+data.rows[0].contrasena+', '+
							'celular:"'+data.rows[0].celular+'", '+
							'puntos:'+data.rows[0].puntosparken+'}';
							res.send(jsonResponse);

					//No existe el ususario
					}
				}else{
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{succes:0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para obtener los datos del supervisor
	app.post("/supervisor/data", function(req,res){


		//
		var idSupervisor = req.body.idSupervisor;

		Requests.obtenerDatosSupervisor(idSupervisor, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Existe el usuario
				//Primero validamos si data nos devuelve un registros

				if(data.rowCount != 0){
					if (data.rows[0].idsupervisor != null){
							//if (data.rows[0].idautomovilista != null){
							jsonResponse ='{"success":1, ' +
							'"idSupervisor":"' + data.rows[0].idsupervisor + '", ' +
							'"Nombre": "' + data.rows[0].nombre + '", ' +
							'"Apellido": "' + data.rows[0].apellido + '", ' +
							'"Email": "' + data.rows[0].email + '", ' +
							'"Contrasena": "' + data.rows[0].contrasena + '", ' +
							'"Celular": "' + data.rows[0].celular + '", ' +
							'"Direccion": "' + data.rows[0].direccion + '", ' +
							'"Estatus": "'+ data.rows[0].estatus + '", ' +
							'"Zona": "' + data.rows[0].zonaparken_idzonaparken + '", ' +
							'"NombreZona": "' + data.rows[0].nombrezona + '", ' +
							'"Token": "' + data.rows[0].token + '" ' +
							'}';
							res.send(jsonResponse);

					//No existe el ususario
					}
				}else{
					jsonResponse = '{"success":2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{"success":0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para verificar si ya existe registrado un correo o número celular
	app.post("/automovilista/verificarDatos", function(req,res){


		//
		var tipo = req.body.tipo;
		var credencial = req.body.credencial;

		Requests.validarCredencial(tipo, credencial, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Existe un usuario con la credencial|
				if(data.rowCount != 0){
					jsonResponse = '{success:1, '+
					'id: "' + data.rows[0].idautomovilista + '", ' +
					'Nombre: "' + data.rows[0].nombre + '", ' +
					'Apellido: "' + data.rows[0].apellido + '", ' +
					'Email: "' + data.rows[0].email + '", ' +
					'Contrasena: "' + data.rows[0].contrasena + '", ' +
					'Celular: "' + data.rows[0].celular + '", ' +
					'Puntos: "' + data.rows[0].puntosparken + '", ' +
					'Estatus: "' + data.rows[0].estatus  + '"} ';

					res.send(jsonResponse);
					//No existe un usuario con esa credencial
					}else{
						jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para verificar si ya existe registrado un correo o número celular
	app.post("/supervisor/verificarDatos", function(req,res){


		var tipo = req.body.tipo;
		var credencial = req.body.credencial;

		Requests.validarCredencialSupervisor(tipo, credencial, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Existe un usuario con la credencial|
				if(data.rowCount != 0){
					jsonResponse = '{success:1, ' +
						'idSupervisor:"' + data.rows[0].idsupervisor + '", ' +
						'Nombre: "' + data.rows[0].nombre + '", ' +
						'Apellido: "' + data.rows[0].apellido + '", ' +
						'Email: "' + data.rows[0].email + '", ' +
						'Contrasena: "' + data.rows[0].contrasena + '", ' +
						'Celular: "' + data.rows[0].celular + '", ' +
						'Direccion: "' + data.rows[0].direccion + '", ' +
						'Estatus: "'+ data.rows[0].estatus + '", ' +
						'Zona: "' + data.rows[0].zonaparken_idzonaparken + '", ' +
						'Token: "' + data.rows[0].token + '" ' +
						'}';

					res.send(jsonResponse);
					//No existe un usuario con esa credencial
					}else{
						jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para verificar si ya existe registrado un correo o número celular
	app.post("/automovilista/actualizarDatos", function(req,res){


		//
		var id = req.body.id;
		var column = req.body.column;
		var value = req.body.value;
		var user = 'automovilista';


			if(column === 'puntosparken'){

				Requests.actualizarPuntosParken(id, value, function(status, data){

					var jsonResponse = null;
					// Consuta generada con éxito
					if(status==1) {
						jsonResponse = '{success:1, puntosparken: '+ data.rows[0].refresh_puntosparken +'}';
						Requests.androidNotificationSingle(id, 'automovilista', 'Actualización del perfil', 'Se actualizaron tus puntos Parken', '{}');
						res.send(jsonResponse);
				// Error con la conexion a la bd
					} else {
						jsonResponse = '{success:0}';
						res.send(jsonResponse);
					}

				});

			}else{
					Requests.actualizar(user, id, column, value, function(status, data){

						var jsonResponse = null;
						// Consuta generada con éxito
						if(status==1) {
							//espacioparken_zonaparken_idzonaparken

							if(data.rows[0].idautomovilista != null){

								jsonResponse = '{success:1, ' +
									'idAutomovilista:"' + data.rows[0].idautomovilista + '", ' +
									'Nombre: "' + data.rows[0].nombre + '", ' +
									'Apellido: "' + data.rows[0].apellido + '", ' +
									'Email: "' + data.rows[0].email + '", ' +
									'Contrasena: "' + data.rows[0].contrasena + '", ' +
									'Celular: "' + data.rows[0].celular + '", ' +
									'Puntosparken: ' + data.rows[0].puntosparken + ', ' +
									'Estatus: "'+ data.rows[0].estatus + '" ' +
									'}';
								res.send(jsonResponse);
								var data = '{"idNotification" : "400", ' +
									'"idAutomovilista":"' + data.rows[0].idautomovilista + '", ' +
									'"Nombre": "' + data.rows[0].nombre + '", ' +
									'"Apellido": "' + data.rows[0].apellido + '", ' +
									'"Email": "' + data.rows[0].email + '", ' +
									'"Contrasena": "' + data.rows[0].contrasena + '", ' +
									'"Celular": "' + data.rows[0].celular + '", ' +
									'"Puntosparken": "' + data.rows[0].puntosparken + '", ' +
									'"Estatus": "'+ data.rows[0].estatus + '" ' +
									'}';
								Requests.androidNotificationSingle(id, 'automovilista', 'Actualización del perfil', 'Se modificó la información de tu perfil exitosamente', data);
							}

					// Error con la conexion a la bd
						} else {
							jsonResponse = '{success:0}';
							res.send(jsonResponse);
						}
					});
			}

	});

	// Función para verificar si ya existe registrado un correo o número celular
	app.post("/supervisor/actualizarDatos", function(req,res){


		//
		var id = req.body.id;
		var column = req.body.column;
		var value = req.body.value;
		var user = 'supervisor';

					Requests.actualizar(user, id, column, value, function(status, data){

						var jsonResponse = null;
						// Consuta generada con éxito
						if(status==1) {
							//espacioparken_zonaparken_idzonaparken

								jsonResponse = '{success:1, ' +
									'idSupervisor:"' + data.rows[0].idsupervisor + '", ' +
									'Nombre: "' + data.rows[0].nombre + '", ' +
									'Apellido: "' + data.rows[0].apellido + '", ' +
									'Email: "' + data.rows[0].email + '", ' +
									'Contrasena: "' + data.rows[0].contrasena + '", ' +
									'Celular: "' + data.rows[0].celular + '", ' +
									'Direccion: "' + data.rows[0].direccion + '", ' +
									'Estatus: "'+ data.rows[0].estatus + '", ' +
									'Zona: "' + data.rows[0].zonaparken_idzonaparken + '", ' +
									'Token: "' + data.rows[0].token + '" ' +
									'}';
								res.send(jsonResponse);
								var data = '{"idNotification" : "400", ' +
								'"idSupervisor":"' + data.rows[0].idsupervisor + '", ' +
								'"Nombre": "' + data.rows[0].nombre + '", ' +
								'"Apellido": "' + data.rows[0].apellido + '", ' +
								'"Email": "' + data.rows[0].email + '", ' +
								'"Contrasena": "' + data.rows[0].contrasena + '", ' +
								'"Celular": "' + data.rows[0].celular + '", ' +
								'"Direccion": "' + data.rows[0].direccion + '", ' +
								'"Estatus": "'+ data.rows[0].estatus + '", ' +
								'"Zona": "' + data.rows[0].zonaparken_idzonaparken + '", ' +
								'"Token": "' + data.rows[0].token + '" ' +
								'}';
								Requests.androidNotificationSingle(id, 'supervisor', 'Actualización del perfil', 'Se modificó la información de tu perfil exitosamente', data);

					// Error con la conexion a la bd
						} else {
							jsonResponse = '{success:0}';
							res.send(jsonResponse);
						}
					});


	});

	// Función para eliminar un vehiculo
	app.post("/automovilista/eliminarVehiculo", function(req,res){


		//
		var idautomovilista = req.body.idautomovilista;
		var idvehiculo = req.body.idvehiculo;

		Requests.eliminarVehiculo(idvehiculo, idautomovilista, function(status, data){

			var jsonResponse = null;
			// Delete generado con éxito
			if(status==1) {
				jsonResponse ='{success:1}';
				res.send(jsonResponse);
		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});
	});

// Función para eliminar un administrador
app.delete("/administrador/eliminarAdministrador", function(req,res, next){
	console.log(req.body);
	var idadministrador = req.body.idadministrador;

	Requests.eliminarAdministrador(idadministrador.toString(), function(status, data){

		var jsonResponse = null;
		// Delete generado con éxito
		if(status==1) {
			console.log(data);
			jsonResponse ='{ "success" : 1 }';
			res.send(jsonResponse);
	// Error con la conexion a la bd
		} else {
			if(status === 2){
				jsonResponse = '{ "success" : 2 }';
			}else{
				jsonResponse = '{ "success" : 0 }';
			}
			res.send(jsonResponse);
		}
	});
});


// Función para eliminar un supervisor
app.delete("/administrador/eliminarSupervisor", function(req,res, next){
	console.log("Eliminando supervisor");
	console.log(req.body);
	var idsupervisor = req.body.idsupervisor;
	//Requests.androidNotificationSingle(idsupervisor, 'supervisor', 'Supervisor eliminado', 'Tu cuenta ha sido eliminada', '{ "datos" : "OK", "idNotification" : "200"}');

	Requests.eliminarSupervisor(idsupervisor.toString(), function(status, data){
		var jsonResponse = null;
		// Delete generado con éxito

		if(status==1) {
			//Al eliminar enviamos una notificación al supervisor, sin que se de cuenta para que cuando se conecte se cierre la sesión
			console.log(data.rows[0].idsupervisor);
			var tokenSuper = data.rows[0].token;
			if(tokenSuper === null || tokenSuper === ''){

			}else{
				Requests.sendNotificationSingle(tokenSuper, 'Supervisor eliminado', 'Tu cuenta ha sido eliminada', '{ "datos" : "OK", "idNotification" : "200"}', function(status, data){});
			}
			console.log(data.rows[0].token);
			//idsuper = data.rows[0].idsupervisor;
			//token = data.rows[0].token;
			jsonResponse ='{ "success" : 1 }';
			res.send(jsonResponse);

	// Error con la conexion a la bd
		} else {
			if(status === 2 || status === 3){
				jsonResponse = '{ "success" : 2, "error": "' + data +'" }';
			}else{
				jsonResponse = '{ "success" : 0 }';
			}
			res.send(jsonResponse);
		}
	});
});


// Función para eliminar un supervisor
app.delete("/administrador/eliminarZonaParken", function(req,res){
	console.log(req.body);
	var idzonaparken = req.body.idzonaparken;

	Requests.eliminarZonaParken(idzonaparken.toString(), function(status, data){
		var jsonResponse = null;
		// Delete generado con éxito
		if(status==1) {
			console.log(data);
			jsonResponse ='{ "success" : 1 }';
			res.send(jsonResponse);
	// Error con la conexion a la bd
		} else {
			switch(status){
				case 2:
				jsonResponse = '{ "success" : 2, "error": "' + status +'" }';
				break;

				case 3:
				jsonResponse = '{ "success" : 2, "error": "' + status +'" }';
				break;
	
				case 4:
				jsonResponse = '{ "success" : 2, "error": "' + status +'" }';
				break;

				case 5:
				jsonResponse = '{ "success" : 2, "error": "' + status +'" }';
				break;

				case 6:
				  jsonResponse = '{ "success" : 2, "error": "' + status +'" }';
				break;

				case 7:
				  jsonResponse = '{ "success" : 2, "error": "' + status +'" }';
				break;

				default:
				jsonResponse = '{ "success" : 0 }';
				break;
			  }

			res.send(jsonResponse);
		}
	});
});


	// Función para verificar si ya existe registrado un correo o número celular
	app.post("/automovilista/actualizarVehiculo", function(req,res){


		//
		var idvehiculo = req.body.idvehiculo;
		var modelo = req.body.modelo;
		var marca = req.body.marca;

		Requests.actualizarVehiculo(idvehiculo, marca, modelo, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				jsonResponse = '{success:1}';
				res.send(jsonResponse);
		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});
	});

// Función para editar el perfil del administrador
app.post("/administrador/editarAdministrador", function(req,res){

	var idadministrador = req.body.idadministrador;
	var correo = req.body.correo;
	var contrasena = req.body.contrasena;
	var nombre = req.body.nombre;
	var apellido = req.body.apellido;

	Requests.actualizarAdministrador(idadministrador, nombre, apellido, contrasena, correo, function(status, data){

		var jsonResponse = null;
		// Consuta generada con éxito
		if(status==1) {
			 jsonResponse = '{ "success" : 1,' +
			 '"id": ' + data.rows[0].idadministrador + ', ' +
			 '"nombre": "' + data.rows[0].nombre + '", ' +
			 '"apellido": "' + data.rows[0].apellido + '", ' +
			 '"email": "' + data.rows[0].email + '", ' +
			 '"password": "' + data.rows[0].contrasena + '"' +
			'}';
			res.send(jsonResponse);
	// Error con la conexion a la bd
		} else {
			jsonResponse = '{ "success" : 0 }';
			res.send(jsonResponse);
		}
	});
});

// Función para editar el perfil del supervisor
app.post("/administrador/editarSupervisor", function(req,res){

	var idsupervisor = req.body.idsupervisor;
	var nombre = req.body.nombre;
	var apellido = req.body.apellido;
	var correo = req.body.correo;
	var contrasena = req.body.contrasena;
	var celular = req.body.celular;
	var direccion = req.body.direccion;
	var estatus = req.body.estatus;
	var zona = req.body.zona;

	Requests.actualizarSupervisor(idsupervisor, nombre, apellido,
		correo, contrasena, celular, direccion, estatus, zona, function(status, data){

		var jsonResponse = null;
		// Consuta generada con éxito
		if(status==1) {
			if(data.rowCount != 0){
				jeison = '{ "success": 1, ' +
				'"id":' + data.rows[0].idsupervisor + ', ' +
				'"nombre": "' + data.rows[0].nombre + '", ' +
				'"apellido":"' + data.rows[0].apellido + '", ' +
				'"email":"' + data.rows[0].email + '", ' +
				'"contrasena":"' + data.rows[0].contrasena + '", ' +
				'"celular":"' + data.rows[0].celular + '", ' +
				'"direccion":"' + data.rows[0].direccion + '", ' +
				'"estatus":"' + data.rows[0].estatus + '", ' +
				'"zonaparken":' + data.rows[0].zonaparken_idzonaparken + ' }';

				Requests.androidNotificationSingle(data.rows[0].idsupervisor, 'supervisor', 'Actualización del perfil ', 'Modificación de la información', '{ "datos" : "OK", "idNotification" : "200"}');

			}else{
				jeison = '{ "success" : 2 }';
			}

			jsonResponse = jeison;

			res.send(jsonResponse);
	// Error con la conexion a la bd
		} else {
			jsonResponse = '{ "success" : 0, ' +
			'"error": "' + data + '" }';
			console.log(jsonResponse);
			res.send(jsonResponse);
		}
	});
});


	// Función para verificar si ya existe registrado un correo o número celular
	app.post("/supervisor/modificarReporte", function(req,res){

		var idreporte = req.body.idreporte;

		Requests.cerrarReporte(idreporte, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				jsonResponse = '{success:1}';
				res.send(jsonResponse);
		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});
	});

	// Función para verificar si ya existe registrado un correo o número celular
	app.post("/supervisor/actualizarEspacioParken", function(req,res){

		var idEspacio = req.body.idEspacioParken;
		var estatus = req.body.estatus;

		Requests.actualizarEspacioParken(idEspacio, estatus, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				jsonResponse = '{success:1}';
				res.send(jsonResponse);
		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});
	});



// Función para verificar si ya existe registrado un correo o número celular
app.post("/administrador/actualizarZonaParken", function(req,res){

	console.log(req.body);
	var idzona = req.body.idzonaparken;
	var nombre = req.body.nombre;
	var nombreBefore = req.body.nombreBefore;
	var estatus = req.body.estatus;
	var estatusBefore = req.body.estatusBefore;
	var precio = req.body.precio;
	var precioBefore = req.body.precioBefore;
	var coordenadasZona = req.body.coordenadasPoly;
	var coordenadasZonaBefore = req.body.coordenadasPolyBefore;
	var coordenadasEspacios = req.body.coordenadasMarker;
	var espaciosEliminados = req.body.coordenadasDeleted;

	var coordenadaZ = '';
	for(var i = 0; i < coordenadasZona.length; i++){
		coordenadaZ = coordenadaZ + coordenadasZona[i].lng + ' ' + coordenadasZona[i].lat;

		//Vamos a armar el string de la siguinte forma
		//'lat0 lng0, lat1 lng1, lat2 lng2,'
		if(i != coordenadasZona.length - 1) {
			coordenadaZ = coordenadaZ + ',';
		}
	}

	var coordenadaE = '';
	if(coordenadasEspacios.length === 0){

	}else{
		for(var i = 0; i < coordenadasEspacios.length; i++){
			coordenadaE = coordenadaE + coordenadasEspacios[i].coordinates.lng + ' ' + coordenadasEspacios[i].coordinates.lat;

			//Vamos a armar el string de la siguinte forma
			//'lat0 lng0, lat1 lng1, lat2 lng2,'
			if(i != coordenadasEspacios.length - 1) {
				coordenadaE = coordenadaE + ',';
			}
		}

	}

	var epEliminados;
	if(espaciosEliminados.length === 0){
		epEliminados = "";
	}else{
		epEliminados = "("+espaciosEliminados.toString()+")";
	}
	console.log("Se eliminaron los espacios Parken: ");
	console.log(epEliminados);
	/*
	console.log(coordenadaZ);
	console.log(coordenadaE);
	console.log(epEliminados);
	*/

	Requests.actualizarZonaParken(idzona, nombre, estatus, precio, coordenadaZ, function(status, data){

		var jsonResponse = null;
		// Consulta generada con éxito
		if(status==1) {

			//jeison = '{ "success": 1, "idzonaparken": '+ data.rows[0].idzonaparken +'}';
			jeison = '{ "success": 1, '+
			'"idzonaparken": ' + data.rows[0].idzonaparken + ', ' +
			'"nombre": "' + data.rows[0].nombre + '", ' +
			'"estatus": "' + data.rows[0].estatus + '", ' +
			'"precio": "' + data.rows[0].precio + '" ' +
			'}';

			Requests.eliminarEspaciosParkenFuera(idzona, epEliminados, function(status, data){
				if(status === 1){

					Requests.agregarEspacioAZonaParken(coordenadaE, idzona, function(status, data){
						if(status === 1){
							jsonResponse = jeison;
							if(estatus != estatusBefore && estatus === "DISPONIBLE"){
								Requests.sendNotificationTopic('automovilista', 'Nueva zona Parken', 'Ahora podrás estacionarte en ' + nombre, '{"datos": "OK", "idNotification": "1", "title": "Nueva zona Parken", "msg": "Ahora podrás estacionarte en ' + nombre + '."}', function(status, data){});
							}

						}else{
							jsonResponse = '{"success": '+ status+',  "error": "' + data + '"}';
						}
						console.log(jsonResponse);
						res.send(jsonResponse);
					});


				}else{
					//Si no se eliminaron entonces regresamos a la información anterior
					var coordenadaZBefore = '';
					for(var i = 0; i < coordenadasZonaBefore.length; i++){
						coordenadaZBefore = coordenadaZBefore + coordenadasZonaBefore[i].lng + ' ' + coordenadasZonaBefore[i].lat;
						if(i != coordenadasZonaBefore.length - 1) {
							coordenadaZBefore = coordenadaZBefore + ',';
						}
					}
					console.log("Coordenada anterior" + coordenadaZBefore);
					Requests.actualizarZonaParken(idzona, nombreBefore, estatusBefore, precioBefore, coordenadaZBefore, function(status2, data2){
						if(status2 === 1){
							jsonResponse = '{"success": '+ status+',  "error": "' + data + '"}';

						}else{
							jsonResponse = '{"success": '+ status2+',  "error": "' + data2 + '"}';
						}
						console.log(jsonResponse);
							res.send(jsonResponse);
					});

				}

			});

		// Error con la conexion a la bd
		}else {
			if(status === 0){
				jsonResponse = '{"success": '+ status+',  "error": "Error con la base de datos"}';
			}else{
				jsonResponse = '{"success": '+ status+',  "error": "' + data + '"}';
			}
			console.log(jsonResponse);
			res.send(jsonResponse);
		}
	});
});

	// Función para buscar si existen zonas parken cercanas a un punto geografico.
	app.post("/automovilista/apartarEspacioParken", function(req,res){

		//
		//

		var espacioP = req.body.idEspacioParken;
		var zonaP	 = req.body.idZonaParken;
		var automovilista	 = req.body.idAutomovilista;

		Requests.apartarEspacioParken(espacioP, zonaP, automovilista, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status === 1) {
				//Primero validamos si data nos devuelve registros
				if(data.rowCount != 0){

							jeison = '{ "success":1, ' +
							'"idSesionParken":"' + data.rows[0].book_parken_space + '" }';

							if(store.hasOwn(automovilista)){
								store.del(automovilista.toString());
							}

							//En esta parte del código creamos o lllamamos una funcion CRON
							//que dentro de 5 minutos o de 15 minutos verificará que dicha sesión
							//No permancezca en estatus = RESERVADO
							//Si el estatus es RESERVADO
							//Entonces eliminará la sesión y liberará el espacio
							//Si el estatus es diferente a RESERVADO entonces no pasará nad
							var idSesion = data.rows[0].book_parken_space;
							var date = new Date();

							//console.log('idSesion: ' + idEspacio);
							date.setMinutes(date.getMinutes()+timerMinutosEspacioReservado);
							date.setSeconds(date.getSeconds()+timerSegundosEspacioReservado + timerAux);
							//date.setSeconds(date.getSeconds()+timerEspacioReservado);

							schedule.scheduleJob(idSesion.toString(), date,
								function(){
									Requests.verificarEstatusSesionParken(idSesion, 'RESERVADO', function(status, data){

										if(status == 1){ //Si es 1 entonces la sesión no ha cambiado, debemos eliminar la sesión
											console.log('Se eliminara la sesión');

											Requests.eliminarSesionParken(idSesion, function(status, data){

												// Consuta generada con éxito
												if(status==1) {

													//Se enviará una notifiación informando que la sesiones
													//o que la vista ya cambió porque el tiempo terminó
													//o simplemente que llame al metodo
													Requests.androidNotificationSingle(automovilista, 'automovilista', 'Espacio Parken liberado', 'No llegaste a tiempo', '{}');
													//Requests.androidNotificationSingle(data.rows[0].id, user, 'Aviso', 'Inicio de sesión', 'Iniciaste sesión exitosamente', '')
													//Requests.androidNotificationSingle(idUser, tipoUser, tipoNotificacion, titulo, mensaje, accion)

													//obtenerVistaDelServer()
													//jsonResponse = '{ success:1 }';
													//console.log(jsonResponse);
													//res.send(jsonResponse);

											// Error con la conexion a la bd
												} else {
													//jsonResponse = '{success:0}';
													//console.log(jsonResponse);
													//res.send(jsonResponse);
												}
											});


										}else{
											console.log('Automovilista pagó por el espacio Parken asignado');
										}
									});
								}
							);

							jsonResponse = jeison;
							res.send(jsonResponse);

					//Error al realizar la consulta
				}else{
					jsonResponse = '{"success":3}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				if(status == 2){
					jsonResponse = '{"success":2}';
					res.send(jsonResponse);
				}else{
					jsonResponse = '{"success":0}';
					res.send(jsonResponse);
				}

			}
		});

	});


	// Función para obtener las sanciones de un automovilista
	app.post("/automovilista/obtenerSanciones", function(req,res){
	/*
	{ "success":1,
	"Vehiculos":[
		{
			"id":130,
			"modelo":"Nissan",
			"marca":"Versa",
			"placa":"D886ACN"
		},
		{
			"id":131,
			"modelo":"Nissan",
			"marca":"Versa",
			"placa":"DT6ACN"
		}
	]
	}

	*/



		var idAutomovilista = req.body.idAutomovilista;
		var jeison;
		Requests.obtenerSancionesAutomovilista(idAutomovilista, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				console.log(data.rows);
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
							//if (data.rows[0].idautomovilista != null){
							jeison = '{ "success": 1, ' +
							'"NumeroSanciones":"' + data.rowCount + '",'+
							'"Sanciones":[';
							for(var i = 0; i < data.rowCount; i++){

								var ini = "POINT(".length;
								var f = data.rows[i].coordenadaep.length - 1;
								var coordenadasCentro = data.rows[i].coordenadaep.substring(ini, f)
								var centroArray = coordenadasCentro.split(" ");
								jeison = jeison +
								'{ "idSancion":' + data.rows[i].idsancion + ', ' +
								'"FechaSancion":"' + data.rows[i].fechasancion + '", ' +
								'"FechaPago":"' + data.rows[i].fechapago + '", ' +
								'"Fecha":"' + data.rows[i].fecha + '", ' +
								'"Hora":"' + data.rows[i].hora + '", ' +
								'"Monto":' + data.rows[i].monto + ', ' +
								'"Observaciones":"' + data.rows[i].observacion + '", ' +
								'"Estatus":"' + data.rows[i].estatus + '", ' +
								'"FechaPago":"' + data.rows[i].fechapago + '", ' +
								'"HoraPago":"' + data.rows[i].horapago + '", ' +
								'"idAutomovilista":"' + data.rows[i].idautomovilista + '", ' +
								'"NombreAutomovilista":"' + data.rows[i].nombreautomovilista + '", ' +
								'"ApellidoAutomovilista":"' + data.rows[i].apellidoautomovilista + '", ' +
								'"CorreoAutomovilista":"' + data.rows[i].correoautomovilista + '", ' +
								'"CelularAutomovilista":"' + data.rows[i].celularautomovilista + '", ' +
								'"TokenAutomovilista":"' + data.rows[i].tokenautomovilista + '", ' +
								'"idVehiculo":"' + data.rows[i].idvehiculo + '", ' +
								'"ModeloVehiculo":"' + data.rows[i].modelo + '", ' +
								'"PlacaVehiculo":"' + data.rows[i].placa + '", ' +
								'"MarcaVehiculo":"' + data.rows[i].marca + '", ' +
								'"idSupervisor":"' + data.rows[i].idsupervisor + '", ' +
								'"idEspacioParken":' + data.rows[i].idespacioparken + ', ' +
								'"DireccionEspacioParken":"' + data.rows[i].direccion + '", ' +
								'"Coordenadas": [ {' +
								'"latitud":' + centroArray[0] + ', ' +
								'"longitud":' + centroArray[1] + '} ],' +
								'"idZonaParken":"' + data.rows[i].idzonaparken + '", ' +
								'"NombreZonaParken":"' + data.rows[i].nombre + '"';


								if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
							}
							jeison = jeison + '] }';
							jsonResponse = jeison;

							res.send(jsonResponse);
							/*res.send('{success:1, id:'+data.rows[0].idautomovilista+', '+

							'nombre:'+data.rows[0].nombre+', '+
							'apellido:'+data.rows[0].apellido+', '+
							'email:'+data.rows[0].email+', '+
							'password:'+data.rows[0].contrasena+', '+
							'celular:'+data.rows[0].celular+', '+
							'puntos:'+data.rows[0].puntosparken+'}');*/

					//No hay sanciones
				}else{
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para obtener las sanciones de un automovilista
	app.post("/automovilista/obtenerSesionesParken", function(req,res){



		var idAutomovilista = req.body.idAutomovilista;
		var jeison;
		Requests.obtenerSesionesParken(idAutomovilista, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
							//if (data.rows[0].idautomovilista != null){
							jeison = '{ "success": 1, ' +
							'"NumeroSesiones":"' + data.rowCount + '",'+
							'"Sesiones":[';
							for(var i = 0; i < data.rowCount; i++){

								var ini = "POINT(".length;
								//
								var f = data.rows[i].coordenadaep.length - 1;
								//
								var coordenadasCentro = data.rows[i].coordenadaep.substring(ini, f)
								//
								var centroArray = coordenadasCentro.split(" ");

								jeison = jeison +
								'{ "idSesion":' + data.rows[i].idsesionparken + ', ' +
								'"FechaInicio":"' + data.rows[i].fechainicio + '", ' +
								'"HoraInicio":"' + data.rows[i].horainicio + '", ' +
								'"FechaFinal":"' + data.rows[i].fechafinal + '", ' +
								'"HoraFinal":"' + data.rows[i].horafinal + '", ' +
								'"Monto":"' + data.rows[i].montopago + '", ' +
								'"Tiempo":"' + data.rows[i].tiempo + '", ' +
								'"Estatus":"' + data.rows[i].estatus + '", ' +
								'"idAutomovilista":"' + data.rows[i].idautomovilista + '", ' +
								'"idVehiculo":' + data.rows[i].idvehiculo + ', ' +
								'"ModeloVehiculo":"' + data.rows[i].modelo + '", ' +
								'"PlacaVehiculo":"' + data.rows[i].placa + '", ' +
								'"MarcaVehiculo":"' + data.rows[i].marca + '", ' +
								'"idSancion":' + data.rows[i].idsancion + ', ' +
								'"MontoSancion":' + data.rows[i].montosancion + ', ' +
								'"Fecha":"' + data.rows[i].fecha + '", ' +
								'"Hora":"' + data.rows[i].hora + '", ' +
								'"idEspacioParken":' + data.rows[i].idespacioparken + ', ' +
								'"Coordenadas": [ {' +
								'"latitud":' + centroArray[1] + ', ' +
								'"longitud":' + centroArray[0] + '} ],' +
								'"DireccionZonaParken":"' + data.rows[i].direccionespacioparken + '", ' +
								'"idZonaParken":' + data.rows[i].idzonaparken + ', ' +
								'"NombreZonaParken":"' + data.rows[i].nombrezonaparken + '"';

								if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
							}
							jeison = jeison + '] }';
							jsonResponse = jeison;

							res.send(jsonResponse);

					//No hay sesiones
				}else{
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para verificar si ya existe registrado un correo o número celular
	app.post("/automovilista/pagarSancion", function(req,res){

		var idSancion = req.body.idSancion;

		Requests.pagarSancion(idSancion, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) { //Si se actualiza correctamente la sancion generamos un idReporte

				var idAutomovilista = data.rows[0].idautomovilista;
				var espacioparken = data.rows[0].ep;
				var zonaparken = data.rows[0].zp;
				var estatus = "PENDIENTE";
				var tipo = "SANCION";
				var observaciones = "";

				Requests.crearReporte(estatus, tipo, observaciones, idAutomovilista, espacioparken, zonaparken, function(status, data){
					if(status == 1){
						console.log("Reporte generado con éxito, se notificará a un supervisor");
					}else{
						console.log("ERROR al generar el reporte, NO se notificará a un supervisor");
					}
				});

				jsonResponse = '{success:1}';
				res.send(jsonResponse);
		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});
	});

	// Función para obtener las sanciones de un automovilista
	app.post("/automovilista/crearReporte", function(req,res){



		var idAutomovilista = req.body.idAutomovilista;
		var estatus = req.body.Estatus;
		var tipo = req.body.Tipo;
		var observaciones = req.body.Observaciones;
		var espacioparken = req.body.idEspacioParken;
		var zonaparken = req.body.idZonaParken;

		var jeison;

		Requests.crearReporte(estatus, tipo, observaciones, idAutomovilista, espacioparken, zonaparken, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){


					//Eliminamos el SCHEDULE, si existe
					/*var mySchedule = schedule.scheduledJobs[]

					if(mySchedule != null){
						mySchedule.cancel();
					}*/
					jsonResponse = '{success:1, idReporte:' + data.rows[0].idreporte + ', ' +
					'tipoReporte: "' + data.rows[0].tipo + '", ' +
					'estatusReporte: "' + data.rows[0].estatus + '"' +
					'}';
							res.send(jsonResponse);

				}else{
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});


	// Función para obtener las sanciones de un automovilista
	app.post("/supervisor/crearSancion", function(req,res){

		var idAutomovilista = req.body.idAutomovilista;
		var idVehiculo = req.body.idVehiculo;
		var idSupervisor = req.body.idSupervisor;
		var idEspacio = req.body.idEspacio;
		var idZona = req.body.idZona;
		var idSesion = req.body.idSesion;
		var monto = req.body.monto;

		var jeison;

		Requests.crearSancion(idAutomovilista, idVehiculo, idSupervisor, idEspacio, idZona, idSesion, monto, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){

							jsonResponse = '{ success: 1 }'
							Requests.androidNotificationSingle(idAutomovilista, 'automovilista', 'Nueva sanción', 'Paga la sanción para poder mover tu vehículo.', '{ "datos" : "OK", "idNotification" : "1000"}');
							res.send(jsonResponse);


				}else{
					jsonResponse = '{ success: 2 }';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});



	// Función para desactivar una sesionparken
	app.post("/automovilista/modificarSesionParken", function(req,res){

		console.log("/modificarSesionParken");
		console.log(req.body);
		var idSesion = req.body.idSesionParken;
		var estatus = req.body.Estatus;
		var fecha = req.body.Fecha;

		var jeison;

		Requests.modificarSesionParken(idSesion, estatus, fecha, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){

					var date = new Date();

					var tiempoMin = 0;
					var tiempoSeg = 0;
					var newEstatus = 'ERROR';
					var newFecha = false;

					if(estatus== 'REEMBOLSO'){
						tiempoMin = timerMinutosCheckMove;
						tiempoSeg = timerSegundosCheckMove;
						newEstatus = 'REPORTADA';
						newFecha = false;

					}

					if(estatus== 'PROCESANDO'){
						tiempoMin = timerMinutosTolerancia;
						tiempoSeg = timerSegundosTolerancia;
						newEstatus = 'REPORTADA';
						newFecha = false;

					}

					if(newEstatus != 'ERROR'){

						date.setMinutes(date.getMinutes()+tiempoMin);
						date.setSeconds(date.getSeconds()+tiempoSeg + timerAux);
						//date.setSeconds(date.getSeconds()+timerEspacioReservado);

						schedule.scheduleJob(date,
							function(){
								Requests.verificarEstatusSesionParken(idSesion, estatus, function(status, data){

									if(status == 1){ //Si es 1 entonces la sesión no ha cambiado, debemos eliminar la sesión
										console.log('Se modificará la sesión a ' + newEstatus);

										var automovilista = data.rows[0].automovilista_idautomovilista;
										var espacioparken = data.rows[0].espacioparken_idespacioparken;
										var zonaparken = data.rows[0].espacioparken_zonaparken_idzonaparken;


										Requests.modificarSesionParken(idSesion, newEstatus, fecha, function(status, data){

											var jsonResponse = null;
											// Consuta generada con éxito
											if(status==1) {

												Requests.crearReporte('PENDIENTE', 'ENDOFTIME', '', automovilista, espacioparken, zonaparken, function(status, data){
													if(status==1) {
														console.log('Enviando notificación...');
														Requests.androidNotificationSingle(automovilista, 'automovilista', 'Se generó un reporte', 'Automovilista no finalizó correctamente la sesión', '{}');
														//Requests.androidNotificationSingle(data.rows[0].id, user, 'Aviso', 'Inicio de sesión', 'Iniciaste sesión exitosamente', '')
														//Requests.androidNotificationSingle(idUser, tipoUser, tipoNotificacion, titulo, mensaje, accion)

														//obtenerVistaDelServer()
														//jsonResponse = '{ success:1 }';
														//console.log(jsonResponse);
														//res.send(jsonResponse);



													}else{
														console.log('Error al crear reporte ENDOFTIME');

													}

											});

											} else {
												//jsonResponse = '{success:0}';
												//console.log(jsonResponse);
												//res.send(jsonResponse);
											}
										});


									}else{
										console.log('Automovilista finalizó correctamente la sesión Parken, no se modificará nada');
									}
								});
							}
						);

						}



					jsonResponse = '{success:1}';
							res.send(jsonResponse);

				}else{
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}
		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});



	// Función para obtener las sanciones de un automovilista
	app.post("/automovilista/eliminarSesionParken", function(req,res){



		var sesionparken = req.body.idSesionParken;

		Requests.eliminarSesionParken(sesionparken, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {

				//Cancelamos el SCHEDULE generado
				var mySchedule = schedule.scheduledJobs[sesionparken];
				//console.log(my_job);
				if(mySchedule != null){
					mySchedule.cancel();
				}


				jsonResponse = '{ success:1 }';
							res.send(jsonResponse);
		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para obtener los puntos parken  del automovilista
	app.post("/automovilista/obtenerPuntosParken", function(req,res){



		var idAutomovilista = req.body.idAutomovilista;
		var jeison;
		Requests.obtenerPuntosParken(idAutomovilista, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
							//if (data.rows[0].idautomovilista != null){
							jeison = '{ "success": 1, ' +
							' "idAutomovilista":' + data.rows[0].idautomovilista + ', ' +
								'"PuntosParken":"' + data.rows[0].puntosparken + '"} '
								jsonResponse = jeison;
							res.send(jsonResponse);
				}else{
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});


	// Función para verificar la disponibilidad de un vehiculo
	app.post("/automovilista/verificarEstatusVehiculo", function(req,res){



		var idVehiculo = req.body.idVehiculo;
		var jeison;
		Requests.verificarEstatusVehiculo(idVehiculo, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
							//if (data.rows[0].idautomovilista != null){
							jeison = '{ "success": 1, ' +
								'"idVehiculo":' + data.rows[0].idvehiculo + ', ' +
								'"Disponibilidad":"' + data.rows[0].disponiblidad + '"} ';
								jsonResponse = jeison;
							res.send(jsonResponse);
				}else{
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}
		// Error con la conexion a la bd
	} else {
		jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para activar una sesion parken
	app.post("/automovilista/activarSesionParken", function(req,res){



		var opc = req.body.opc;
		var idSesionParken = req.body.idSesionParken;
		var idAutomovilista = req.body.idAutomovilista;
		var fechaFinal = req.body.FechaFinal;
		var monto = req.body.Monto;
		var tiempo = req.body.Tiempo;
		var idVehiculo = req.body.idVehiculo;
		var puntosParken = req.body.puntosParken;

var ep;
var zp;

		if(opc === '3'){
			ep = req.body.idEspacioParken;
			zp = req.body.idZonaParken;
			puntosParken = 0.0;
		}else {
			ep = null;
			zp = null;
		}

		console.log("EspacioP: " +ep);



		Requests.activarSesionParken(idSesionParken, idAutomovilista, fechaFinal, monto, tiempo, idVehiculo, puntosParken, ep, zp, opc, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Obtenemos
				var idSesion = data.rows[0].idsesion;
				var fechaFinal = data.rows[0].fechafin;

				var automovilista = data.rows[0].idauto;
				var espacioparken = data.rows[0].espaciop;
				var zonaparken = data.rows[0].zonap;



				//Creamos una tarea que se ejecute en fechafinal + timerTolerancia
				var estatus = 'ACTIVA';
				var newEstatus = 'REPORTADA';
				var date = fechaFinal;
				date.setMinutes(date.getMinutes()+timerMinutosTolerancia);
				date.setSeconds(date.getSeconds()+timerSegundosTolerancia + timerAux);

				console.log(idSesion);
				console.log(date.toString());
				/*
				console.log('fecha: ' + date);
				console.log('seg: ' + date.getSeconds());
				console.log('min: ' + date.getMinutes());
				*/

				//if(opc === '2' || opc === '1'){ //Si es una renovación, eliminamos el SCHEDULE anterior para crear unno nuevo
					var mySchedule = schedule.scheduledJobs[idSesion.toString()];
					//console.log(my_job);
					if(mySchedule != null){
						mySchedule.cancel();
					}

				//}

				schedule.scheduleJob(idSesion.toString(), date,
					function(){
						Requests.verificarEstatusSesionParken(idSesion, estatus, function(status, data){

							if(status == 1){ //Si es 1 entonces la sesión no ha cambiado
								console.log('Se modificará la sesión a ' + newEstatus);

								var automovilista = data.rows[0].automovilista_idautomovilista;
								var espacioparken = data.rows[0].espacioparken_idespacioparken;
								var zonaparken = data.rows[0].espacioparken_zonaparken_idzonaparken;
								Requests.modificarSesionParken(idSesion, newEstatus, false, function(status, data){
									// Consuta generada con éxito
									if(status==1) {

										//Se enviará una notifiación informando que la sesiones
										//o que la vista ya cambió porque el tiempo terminó
										//o simplemente que llame al metodo
										Requests.crearReporte('PENDIENTE', 'ENDOFTIME', '', automovilista, espacioparken, zonaparken, function(status, data){
											if(status==1) {
												console.log('Enviando notificación...');
												Requests.androidNotificationSingle(automovilista, 'automovilista', 'Se generó un reporte', 'Nuevo reporte por reembolso', '{}');
												//Requests.androidNotificationSingle(data.rows[0].id, user, 'Aviso', 'Inicio de sesión', 'Iniciaste sesión exitosamente', '')
												//Requests.androidNotificationSingle(idUser, tipoUser, tipoNotificacion, titulo, mensaje, accion)

												//obtenerVistaDelServer()
												//jsonResponse = '{ success:1 }';
												//console.log(jsonResponse);
												//res.send(jsonResponse);

												//Al final cancelamos el SCHEDULE
												var mySche = schedule.scheduledJobs[idSesion.toString()];
												//console.log(my_job);
												mySche.cancel();

											}else{
												console.log('Error al crear reporte ENDOFTIME');

											}

									});
								// Error con la conexion a la bd
									} else {
										console.log('Error al modificar la sesión al estado ' + newEstatus);
										//jsonResponse = '{success:0}';
										//console.log(jsonResponse);
										//res.send(jsonResponse);
									}
								});


							}else{
								console.log('El estado de la sesión es correcto, no se modificará nada');
							}
						});
					}
				);





				jsonResponse = '{ "success": 1 }';
				res.send(jsonResponse);
		// Error con la conexion a la bd
	} else {
		jsonResponse = '{success:0}';
				res.send(jsonResponse);
			}
		});


	});

	app.post("/actualizarToken", function(req,res){

	var id = req.body.id;
	var user =req.body.user;
	var token = req.body.token;

	var usuario;
	if(user === '1'){
		usuario = 'automovilista';
	}
	else {
		usuario = 'supervisor';
	}


	Requests.actualizarToken(id, token, usuario, function(status,data){

	/* Respuesta JSON
	{
	success: 1
	}
	*/

	// Se ha creado exitosamente la cuenta.
	 var jsonResponse = 'null' ;
		if(status==1) {
			jsonResponse = '{"success":1}';
			res.send(jsonResponse);
	// Ocurrió un error
		} else {
			jsonResponse = '{"success":0}';
				res.send(jsonResponse);
		}
	});

});

app.post("/automovilista/obtenerValoresDelServer", function(req,res){


				var idAutomovilista = req.body.idAutomovilista;
				var jeison;

Requests.obtenerValoresDelServer(function(status,data){

/* Respuesta JSON
{
success: 1,
timers: {
		espacioParkenReservado:[
			minutos: 5,
			segundos: 0
		],

		dialogParken:[
			minutos: 5,
			segundos: 0
		],

		pago:[
			minutos: 5,
			segundos: 0
		],

		timeMinSesionParken:[
			minutos: 5,
			segundos: 0
		],

		tolerancia:[
			minutos: 5,
			segundos: 0
		],

		checkMove:[
			minutos: 5,
			segundos: 0
		]
	}
}
*/

// Se ha creado exitosamente la cuenta.
 var jsonResponse = 'null' ;
	if(status==1) {
		jsonResponse = //'{success:1}';
		'{ success: 1, ' +
		'timers: {' +
		'espacioParkenReservado: { ' +
					'minutos:' + data.rows[0].duracionminutos +', ' +
					'segundos:' + data.rows[0].duracionsegundos +' }, ' +
				'dialogParken: { ' +
					'minutos:' + data.rows[1].duracionminutos +', ' +
					'segundos:' + data.rows[1].duracionsegundos +' }, ' +
				'pago: { ' +
					'minutos:' + data.rows[2].duracionminutos +', ' +
					'segundos:' + data.rows[2].duracionsegundos +' }, ' +
				'checkMove: { ' +
					'minutos:' + data.rows[3].duracionminutos +', ' +
					'segundos:' + data.rows[3].duracionsegundos +' },' +
				'timeMinSesionParken: { ' +
					'minutos:' + data.rows[4].duracionminutos +', ' +
					'segundos:' + data.rows[4].duracionsegundos +' }, ' +
				'tolerancia: { ' +
					'minutos:' + data.rows[5].duracionminutos +', ' +
					'segundos:' + data.rows[5].duracionsegundos +' } ' +

			'}}';

		res.send(jsonResponse);
// Ocurrió un error
	} else {
		jsonResponse = '{success:0}';
			res.send(jsonResponse);
	}
});

});


// Función para obtener las sanciones de un automovilista
app.post("/automovilista/obtenerVistaDelServer", function(req,res){


			var idAutomovilista = req.body.idAutomovilista;
			var jeison;
			Requests.obtenerAllSesionesParken(idAutomovilista, function(status, data){

				var jsonResponse = null;
				var tipoSesion = null;
				// Consuta generada con éxito
				if(status==1) {
					//Primero validamos si data nos devuelve un registros
					if(data.rowCount != 0){
								//console.log(data.rowCount);
								for(var i = 0; i < data.rowCount; i++){
									//console.log("Estatus: " + data.rows[i].estatus);

									if(data.rows[i].estatus === 'ACTIVA'){
										tipoSesion = 'sesionParkenActiva';
									}

									if (data.rows[i].estatus === 'RESERVADO'){
										tipoSesion = 'sesionParkenReservado';
									}

									if (data.rows[i].estatus === 'PAGANDO'){
										tipoSesion = 'sesionParkenPagando';
									}

									if(tipoSesion != null){

										var ini = "POINT(".length;
										var f = data.rows[i].coordenadaep.length - 1;
										var coordenadasCentro = data.rows[i].coordenadaep.substring(ini, f)
										var centroArray = coordenadasCentro.split(" ");

										jeison = '{ "success": 1, ' +
										'"vista":"' + tipoSesion + '",'+
										//'"data": [{' +
										'"idSesion":' + data.rows[i].idsesionparken + ', ' +
										'"FechaPago": "' + data.rows[i].fechainicio + '", ' +
										'"FechaInicio":"' + data.rows[i].fechainicial + '", ' +
										'"HoraInicio":"' + data.rows[i].horainicio + '", ' +
										'"FechaFinal":"' + data.rows[i].fechafinal + '", ' +
										'"HoraFinal":"' + data.rows[i].horafinal + '", ' +
										'"TiempoTranscurridoMin":"' + data.rows[i].tiempotranscurridomin + '", ' +
										'"TiempoTranscurridoSeg":"' + data.rows[i].tiempotranscurridoseg + '", ' +
										'"TiempoRestanteMin":"' + data.rows[i].tiemporestantemin + '", ' +
										'"TiempoRestanteSeg":"' + data.rows[i].tiemporestanteseg + '", ' +
										'"Monto":"' + data.rows[i].montopago + '", ' +
										'"Tiempo":"' + data.rows[i].tiempo + '", ' +
										'"Estatus":"' + data.rows[i].estatus + '", ' +
										'"idAutomovilista":"' + data.rows[i].idautomovilista + '", ' +
										'"idVehiculo":' + data.rows[i].idvehiculo + ', ' +
										'"ModeloVehiculo":"' + data.rows[i].modelo + '", ' +
										'"PlacaVehiculo":"' + data.rows[i].placa + '", ' +
										'"MarcaVehiculo":"' + data.rows[i].marca + '", ' +
										'"idSancion":' + data.rows[i].idsancion + ', ' +
										'"MontoSancion":' + data.rows[i].montosancion + ', ' +
										'"id":' + data.rows[i].idespacioparken + ', ' +
										'"coordenada": [ {' +
										'"latitud":' + centroArray[0] + ', ' +
										'"longitud":' + centroArray[1] + '} ],' +
										'"direccion":"' + data.rows[i].direccionespacioparken + '", ' +
										'"zona":' + data.rows[i].idzonaparken + ', ' +
										'"NombreZonaParken":"' + data.rows[i].nombrezonaparken + '"' + '}';
										//+ '} ] }';

										break;
									}
								}
							}
								//console.log(tipoSesion);
								if(tipoSesion != null){

									jsonResponse = jeison;
									res.send(jsonResponse);

								}else {
									//No hay sesiones pendientes entonces buscaremos en las sanciones
									Requests.obtenerSancionesAutomovilista(idAutomovilista, function(status, data){

										var jsonResponse = null;
										var tipoSancion = null;
										// Consuta generada con éxito
										if(status==1) {
											//Primero validamos si data nos devuelve un registros
											if(data.rowCount != 0){

														//if (data.rows[0].idautomovilista != null){

														for(var i = 0; i < data.rowCount; i++){


															if(data.rows[i].estatus === 'PENDIENTE'){
																tipoSancion = 'sancionPendiente'
															}

															if(tipoSancion != null){

																var ini = "POINT(".length;
																var f = data.rows[i].coordenadaep.length - 1;
																var coordenadasCentro = data.rows[i].coordenadaep.substring(ini, f)
																var centroArray = coordenadasCentro.split(" ");

																jeison = '{ "success": 1, ' +
																'"vista":"' + tipoSancion + '",'+
																//'"data":[';
																	'"idSancion":' + data.rows[i].idsancion + ', ' +
																	'"FechaSancion":"' + data.rows[i].fechasancion + '", ' +
																	'"FechaPago":"' + data.rows[i].fechapago + '", ' +
																	'"Fecha":"' + data.rows[i].fecha + '", ' +
																	'"Hora":"' + data.rows[i].hora + '", ' +
																	'"Monto":' + data.rows[i].monto + ', ' +
																	'"Observaciones":"' + data.rows[i].observacion + '", ' +
																	'"Estatus":"' + data.rows[i].estatus + '", ' +
																	'"FechaPago":"' + data.rows[i].fechapago + '", ' +
																	'"HoraPago":"' + data.rows[i].horapago + '", ' +
																	'"idAutomovilista":"' + data.rows[i].idautomovilista + '", ' +
																	'"NombreAutomovilista":"' + data.rows[i].nombreautomovilista + '", ' +
																	'"ApellidoAutomovilista":"' + data.rows[i].apellidoautomovilista + '", ' +
																	'"CorreoAutomovilista":"' + data.rows[i].correoautomovilista + '", ' +
																	'"CelularAutomovilista":"' + data.rows[i].celularautomovilista + '", ' +
																	'"TokenAutomovilista":"' + data.rows[i].tokenautomovilista + '", ' +
																	'"idVehiculo":"' + data.rows[i].idvehiculo + '", ' +
																	'"ModeloVehiculo":"' + data.rows[i].modelo + '", ' +
																	'"PlacaVehiculo":"' + data.rows[i].placa + '", ' +
																	'"MarcaVehiculo":"' + data.rows[i].marca + '", ' +
																	'"idSupervisor":"' + data.rows[i].idsupervisor + '", ' +
																	'"idEspacioParken":' + data.rows[i].idespacioparken + ', ' +
																	'"DireccionEspacioParken":"' + data.rows[i].direccion + '", ' +
																	'"Coordenadas": [ {' +
																	'"latitud":' + centroArray[0] + ', ' +
																	'"longitud":' + centroArray[1] + '} ],' +
																	'"idZonaParken":"' + data.rows[i].idzonaparken + '", ' +
																	'"NombreZonaParken":"' + data.rows[i].nombre + '"' + '}';

																	break;

															}

													}
											}

											if (tipoSancion != null){

												jsonResponse = jeison;
												res.send(jsonResponse);

											} else {

												jeison = '{success: 2, vista: "parken"}'
												jsonResponse = jeison;
												res.send(jsonResponse);

											}


									// Error con la conexion a la bd
										} else {
											jsonResponse = '{success:0}';
											res.send(jsonResponse);
										}
									});
								}

			// Error con la conexion a la bd
				} else {
					jsonResponse = '{success:0}';
					res.send(jsonResponse);
				}
			});
});


// Función para activar una sesion parken
app.post("/automovilista/establecerVistaPagando", function(req,res){

	var idSesionParken = req.body.idSesion;
	var idAutomovilista = req.body.idAutomovilista;


	Requests.sesionParkenPagando(idSesionParken, timerMinutosPago, timerSegundosPago, function(status, data){

		var jsonResponse = null;
		// Consuta generada con éxito
		if(status==1) {

			var ep = data.rows[0].espacioparken_idespacioparken;
			var zp = data.rows[0].espacioparken_zonaparken_idzonaparken;

				var date = new Date();
				date.setMinutes(date.getMinutes()+timerMinutosPago);
				date.setSeconds(date.getSeconds()+timerSegundosPago + timerAux);

				var mySchedule = schedule.scheduledJobs[idSesionParken];
				//console.log(my_job);
				if(mySchedule != null){
					mySchedule.cancel();
				}

				schedule.scheduleJob(idSesionParken, date,
					function(){

						var newEstatus = 'REPORTADA';

						Requests.verificarEstatusSesionParken(idSesionParken, 'PAGANDO', function(status, data){

							if(status == 1){ //Si es 1 entonces la sesión no ha cambiado, debemos eliminar la sesión
								console.log('Se modificará la sesión a ' + newEstatus);
								var automovilista = data.rows[0].automovilista_idautomovilista;


								Requests.modificarSesionParken(idSesionParken, newEstatus, true, function(status, data){

									if(status==1) {

										Requests.crearReporte('PENDIENTE', 'PAGO', 'Automovilista no finalizó el pago en el tiempo establecido', automovilista, ep, zp, function(status, data){

											if(status==1) {
												var data = '{"idNotification" : "400" }';
													Requests.androidNotificationSingle(automovilista, 'automovilista', 'Se generó un reporte', 'Nuevo reporte por no pagar', data);

											} else {
													console.log('ERROR');
											}
										});



									} else {

									}
								});

							}else{
								console.log('Automovilista si realizó el pago, no se modificará nada');
							}
						});
					}
				);


			jsonResponse = '{ "success": 1 }';
				res.send(jsonResponse);
	// Error con la conexion a la bd
} else {
	jsonResponse = '{ "success": 0 }';
			res.send(jsonResponse);
		}
	});

});


app.post("/supervisor/estatusEspacioParken", function(req, res){

	//console.log(req.body);
	var idEspacioParken = req.body.idEspacioParken;

	//console.log(idEspacioParken);


	Requests.obtenerEstatusEspacioParken(idEspacioParken, function(status, data){

		//console.log(status);
		var jsonResponse;
		if(status === 1){

			if(data.rowCount != 0){

				var ini = "POINT(".length;
				var f = data.rows[0].coordenada.length - 1;
				var coordenadasCentro = data.rows[0].coordenada.substring(ini, f)
				var centroArray = coordenadasCentro.split(" ");

				var jeison ='{ success : 1, ' +
				'idsesionparken :' + data.rows[0].idsesionparken + ', ' +
				'fechainicio :"' + data.rows[0].fechainicio + '", ' +
				'fechafinal :"' + data.rows[0].fechafinal + '", ' +
				'fechafinalformatted :"' + data.rows[0].fechafinalformatted + '", ' +
				'montopago :"' + data.rows[0].montopago + '", ' +
				'tiempo :"' + data.rows[0].tiempo + '", ' +
				'estatussesionparken :"' + data.rows[0].estatussesionparken + '", ' +
				'idespacioparken :' + data.rows[0].idespacioparken + ', ' +
				'estatusespacioparken : "' + data.rows[0].estatusespacioparken + '", ' +
				'coordenada : [ {' +
				'latitud :' + centroArray[0] + ', ' +
				'longitud :' + centroArray[1] + '} ],' +
				'direccion :"' + data.rows[0].direccion + '", ' +
				'zona :' + data.rows[0].zonaparken_idzonaparken + ', ' +
				'nombrezonaparken :"' + data.rows[0].nombrezonaparken + '", ' +
				'idautomovilista :"' + data.rows[0].idautomovilista + '", ' +
				'nombreautomovilista :"' + data.rows[0].nombreautomovilista + '", ' +
				'apellidoautomovilista :"' + data.rows[0].apellido + '", ' +
				'puntosparken :"' + data.rows[0].puntosparken + '", ' +
				'token :"' + data.rows[0].token + '", ' +
				'idvehiculo :' + data.rows[0].idvehiculo + ', ' +
				'modelovehiculo :"' + data.rows[0].modelo + '", ' +
				'placavehiculo :"' + data.rows[0].placa + '", ' +
				'marcavehiculo :"' + data.rows[0].marca + '" ' +
				'}';


							jsonResponse = jeison;
							res.send(jsonResponse);

			}else{


								Requests.obtenerEspacioParken(idEspacioParken, function(status, data){

									if(status === 1){

										var ini = "POINT(".length;
										var f = data.rows[0].coordenada.length - 1;
										var coordenadasCentro = data.rows[0].coordenada.substring(ini, f)
										var centroArray = coordenadasCentro.split(" ");

										 var jeison = '{ ' +
											'"success" : 1, ' +
											'"idespacioparken" : ' + data.rows[0].idespacioparken + ', ' +
											'"estatusespacioparken" : "' + data.rows[0].estatusespacioparken + '", ' +

											'"coordenada" : [ {' +
											'"latitud" : '  + centroArray[0] + ', ' +
											'"longitud" : ' + centroArray[1] + '} ], ' +
											'"direccion" : "' + data.rows[0].direccion + '", ' +
											'"zona" :' + data.rows[0].idzonaparken + ', ' +
											'"nombrezonaparken" : "' + data.rows[0].nombre + '"' +
										' }';


										jsonResponse = jeison;
										res.send(jsonResponse);

									}else{

										jsonResponse = '{ ' +
											'"success" : 2' +
										' }';
										res.send(jsonResponse);

									}

								});


			}


		}else{

			if(status === 2){

			}else{
				jsonResponse = '{ ' +
					'"success" : 2' +
				' }';

				res.send(jsonResponse);

			}
		}


	});

});



app.post("/supervisor/obtenerEspaciosParkenParaSesion", function(req, res){

	//console.log(req.body);
	var idZona = req.body.idZona;

	//console.log(idZona);

	Requests.obtenerEspaciosParkenParaSesion(idZona, function(status, data){

		//console.log(status);
		var jsonResponse;
		if(status === 1){

			if(data.rowCount != 0){

				var jeison = '{ "success" :1, ' +
				'"numeroespaciosparken":' + data.rowCount + ', ' +
				'"espaciosparken":[';

				for(var i = 0; i < data.rowCount; i++){

					var ini = "POINT(".length;
					var f = data.rows[i].coordenada.length - 1;
					var coordenadasCentro = data.rows[i].coordenada.substring(ini, f)
					var centroArray = coordenadasCentro.split(" ");

					jeison =  jeison +
					'{ "idespacioparken" :' + data.rows[i].idespacioparken + ', ' +
					'"estatusespacioparken" : "' + data.rows[i].estatus + '", ' +
					'"coordenada" : [ {' +
					'"latitud" :' + centroArray[0] + ', ' +
					'"longitud" :' + centroArray[1] + '} ],' +
					'"direccion" :"' + data.rows[i].direccion + '", ' +
					'"zona" :' + data.rows[i].zonaparken_idzonaparken;

					if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
				}
				jeison = jeison + '] }';

			} else{

			var	jeison = '{ ' +
					'"success" : 3' +
				' }';
			}

			jsonResponse = jeison;
			res.send(jsonResponse);

		}else{

				jsonResponse = '{ ' +
					'"success" : 2' +
				' }';

				res.send(jsonResponse);
		}


	});

});

app.post("/supervisor/obtenerEspaciosParkenParaPagarSancion", function(req, res){
	//console.log(req.body);
	var idZona = req.body.idZona;
	console.log(idZona);

	Requests.obtenerEspaciosParkenConSanciones(idZona, function(status, data){
		//console.log(status);
		var jsonResponse;
		if(status === 1){

			if(data.rowCount != 0){

				var jeison = '{ "success" :1, ' +
				'"numeroespaciosparken":' + data.rowCount + ', ' +
				'"monto": 700.0, ' +
				'"espaciosparken":[';

				for(var i = 0; i < data.rowCount; i++){
					jeison =  jeison +
					'{ "idespacioparken" :' + data.rows[i].espacioparken_idespacioparken + ', ' +
					'"idsancion" : "' + data.rows[i].idsancion + '", ' +
					'"idvehiculo" :"' + data.rows[i].idvehiculo + '", ' +
					'"marcavehiculo" : "' + data.rows[i].marca + '", ' +
					'"modelovehiculo" :"' + data.rows[i].modelo + '", ' +
					'"placavahiculo" :"' + data.rows[i].placa + '", ' +
					'"zona" :' + data.rows[i].espacioparken_zonaparken_idzonaparken;

					if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
				}
				jeison = jeison + '] }';

			} else{

			var	jeison = '{ ' +
					'"success" : 2' +
				' }';
			}

			jsonResponse = jeison;
			res.send(jsonResponse);

		}else{
				jsonResponse = '{ ' +
					'"success" : 0' +
				' }';
				res.send(jsonResponse);
		}
	});

});


app.post("/supervisor/obtenerTodosEspaciosParken", function(req, res){

	//console.log(req.body);
	var idZona = req.body.idZona;
	var opc = req.body.opc;
	//console.log(idZona);

	Requests.obtenerTodosEspaciosParken(idZona, opc, function(status, data){

		//console.log(status);
		var jsonResponse;
		if(status === 1){

			if(data.rowCount != 0){

				var jeison = '{ "success" :1, ' +
				'"numeroespaciosparken":' + data.rowCount + ', ' +
				'"espaciosparken":[';

				for(var i = 0; i < data.rowCount; i++){

					var ini = "POINT(".length;
					var f = data.rows[i].coordenada.length - 1;
					var coordenadasCentro = data.rows[i].coordenada.substring(ini, f)
					var centroArray = coordenadasCentro.split(" ");

					jeison =  jeison +
					'{ "idespacioparken" :' + data.rows[i].idespacioparken + ', ' +
					'"estatusespacioparken" : "' + data.rows[i].estatus + '", ' +
					'"coordenada" : [ {' +
					'"latitud" :' + centroArray[0] + ', ' +
					'"longitud" :' + centroArray[1] + '} ],' +
					'"direccion" :"' + data.rows[i].direccion + '", ' +
					'"zona" :' + data.rows[i].zonaparken_idzonaparken;

					if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
				}
				jeison = jeison + ' ]}';

			} else{

			var	jeison = '{ ' +
					'"success" : 3' +
				' }';
			}

			jsonResponse = jeison;
			res.send(jsonResponse);

		}else{

				jsonResponse = '{ ' +
					'"success" : 2' +
				' }';

				res.send(jsonResponse);
		}


	});

});


app.post("/supervisor/obtenerTodosReportes", function(req, res){

	//console.log(req.body);
	var idSupervisor = req.body.idSupervisor;
	//console.log(idZona);

	Requests.obtenerTodosReportes(idSupervisor, function(status, data){

		//console.log(status);
		var jsonResponse;
		if(status === 1){

			if(data.rowCount != 0){

				var jeison = '{ success :1, ' +
				'numeroreportes:' + data.rowCount + ', ' +
				'reportes:[';

				for(var i = 0; i < data.rowCount; i++){

					var ini = "POINT(".length;
					var f = data.rows[i].coordenada.length - 1;
					var coordenadasCentro = data.rows[i].coordenada.substring(ini, f)
					var centroArray = coordenadasCentro.split(" ");

					jeison =  jeison +
					'{ idreporte :' + data.rows[i].idreporte + ', ' +
					'tiemporeporte : "' + data.rows[i].fechatiempo + '", ' +
					'estatusreporte :"' + data.rows[i].estatusreporte + '", ' +
					'tiporeporte : "' + data.rows[i].tipo + '", ' +
					'observacionreporte :"' + data.rows[i].observacion + '", ' +
					'idespacioparken :' + data.rows[i].idespacioparken + ', ' +
					'estatusespacioparken : "' + data.rows[i].estatusespacioparken + '", ' +
					'coordenada : [ {' +
					'latitud :' + centroArray[0] + ', ' +
					'longitud :' + centroArray[1] + '} ],' +
					'direccion :"' + data.rows[i].direccion + '", ' +
					'zona :' + data.rows[i].zonaparken_idzonaparken + ', ' +
					'idautomovilista :' + data.rows[i].idautomovilista + ', ' +
					'nombreautomovilista :"' + data.rows[i].nombreautomovilista + '", ' +
					'apellidoautomovilista :"' + data.rows[i].apellido + '", ' +
					'emailautomovilista :"' + data.rows[i].email + '", ' +
					'celularautomovilista :"' + data.rows[i].celular + '", ' +
					'puntosparken :' + data.rows[i].puntosparken + ', ' +
					'token :"' + data.rows[i].token + '"';

					if(i == data.rowCount - 1){	jeison = jeison + ' }'; } else { jeison = jeison + ' },'; }
				}
				jeison = jeison + '] }';

			} else{

			var	jeison = '{ ' +
					'success : 3' +
				' }';
			}

			jsonResponse = jeison;
			res.send(jsonResponse);

		}else{

				jsonResponse = '{ ' +
					'success : 2' +
				' }';

				res.send(jsonResponse);
		}


	});

});


//+ '} ] }';


/*
	app.post("/coordenadas/consultar", function(req, res){
		var id = req.body.id;

		Coordenadas.consultar(id, function(status, data){
			if(status == 0) { res.send('{success:0}'); }
			else {
				var resultados = [];
				data.rows.forEach(function(row){
					var resultado = {};
					resultado.coordenada1 = {latitud: row.lat1 , longitud: row.long1};
					resultado.coordenada2 = {latitud: row.lat2 , longitud: row.long2};
					resultados.push(row);
				});
				res.send(resultados);
			}
		});
	});

// ------------------------------------------------------------------

    app.post("/coordenadas/actualizar", function(req, res){
		var id = req.body.id;
		var lat1 = req.body.lat1;

		Coordenadas.actualizar(id,lat1, function(status, rows){
			if(status===1) {
				res.send('{success:1}');
			} else {
				res.send('{success:0}');
			}
		});

	});

// -------------------------------------------------------------------

	app.post("/login/login", function(req, res) {

		var email = req.body.email;
		var password = req.body.password;

		Employee.login(email,password,function(error,data) {
			if(data.rowCount != 0)
				res.send(
				"{"+
					"success : 1," +
					"id_employee : " + data.rows[0].id_employee+ "," +
					"name_p : '" + data.rows[0].name_p+ "'," +
					"last_name : '" + data.rows[0].last_name+ "'," +
					"email : '" + data.rows[0].email+ "'," +
					"phone : " + data.rows[0].phone+
				"}");
			else{
				Employee.checkEmail(email,function(error,data2) {
					if(data2.rowCount == 0) {
						res.send("{success:0,msg:'El email es incorrecto'}");
					}
					else if(data2.rows[0].password != password) {

						res.send("{success:0,msg:'El password es incorrecto}'");
					}
					else {
						res.send("{success:0,msg:'El email y el password son incorrectos}'");
					}

				});
			}
		});
	});


	app.post("/login/register", function(req, res) {

		var employee = {};
		employee.id_employee = req.body.id_employee;
		employee.email = req.body.email;
	    employee.phone =req.body.phone;
	    employee.password =req.body.password;

	    Employee.checkRegistered(employee.id_employee,function(error,data){
	    	if (data.rowCount == 0 )
	    		res.send("{success:3}");
	    	else if (data.rows[0].email != null)
	    		res.send("{success:2,email:'***" + data.rows[0].email.substr(3,data.rows[0].email.length-1) + "'}");
	    	else{
				Employee.register(employee,function(error,data) {
					if(error == 1)
						res.send("{success:0}");
					else
						res.send("{success:1}");
				});
			}
		});
	});

	app.post("/login/payment", function(req, res) {
		var payment = {};
		payment.id_employee = req.body.id_employee;
		payment.card_number = req.body.card_number;
		payment.holder_name = req.body.holder_name;
		payment.expiration_year = req.body.expiration_year;
		payment.expiration_month = req.body.expiration_month;
		payment.cvv = req.body.cvv;
		payment.address = req.body.address;

		Employee.addPayment(payment,function(error,data){
			if(error == 1)
				res.send("{success:0}");
			else
				res.send("{success:1}");
		});
	});
	app.post("/login/employee", function(req, res) {

		var id_employee = req.body.id_employee;

		Employee.checkRegistered(id_employee,function(error,data){
	    	if (data.rowCount == 0 )
	    		res.send("{success:3}");
	    	else if (data.rows[0].email != null)
	    		res.send("{success:2,email:'***" + data.rows[0].email.substr(3,data.rows[0].email.length-1) + "'}");
	    	else {
				Employee.getEmployee(id_employee,function(error,data) {
					if(error == 1)
						res.send("{success:0}");
					else {
						res.send(
						"{"+
							"success : 1," +
							"id_employee : " + data.rows[0].id_employee+ "," +
							"name_p : '" + data.rows[0].name_p+ "'," +
							"last_name : '" + data.rows[0].last_name+ "'," +
							"email : '" + ((data.rows[0].email==null)?"":data.rows[0].email) + "'," +
							"phone : '" + ((data.rows[0].phone==null)?"":data.rows[0].phone) + "'"+
						"}");
					}
				});
			}
		});
	});*/
}
