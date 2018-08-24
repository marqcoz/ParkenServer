var Requests = require('../models/functions');
//var fire = require('./firebase');


/*
Enviar cuando recibe una peticion
Enviar cuando envia una respuesta
Hora - Fecha: Request from: remoteAddress: Function->Data Response:
Hora - Fecha: Response to: remoteAddress: Function->Data Response:
*/
//Requests.sendNotificationTopic('automovilista', 'Hola', 'como', 'estas', 'jajaj',function(status){});
//Requests.obtenerDatosAutomovilista('10002', function(status, response){});
/*
Declarar la funcion que enviara notificiaciones
esa funcion obtendra el valor del token
despues esa misma funcion con la variable del token
enviara un token
*/

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
	app.post("/login", function(req,res){

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

								if (data.rows[0].idsupervisor != null){

								}

								var user;
								if(usuario === '1') user = 'automovilista';
								if(usuario === '2') user = 'supervisor';

							console.log("El usuario " +  user + " " + data.rows[0].id  + " inició sesión");

							androidNotificationSingle(data.rows[0].id, user, 'Aviso', 'Inicio de sesión', 'Iniciaste sesión exitosamente', '');
							res.send(jsonResponse);
					//No existe el ususario
					}
				}else{
					jsonResponse = '{success:2, id:0}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{succes:0}';
				res.send(jsonResponse);
			}
		});

	});

function androidNotificationSingle(idUser, tipoUser, tipoNotificacion, titulo, mensaje, accion){
	//Funcion que envia una notificación
	//Necesitamos llamar a la funcion obtenerDatosAutomovilista
	if(tipoUser === 'automovilista'){
		Requests.obtenerDatosAutomovilista(idUser, function(status, data){
			//Aqui adentro obtenemos el id y despues lo reenviamos a la funcion sendNotificationSingle
			if(status==1) {
				if(data.rowCount != 0){
					if (data.rows[0].token != null){
						//enviamos el token a la  funcion para enviar notificiaciones
						Requests.sendNotificationSingle(data.rows[0].token, tipoNotificacion, titulo, mensaje, accion, function(status, data){});
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


	if(tipoUser === 'supervisor'){
		Requests.obtenerDatosSupervisor(idUser, function(status, data){
			//Aqui adentro obtenemos el id y despues lo reenviamos a la funcion sendNotificationSingle
			if(status==1) {
				if(data.rowCount != 0){
					if (data.rows[0].token != null){
						//enviamos el token a la  funcion para enviar notificiaciones
						Requests.sendNotificationSingle(data.rows[0].token, tipoNotificacion, titulo, mensaje, accion, function(status, data){});
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
}



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
				jsonResponse = '{succes:0}';
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
								'"estatus":' + data.rows[i].estatus + ', ' +
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
							res.send(jsonResponse);

					//No existe el ususario

				}else{
					jsonResponse = '{"success":2, "Zonas": 0}';
					res.send(jsonResponse);
				}

		// Error con la conexion a la bd
			} else {
				jsonResponse = '{success:0}';
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
								'"estatus":' + data.rows[i].estatus + ', ' +
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
				jsonResponse = '{succes:0}';
				res.send(jsonResponse);
			}
		});

	});

	// Función para buscar si existen zonas parken cercanas a un punto geografico.
	app.post("/automovilista/buscarEspacioParken", function(req,res){
	/*
	{ "success":1,
	"id":130,
	"ubicacion": [ {
			"latitud": -99.0,
			"longitud": 12.34 } ]
	}
	*/

		var jeison;
		var latitud = req.body.latitud;
		var longitud	 = req.body.longitud;

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

	});

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
	app.post("/automovilista/actualizarDatos", function(req,res){


		//
		var id = req.body.id;
		var column = req.body.column;
		var value = req.body.value;
		var user = 'automovilista';

		Requests.actualizar(user, id, column, value, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				jsonResponse = '{success:1}';
				androidNotificationSingle(id, 'automovilista', 'Aviso', 'Actualización del perfil', 'Se modificó la información de tu perfil exitosamente', '');
				res.send(jsonResponse);
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
			if(status==1) {
				//Primero validamos si data nos devuelve registros
				if(data.rowCount != 0){

							jeison = '{ "success":1, ' +
							'"idSesionParken":"' + data.rows[0].book_parken_space + '" }';
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
					jsonResponse = '{success:2}';
					res.send(jsonResponse);
				}else{
					jsonResponse = '{success:0}';
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
								'"Fecha":"' + data.rows[i].fecha + '", ' +
								'"Hora":"' + data.rows[i].hora + '", ' +
								'"Monto":"' + data.rows[i].monto + '", ' +
								'"Observaciones":"' + data.rows[i].observacion + '", ' +
								'"Estatus":"' + data.rows[i].estatus + '", ' +
								'"FechaPago":"' + data.rows[i].fechapago + '", ' +
								'"HoraPago":"' + data.rows[i].horapago + '", ' +
								'"idAutomovilista":"' + data.rows[i].idautomovilista + '", ' +
								'"idVehiculo":"' + data.rows[i].idvehiculo + '", ' +
								'"ModeloVehiculo":"' + data.rows[i].modelo + '", ' +
								'"PlacaVehiculo":"' + data.rows[i].placa + '", ' +
								'"MarcaVehiculo":"' + data.rows[i].marca + '", ' +
								'"idSupervisor":"' + data.rows[i].idsupervisor + '", ' +
								'"idEspacioParken":"' + data.rows[i].idespacioparken + '", ' +
								'"Coordenadas": [ {' +
								'"latitud":' + centroArray[1] + ', ' +
								'"longitud":' + centroArray[0] + '} ],' +
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


		//
		var idSancion = req.body.idSancion;


		Requests.pagarSancion(idSancion, function(status, data){

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
					jsonResponse = '{success:1, idReporte:' + data.rows[0].idreporte +'}';
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

	// Función para desactivar una sesionparken
	app.post("/automovilista/desactivarSesionParken", function(req,res){



		var idSesion = req.body.idSesionParken;
		var estatus = req.body.Estatus;

		var jeison;

		Requests.desactivarSesionParken(idSesion, estatus, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
				//Primero validamos si data nos devuelve un registros
				if(data.rowCount != 0){
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



		var idSesionParken = req.body.idSesionParken;
		var idAutomovilista = req.body.idAutomovilista;
		var fechaFinal = req.body.FechaFinal;
		var monto = req.body.Monto;
		var tiempo = req.body.Tiempo;
		var idVehiculo = req.body.idVehiculo;
		var puntosParken = req.body.puntosParken;
		var opc = req.body.opc;

		Requests.activarSesionParken(idSesionParken, idAutomovilista, fechaFinal, monto, tiempo, idVehiculo, puntosParken, opc, function(status, data){

			var jsonResponse = null;
			// Consuta generada con éxito
			if(status==1) {
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
			jsonResponse = '{success:1}';
			res.send(jsonResponse);
	// Ocurrió un error
		} else {
			jsonResponse = '{success:0}';
				res.send(jsonResponse);
		}
	});

});


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
