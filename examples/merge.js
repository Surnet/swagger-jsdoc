import swaggerJsdoc from '../src/lib.js';

let testObject = {
  swaggerDefinition: {},
  apis: ['./test/fixtures/merge/*.yml'],
};

testObject = swaggerJsdoc(testObject);

console.log('testObject', testObject);
