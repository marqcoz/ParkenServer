const { Pool, Client } = require('pg');
var db = {};
var pgp = require("pg-promise")();
var cn = {
  user: 'marcos',
  host: 'ec2-18-224-27-38.us-east-2.compute.amazonaws.com',
  database: 'Parken',
  password: 'ma1029',
  port: 5432,
  max: 20, // set pool max size to 20
  min: 4, // set min pool size to 4
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
};


var pg_procedures = pgp(cn);

var pg = require("pg-pool");

db.pg = pg;
db.pg_procedures = pg_procedures;

const pool = new Pool(cn);
db.pool = pool;

const client = new Client(cn);
client.connect();

//Hola esta es una prueba porque esto esta muy raro

/*
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})
*/
/*
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
*/




/*
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})
*/
module.exports = db;
