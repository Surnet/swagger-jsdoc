var testDataDefinitions = [
  {
    "definition": {
      "Login": {
        "required": ["username", "password"],
        "properties": {
          "username": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        }
      }
    }
  },
  {
    "definitions": {
      "Login2": {
        "required": ["username", "password"],
        "properties": {
          "username": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        }
      }
    }
  }
];

module.exports = {
  definitions: testDataDefinitions
};
