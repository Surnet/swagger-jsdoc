'use strict';

var express = require('express'),
	routes = require('./routes'),
	swagger = require('jsdoc-express-with-swagger');

var app = express();

swagger.init(app, {
	swaggerJsonPath: '/api.json',
	swaggerUiPath: '/api',
	info: {
		title: 'Hello World',
		version: '1.0.0',
		apis: ['./routes.js']
	}
});

routes.setup(app);

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

	// FIXME: This is here for testing. Remove when finished.
	console.dir(swagger.swaggerObject);
});
