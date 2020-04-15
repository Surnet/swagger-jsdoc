import swaggerGen from 'swagger-jsdoc'

const options: swaggerGen.Options = {
  definition: {
    info: {
      title: 'Scheduler API',
      version: '1.0.0',
      description: 'TypeScript Example API',
    },
    host: 'localhost:8080',
    basePath: '/',
  },
  // path to files with swagger annotations
  // Note: relative to package.json
  // Note: since we transpile and then start, reference the dist directory + transpiled js files
  apis: [
    'dist/index.js',            // REST API
    'dist/api/example-api.js',  // REST API
    'dist/model/example.js',    // model
  ],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerGen(options);

/**
 * Publish swagger api document under path '/api-docs'
 * @param app
 */
export function enableSwagger(app: any) {
  app.get('/api-docs', function(req: any, res: any) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}
