import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import chalk from 'chalk';
import wkx from 'wkx';

Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
}
Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
}
Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
  return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
}
Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(value, options) {
  return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
}

const config = {
  host: process.env.dbhost,
  user: process.env.dbuser,
  password:process.env.dbpass,
  database: process.env.dbname,
  port:process.env.dbport
}

let Conn = new Sequelize(
	config.database,
	config.user,
	config.password,{
		dialect:'mysql',
		port:config.port,
		host:config.host,
		logging:false,
		define: {
	    // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
	    // This was true by default, but now is false by default
	    timestamps: false
	  },
	  pool:{
	  	max:5,
	  	min:0,
	  	idle:10000
	  }
	});

fs.readdirSync(path.join(__dirname,'models/'))
.filter( file=> (file.indexOf() !==0) && (file.slice(-3) === '.js') && file !== 'index.js' )
.forEach( file=> Conn.import(path.join(__dirname,'models/' + file)) )

Conn.sync({ force:false })

// cek koneksi ke database
Conn.authenticate().then(()=>{
	console.log(chalk.blue('Database Connected successfully'));
}).catch(err=>{	
	console.log(chalk.red('Unable to connect to database'));
});

export default Conn;
