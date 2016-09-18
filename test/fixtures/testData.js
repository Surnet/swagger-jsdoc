var testDataDefinitions = [
  {
    "definition": {
      "DefinitionSingular": {
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
      "DefinitionPlural": {
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

var testDataParameters = [
  {
    "parameter": {
      "ParameterSingular": {
        "name": "username",
        "description": "Username to use for login.",
        "in": "formData",
        "required": true,
        "type": "string"
      }
    }
  },
  {
    "parameters": {
      "ParameterPlural": {
        "name": "limit",
        "in": "query",
        "description": "max records to return",
        "required": true,
        "type": "integer",
        "format": "int32"
      }
    }
  }
  ];

module.exports = {
  definitions: testDataDefinitions,
  parameters: testDataParameters,
};
