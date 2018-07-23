"use strict";

// Imaginary API helper
module.exports = function(app) {
  /**
   * @swagger
   *
   * /:
   *  get:
   *   operationId: listVersionsv2
   *   summary: List API versions
   *   responses:
   *     '200':
   *       description: |-
   *         200 response
   *       content:
   *         application/json:
   *           examples:
   *             foo:
   *               value: {
   *                 "versions": [
   *                     {
   *                         "status": "CURRENT",
   *                         "updated": "2011-01-21T11:33:21Z",
   *                         "id": "v2.0",
   *                         "links": [
   *                             {
   *                                 "href": "http://127.0.0.1:8774/v2/",
   *                                 "rel": "self"
   *                             }
   *                         ]
   *                     },
   *                     {
   *                         "status": "EXPERIMENTAL",
   *                         "updated": "2013-07-23T11:33:21Z",
   *                         "id": "v3.0",
   *                         "links": [
   *                             {
   *                                 "href": "http://127.0.0.1:8774/v3/",
   *                                 "rel": "self"
   *                             }
   *                         ]
   *                     }
   *                 ]
   *              }
   *     '300':
   *       description: |-
   *         300 response
   *       content:
   *         application/json:
   *           examples:
   *             foo:
   *               value: |
   *                {
   *                 "versions": [
   *                       {
   *                         "status": "CURRENT",
   *                         "updated": "2011-01-21T11:33:21Z",
   *                         "id": "v2.0",
   *                         "links": [
   *                             {
   *                                 "href": "http://127.0.0.1:8774/v2/",
   *                                 "rel": "self"
   *                             }
   *                         ]
   *                     },
   *                     {
   *                         "status": "EXPERIMENTAL",
   *                         "updated": "2013-07-23T11:33:21Z",
   *                         "id": "v3.0",
   *                         "links": [
   *                             {
   *                                 "href": "http://127.0.0.1:8774/v3/",
   *                                 "rel": "self"
   *                             }
   *                         ]
   *                     }
   *                 ]
   *                }
   */
  app.get("/", function() {});
};
