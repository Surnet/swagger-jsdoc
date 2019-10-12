// Imaginary API helper
module.exports = function(consumer) {
  /**
   * @swagger
   *
   * baseTopic: command.service.foo
   * components:
   *   schemas:
   *     QoS:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           required: true
   *           example: 3
   *   messages:
   *     ICommand:
   *       summary: 'send foo command'
   *       tags:
   *         - name: 'company'
   *         - name: 'settings'
   *       headers:
   *         type: object
   *         properties:
   *           QoS:
   *             $ref: '#/components/schemas/QoS'
   *       payload:
   *         type: object
   *         properties:
   *           param:
   *             type: string
   *             required: true
   *             example: FooBarCommandParam
   *     ICommandResult:
   *       summary: 'receive foo command result after publish'
   *       tags:
   *         - name: 'company'
   *         - name: 'settings'
   *       headers:
   *         type: object
   *         properties:
   *           QoS:
   *             $ref: '#/components/schemas/QoS'
   *       payload:
   *         type: object
   *         properties:
   *           data:
   *             type: object
   *           error:
   *             type: string
   *             example: FooBar Not found
   *
   * topic:
   *   foo_result:
   *     subscribe:
   *       $ref: '#/components/schemas/ICommandResult'
   *   foo:
   *     publish:
   *       $ref: '#/components/schemas/ICommand'
   */
  consumer.subscribe('command.service.foo', () => {});
};
