/* eslint no-unused-expressions: 0 */
import {
  extractAnnotations,
  hasEmptyProperty,
  loadDefinition,
} from '../src/utils.js';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Utilities module', () => {
  describe('hasEmptyProperty', () => {
    it('identifies object with an empty object or array as property', () => {
      const invalidA = { foo: {} };
      const invalidB = { foo: [] };
      const validA = { foo: { bar: 'baz' } };
      const validB = { foo: ['¯_(ツ)_/¯'] };
      const validC = { foo: '¯_(ツ)_/¯' };

      expect(hasEmptyProperty(invalidA)).toBe(true);
      expect(hasEmptyProperty(invalidB)).toBe(true);
      expect(hasEmptyProperty(validA)).toBe(false);
      expect(hasEmptyProperty(validB)).toBe(false);
      expect(hasEmptyProperty(validC)).toBe(false);
    });
  });

  describe('extractAnnotations', () => {
    it('should extract jsdoc comments by default', () => {
      expect(
        extractAnnotations(resolve(__dirname, '../examples/app/routes2.js'))
      ).toEqual({
        yaml: [],
        jsdoc: [
          '/**\n   * @swagger\n   * /hello:\n   *   get:\n   *     description: Returns the homepage\n   *     responses:\n   *       200:\n   *         description: hello world\n   */',
        ],
      });
    });

    it('should extract data from YAML files', () => {
      expect(
        extractAnnotations(
          resolve(__dirname, '../examples/app/parameters.yaml')
        )
      ).toEqual({
        yaml: [
          'parameters:\n  username:\n    name: username\n    description: Username to use for login.\n    in: formData\n    required: true\n    type: string\n',
        ],
        jsdoc: [],
      });

      expect(
        extractAnnotations(resolve(__dirname, '../examples/app/parameters.yml'))
      ).toEqual({
        yaml: [
          'parameters:\n  username:\n    name: username\n    description: Username to use for login.\n    in: formData\n    required: true\n    type: string\n',
        ],
        jsdoc: [],
      });
    });

    it('should extract jsdoc comments from coffeescript files/syntax', () => {
      expect(
        extractAnnotations(resolve(__dirname, '../examples/app/route.coffee'))
      ).toEqual({
        yaml: [],
        jsdoc: [
          '/**\n* @swagger\n* /login:\n*   post:\n*     description: Login to the application\n*     produces:\n*       - application/json\n*/',
        ],
      });
    });

    it('should return empty arrays from empty coffeescript files/syntax', () => {
      expect(
        extractAnnotations(resolve(__dirname, './fixtures/empty.coffee'))
      ).toEqual({
        yaml: [],
        jsdoc: [],
      });
    });

    it('should extract jsdoc comments from empty javascript files/syntax', () => {
      expect(
        extractAnnotations(resolve(__dirname, './fixtures/empty_file.js'))
      ).toEqual({
        yaml: [],
        jsdoc: [],
      });
    });
  });

  describe('loadDefinition', () => {
    const example = './fixtures/swaggerDefinition/example';

    it('should throw on bad input', async () => {
      await expect(loadDefinition('bad/path/to/nowhere')).rejects.toThrow(
        'Definition file should be .js, .json, .yml or .yaml'
      );
    });

    it('should support .json', async () => {
      const def = resolve(__dirname, `${example}.json`);
      const result = await loadDefinition(def);
      expect(result).toEqual({
        info: {
          title: 'Hello World',
          version: '1.0.0',
          description: 'A sample API',
        },
      });
    });

    it('should support .yaml', async () => {
      const def = resolve(__dirname, `${example}.yaml`);
      const result = await loadDefinition(def);
      expect(result).toEqual({
        info: {
          title: 'Hello World',
          version: '1.0.0',
          description: 'A sample API',
        },
      });
    });

    it('should support .cjs (commonjs)', async () => {
      const def = resolve(__dirname, `${example}.cjs`);
      const result = await loadDefinition(def);
      expect(result).toEqual({
        info: {
          title: 'Hello World',
          version: '1.0.0',
          description: 'A sample API',
        },
      });
    });

    it('should support .js (ESM)', async () => {
      const def = resolve(__dirname, `${example}.js`);
      const result = await loadDefinition(def);
      expect(result).toEqual({
        info: {
          title: 'Hello World',
          version: '1.0.0',
          description: 'A sample API',
        },
      });
    });
  });
});
