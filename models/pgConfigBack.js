var pgp = require("pg-promise")();
var cn = {
    host: "localhost",
    port: 5432,
    database: 'demogis',
    user: 'postgres',
    password: 'postgres'
};
var pg_procedures = pgp(cn);

var pg = require("pg-pool");
var cntString = "postgres://postgres:postres@localhost:5432/ParkenTest";
var db = {};

db.cntString = cntString;
db.pg = pg;
db.	pg_procedures = pg_procedures;


module.exports = db;
