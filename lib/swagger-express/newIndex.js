

var swaggerObject = {};

module.exports.init = function (app, options) {
    if (!options) {
        throw new Error('\'options\' is required.');
    }
    else if (!options.swaggerJsonPath) {
        throw new Error('\'swaggerJsonPath\' is required.');
    }
    else if (!options.swaggerUiDir) {
        throw new Error('\'swaggerUiDir\' is required.');
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



    // Attach to Express routes.

};
