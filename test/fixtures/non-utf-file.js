/* istanbul ignore file */

module.exports = (app) => {
  /**
   * @swagger
   * /no-utf8:
   *   get:
   *     description: 𝗵ĕŀḷ𝙤 ẘợ𝙧ḻď
   *     responses:
   *       200:
   *         description: ꞎǒɼ𝙚ᶆ ịⲣŝừɱ
   */
  app.get('/no-utf8', () => {});
};
