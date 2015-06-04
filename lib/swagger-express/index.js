
// This is the Swagger object that conforms to the Swagger 2.0 specification.
module.swaggerObject = {
    swagger: '2.0'
};

module.exports.init = function (app, options) {
    if (!options) {
        throw new Error('\'options\' is required.');
    }
    else if (!options.swaggerJsonPath) {
        throw new Error('\'swaggerJsonPath\' is required.');
    }
    else if (!options.swaggerUiPath) {
        throw new Error('\'swaggerUiPath\' is required.');
    }
    else if (!options.info) {
        throw new Error('\'info\' is required.');
    }
    else if (!options.info.title) {
        throw new Error('\'title\' is required.');
    }
    else if (!options.info.version) {
        throw new Error('\'version\' is required.');
    }
    else if (!options.apis) {
        throw new Error('\'apis\' is required.');
    }

    options.swaggerUiDir = options.swaggerUiDir || './swagger-ui';
    module.swaggerObject.info = options.info;

    // Parse the documentation in the apis array.

    // Attach to Express routes.
    app.get(swaggerJsonPath, function (req, res) {

    });

    app.get(swaggerUiPath), function (req, res) {

    };
};
