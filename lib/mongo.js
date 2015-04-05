var util = require('util'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    async = require('async'),
    _ = require('underscore');


var Mongo = function(config) {
  util.log('Connect to MongoDB...');
  this.config = config;
  var server = new Server(this.config.host, this.config.port, {
    auto_reconnect: true
  });
  this.db = new Db('local', server, {
    safe: true
  });
  this.db.open(function (err, db) {
    if (err) throw err;
  });
  this.db.on("close", function (error) {
    util.log("Connection to the database was closed!");
  });
};

module.exports = Mongo;
