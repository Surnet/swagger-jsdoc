var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var coffee = require('coffee-script');
var url = require('url');

var doctrine = require('doctrine');
var express = require('express');
var descriptor = {};
var resources = {};

/**
 * Read from yml file
 * @api    private
 * @param  {String}   file
 * @param  {Function} fn
 */
function readYml(file, fn) {
  var resource = require(path.resolve(process.cwd(), file));
  var api = {};

  api.resourcePath = resource.resourcePath;
  api.description = resource.description;
  descriptor.apis.push(api);
  resources[resource.resourcePath] = resource;

  fn();
}

/**
 * Parse jsDoc from a js file
 * @api    private
 * @param  {String}   file
 * @param  {Function} fn
 */
function parseJsDocs(file, fn) {
  fs.readFile(file, function (err, data) {
    if (err) {
      fn(err);
    }

    var js = data.toString();
    var regex = /\/\*\*([\s\S]*?)\*\//gm;
    var fragments = js.match(regex);
    var docs = [];

    if (!fragments) {
      fn(null, docs);
      return;
    }
    
    for (var i = 0; i < fragments.length; i++) {
      var fragment = fragments[i];
      var doc = doctrine.parse(fragment, { unwrap: true });

      docs.push(doc);

      if (i === fragments.length - 1) {
        fn(null, docs);
      }
    }
  });
}

/**
 * Parse coffeeDoc from a coffee file
 * @api    private
 * @param  {String}   file
 * @param  {Function} fn
 */
function parseCoffeeDocs(file, fn) {
    fs.readFile(file, function (err, data) {
        if (err) {
            fn(err);
        }

        var js = coffee.compile(data.toString());
        var regex = /\/\**([\s\S]*?)\*\//gm;
        var fragments = js.match(regex);
        var docs = [];

        for (var i = 0; i < fragments.length; i++) {
            var fragment = fragments[i];
            var doc = doctrine.parse(fragment, { unwrap: true });

            docs.push(doc);

            if (i === fragments.length - 1) {
                fn(null, docs);
            }
        }
    });
}

/**
 * Get jsDoc tag with title '@swagger'
 * @api    private
 * @param  {Object} fragment
 * @param  {Function} fn
 */
function getSwagger(fragment, fn) {
  for (var i = 0; i < fragment.tags.length; i++) {
    var tag = fragment.tags[i];
    if ('swagger' === tag.title) {
      return yaml.safeLoadAll(tag.description, fn);
    }
  }

  return fn(false);
}

/**
 * Read from jsDoc
 * @api    private
 * @param  {String}  file
 * @param  {Function} fn
 */
function readJsDoc(file, fn) {
  parseJsDocs(file, function (err, docs) {

    if (err) {
      fn(err);
    }

    var resource = { apis: [] };

    async.eachSeries(docs, function (doc, cb) {
      getSwagger(doc, function (api) {

        if (!api) {
          return cb();
        }

        if (api.resourcePath) {
          descriptor.apis.push(api);
          resource.resourcePath = api.resourcePath;
        } else if (api.models) {
          resource.models = api.models;
        } else {
          resource.apis.push(api);
        }

        cb();
      });
    }, function (err) {
      resources[resource.resourcePath] = resource;
      fn();
    });
  });
}

/**
 * Read from coffeeDoc
 * @api    private
 * @param  {String}  file
 * @param  {Function} fn
 */
function readCoffee(file, fn) {
    parseCoffeeDocs(file, function (err, docs) {

        if (err) {
            fn(err);
        }

        var resource = { apis: [] };

        async.eachSeries(docs, function (doc, cb) {
            getSwagger(doc, function (api) {

                if (!api) {
                    return cb();
                }

                if (api.resourcePath) {
                    descriptor.apis.push(api);
                    resource.resourcePath = api.resourcePath;
                } else if (api.models) {
                    resource.models = api.models;
                } else {
                    resource.apis.push(api);
                }

                cb();
            });
        }, function (err) {
            resources[resource.resourcePath] = resource;
            fn();
        });
    });
}

/**
 * Read API from file
 * @api    private
 * @param  {String}   file
 * @param  {Function} fn
 */
function readApi(file, fn) {
  var ext = path.extname(file);
  if ('.js' === ext) {
    readJsDoc(file, fn);
  } else if ('.yml' === ext) {
    readYml(file, fn);
  } else if ('.coffee' === ext) {
    readCoffee(file, fn);
  } else {
    throw new Error('Unsupported extension \'' + ext + '\'');
  }
}

/**
 * Generate Swagger documents
 * @api    private
 * @param  {Object} opt
 */
function generate(opt) {
  if (!opt) {
    throw new Error('\'option\' is required.');
  }

  if (!opt.swaggerUI) {
    throw new Error('\'swaggerUI\' is required.');
  }

  if (!opt.basePath) {
     throw new Error('\'basePath\' is required.');
  }

  descriptor.basePath = opt.basePath;
  descriptor.apiVersion = (opt.apiVersion) ? opt.apiVersion : '1.0';
  descriptor.swaggerVersion = (opt.swaggerVersion) ? opt.swaggerVersion : '1.0';
  descriptor.swaggerURL = (opt.swaggerURL) ? opt.swaggerURL : '/swagger';
  descriptor.swaggerJSON = (opt.swaggerJSON) ? opt.swaggerJSON : '/api-docs.json';
  descriptor.apis = [];

  opt.apiVersion = descriptor.apiVersion;
  opt.swaggerVersion = descriptor.swaggerVersion;
  opt.swaggerURL = descriptor.swaggerURL;
  opt.swaggerJSON = descriptor.swaggerJSON;
  opt.fullSwaggerJSONPath = url.parse(opt.basePath + opt.swaggerJSON).path;

  if (opt.apis) {
    opt.apis.forEach(function (api) {
      readApi(api, function (err) {
        if (err) {
          throw err;
        }
      });
    });
  }
}

/**
 * Express middleware
 * @api    public
 * @param  {Object} app
 * @param  {Object} opt
 * @return {Function}
 */
exports.init = function (app, opt) {

  // generate resources
  generate(opt);

  // Serve up swagger ui static assets
  var swHandler = express['static'](opt.swaggerUI);

  // Serve up swagger ui interface.
  var swaggerURL = new RegExp('^'+ opt.swaggerURL +'(\/.*)?$');

  app.get(swaggerURL, function (req, res, next) {
    if (req.url === opt.swaggerURL) { // express static barfs on root url w/o trailing slash
      res.writeHead(302, { 'Location' : req.url + '/' });
      res.end();
      return;
    }

    // take off leading /swagger so that connect locates file correctly
    req.url = req.url.substr(opt.swaggerURL.length);
    return swHandler(req, res, next);
  });

  return function (req, res, next) {
    var match, resource, result;
    var regex = new RegExp('^'+ opt.fullSwaggerJSONPath +'(\/.*)?$');

    match = regex.exec(req.path);

    if (match) {
      result = _.clone(descriptor);

      if (match[1]) {

        resource = resources[match[1]];

        if (!resource) {
          return res.send(404);
        }

        result.resourcePath = resource.resourcePath;
        result.apis = resource.apis;
        result.models = resource.models;
      } else {
        result.apis = _.map(result.apis, function (api) {
          return {
            path: opt.swaggerJSON + api.resourcePath,
            description: api.description
          };
        });
      }
      
      if(typeof(opt.middleware) == 'function'){
          opt.middleware(req, res);
      }

      return res.json(result);
    }
    return next();
  };
};

