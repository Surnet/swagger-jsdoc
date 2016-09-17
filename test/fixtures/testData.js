var testDataDefinitions = [{"/":{"get":{"description":"Returns the homepage","responses":{"200":{"description":"hello world"}}}}},{"definition":{"Login":{"required":["username","password"],"properties":{"username":{"type":"string"},"password":{"type":"string"}}}}},{"tags":{"name":"Users","description":"User management and login"}},{"tags":[{"name":"Login","description":"Login"},{"name":"Accounts","description":"Accounts"}]},{"/login":{"post":{"description":"Login to the application","tags":["Users","Login"],"produces":["application/json"],"parameters":[{"$ref":"#/parameters/username"},{"name":"password","description":"User's password.","in":"formData","required":true,"type":"string"}],"responses":{"200":{"description":"login","schema":{"type":"object","$ref":"#/definitions/Login"}}}}}},{"/users":{"get":{"description":"Returns users","tags":["Users"],"produces":["application/json"],"responses":{"200":{"description":"users"}}}}},{"/users":{"post":{"description":"Returns users","tags":["Users"],"produces":["application/json"],"parameters":[{"$ref":"#/parameters/username"}],"responses":{"200":{"description":"users"}}}}}];
var testDataTags = [{"/hello":{"get":{"description":"Returns the homepage","responses":{"200":{"description":"hello world"}}}}}];
var data3 = [{"parameter":{"username":{"name":"username","description":"Username to use for login.","in":"formData","required":true,"type":"string"}}}];

module.exports = {
  definitions: testDataDefinitions,
  tags: testDataTags,
};
