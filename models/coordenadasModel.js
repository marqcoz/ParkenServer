var db = require("../models/pgConfig");

var employeeModel = {};

var coordenadasModel = {};

coordenadasModel.subir = function(nombre, apellido, correo, contrasena, cel, callback) {
	console.log('Por lo menos entre');

	//var sql = "INSERT INTO points (nombre, geom, latitud, longitud, tiempo) VALUES ("
	//	+imei+","
	//	+"ST_GeomFromText('";
//        var sql2 ="POINT("+longi+" "+lati+")'),"
//		+lati+","
//		+longi+","
//		+ "'";

//La consulta seria
//INSERT INTO automovilista(nombre,apellido,email,contrasena, celular, puntosparken,estatus) VALUES(nombre,apellido,correo,contrasena,celular,0.0,"Disponible")
var sql = "INSERT INTO automovilista(nombre,apellido,email,contrasena, celular, puntosparken,estatus) VALUES(";
var sql2 = "'"+nombre+"','"+apellido+"','"+correo+"','"+contrasena+"','"+cel+"'";
var sql3 = ",0.0,'Disponible')";

var Pool = require('pg-pool')
//console.log(sql+sql2+sql3);
//var pool = new Pool()
var pool = new Pool({
  database: 'ParkenTest',
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  ssl: true,
  max: 20, // set pool max size to 20
  min: 4, // set min pool size to 4
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
})
pool.connect().then(client => {
  client.query(sql+sql2+sql3)
		/* ['pg-pool']).then(res => {
    client.release()
    console.log('hello from', res.rows[0].name)
  })*/
  .catch(e => {
    client.release()
    console.error('query error', e.message, e.stack)
  })
})
/*
	db.pg.(db.cntString, function(err, client, done) {
		if(err) {
			console.log("error de conexión: " + err);
		}
		client.query(sql+sql2+sql3, function(error, rows){
			done();
			if (error) { callback(0, rows); }
			else { callback(1, rows); }
		});
	});*/
};

/*

coordenadasModel.consultar = function (id, callback){
	var sql = "SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM(SELECT 'Feature' As type,ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json ((SELECT l FROM (SELECT id, nombre) As l)) As properties FROM calle as lg WHERE id ="+id+" ) as f) as fc;";
	db.pg.connect(db.cntString, function(err,client, done){
		if(err){
			console.log("not able to get connection "+ err);
		}
		client.query(sql,function(error,rows) {
			done();
			if(error) { callback(0, rows); }
			else { callback(1, rows); }
		});

	});
};

// --------------------------------------------------

coordenadasModel.actualizar = function (id,lat1, callback){
	var sql = "UPDATE registro SET lat1="+lat1+" WHERE id = "+id+";";
	db.pg.connect(db.cntString, function(err,client, done){
		if(err){
			console.log("not able to get connection "+ err);
		}
		client.query(sql,function(error,rows) {
			done();
			if(error) { callback(0, rows); }
			else { callback(1, rows); }
		});

	});
};


// --------------------------------------------------

employeeModel.login = function(email,password,callback)
{
	var sql =
		"SELECT * FROM employee " +
		"WHERE email = '" + email + "' " +
		"AND password= '" + password + "'";

	db.pg.connect(db.cntString,function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
		}
		client.query(sql,function(error,rows) {
			done();
			if(error) { callback(1, rows); }
			else { callback(null, rows); }
		});
	});
}


employeeModel.checkRegistered = function(id_employee,callback)
{
	var sql = "SELECT * FROM employee WHERE id_employee = " + id_employee;

	db.pg.connect(db.cntString,function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
		}
		client.query(sql,function(error,rows) {
			done();
			if(error) { callback(1, rows); }
			else { callback(null, rows); }
		});
	});
}

employeeModel.checkEmail = function(email,callback)
{
	var sql = "SELECT password FROM employee WHERE email = '" + email + "'";

	db.pg.connect(db.cntString,function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
		}
		client.query(sql,function(error,rows) {
			done();
			if(error) { callback(1, rows); }
			else { callback(null, rows); }
		});
	});
}


employeeModel.register = function(employee,callback)
{
	var sql =
		"UPDATE employee SET " +
		"email = '" + employee.email + "', " +
		"phone = '" + employee.phone + "', " +
		"password = '" + employee.password + "' " +
		"WHERE id_employee = " + employee.id_employee;

	db.pg.connect(db.cntString,function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
		}
		client.query(sql,function(error,rows) {
			done();
			if(error) { callback(1,rows); }
			else { callback(null, rows); }
		});
	});
}

employeeModel.addPayment = function(payment,callback)
{
	var sql =
		"UPDATE employee SET " +
		"card_number = '" + payment.card_number + "', " +
		"holder_name = '" + payment.holder_name + "', " +
		"expiration_year = " + payment.expiration_year + ", " +
		"expiration_month = " + payment.expiration_month + ", " +
		"cvv = " + payment.cvv + ", " +
		"address = '" + payment.address + "' " +
		"WHERE id_employee = " + payment.id_employee;

	db.pg.connect(db.cntString,function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
		}
		client.query(sql,function(error,rows) {
			done();
			if(error) { callback(1,rows); }
			else { callback(null, rows); }
		});
	});
}

employeeModel.getEmployee = function(id_employee,callback)
{
	var sql = 'SELECT * FROM employee WHERE id_employee = ' + id_employee;

	db.pg.connect(db.cntString,function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
		}
		client.query(sql,function(error,rows) {
			done();
			if(error) { callback(1, rows); }
			else { callback(null, rows); }
		});
	});
}

//module.exports = employeeModel;*/
module.exports = coordenadasModel;
