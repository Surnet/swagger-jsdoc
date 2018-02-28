'use strict';

module.exports.setup = function(app) {
  /**
   * @swagger
   * /invalid_yaml:
   * hey hey there
   *   im just some
   *     invalid yaml
   */
  app.get('/invalid_yaml', function(req, res) {
    res.send('I have a invalid swagger definition');
  });
};
