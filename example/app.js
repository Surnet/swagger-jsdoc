
/**
 * Module dependencies.
 */

var express = require('express')
  , api = require('./api')
  , http = require('http')
  , path = require('path')
  , swagger = require('../');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(swagger.init(app, {
    swaggerUI: './public/swagger/',
    basePath: 'http://localhost:3000',
    apis: ['./api.js']
    //apis: [__dirname + '/api.yml']
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('index', { title: 'Express' });
});

app.post('/login', api.login);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
