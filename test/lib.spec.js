import swaggerJsdoc from '../src/lib.js';

describe('Main lib module', () => {
  describe('General', () => {
    it('should support custom encoding', () => {
      const result = swaggerJsdoc({
        swaggerDefinition: {
          info: {
            title: 'Example weird characters',
            version: '1.0.0',
          },
        },
        apis: ['./test/fixtures/non-utf-file.js'],
        encoding: 'ascii',
      });

      expect(result.paths).toEqual({
        '/no-utf8': {
          get: {
            description:
              "p\u001d\u00175D\u0015E\u0000a87p\u001d\u0019$ a:\u0018a;#p\u001d\u0019'a8;D\u000f",
            responses: {
              200: {
                description:
                  'j\u001e\u000eG\u0012I<p\u001d\u0019\u001aa6\u0006 a;\u000bb2#E\u001da;+I1',
              },
            },
          },
        },
      });
    });
  });
});
