//var Employee = require('../models/coordenadasModel');
//var Coordenadas = require('../models/coordenadasModel');
var Coordenadas = require('../models/functions');

module.exports  = function(app) {
		app.post("/automovilista/sigIn", function(req,res){
		console.log(req.body);

		//console.log(req.params);
		var nombre = req.body.nombre;
		var apellido =req.body.apellido;
		var correo = req.body.correo;
		var contrasena = req.body.contrasena;
		var celular = req.body.celular;


		Coordenadas.crearCuentaAuto(nombre, apellido, correo, contrasena, celular, function(status){
		console.log(status);
			if(status==1) { // Se ha creado exitosamente la cuenta.
				res.send('{success:1}');
			} else {
				res.send('{succes:0}');
			}
		});

	});

	app.post("/login", function(req,res){

		console.log(req.body);

		//console.log(req.params);
		var correo = req.body.correo;
		var contrasena = req.body.contrasena;
		var usuario = req.body.app;

		Coordenadas.iniciarSesion(correo, contrasena, usuario, function(status, data){
		console.log(status);
			if(status==1) {
				//console.log(data.rows[0].iniciarSesion);
				if (data.rows[0].iniciarSesion != null){	//Existe el usuario
					res.send('{success:1}');
				} else{		//No existe el ususario
					res.send('{success:2}');
				}
			} else {	//Error con la conexion a la bd
				res.send('{succes:0}');
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
