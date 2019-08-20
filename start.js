require('dotenv').config();
require('babel-register')({
  presets: [
	    ['env', {
	      targets: {
	        node: 'current',
	      },
	    }],
	  ],
});
module.exports = require('./server.js');
