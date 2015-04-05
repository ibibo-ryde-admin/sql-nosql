var lib = require("./lib");
var drivers = lib.drivers;
var config = require("./config");

var app = function() {
  app.config = config;
  app.db = drivers.mongo;
};
