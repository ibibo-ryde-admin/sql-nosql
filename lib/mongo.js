var util = require('util'),
    MongoClient = require("mongodb").MongoClient,
    async = require('async'),
    underscore = require('underscore');


var Mongo = function(config) {
  util.log('Connect to MongoDB...');
  this.config = config;
  var self = this;
  var url = "mongodb://" + config.host + ":" + config.port + "/" + config.database;
  MongoClient.connect(url, function(err, database) {
    if(err) {
      throw new Error(err);
    }
    self.db = database;
    self.db.on("close", function (error) {
      util.log("Connection to the database was closed!");
    });
    return;
  });
};

Mongo.prototype.insert = function(collection_name, document, callback) {
  var self = this;
  var collection = self.db.collection(collection_name);
  collection.insert(document, function(err, result) {
    if(err || !result) {
      return callback(err || (new Error("Error: Couldn't insert document.")));
    }
    util.log("Insert Result: " + JSON.stringify(result));
    return callback(null, result);
  });
};

Mongo.prototype.update = function(collection_name, identifier, changes, callback) {
  var self = this;
  var collection = self.db.collection(collection_name);
  collection.update(identifier, changes, function(err, result) {
    if(err || !result) {
      return callback(err || (new Error("Error: Couldn't update document.")));
    }
    return callback(null, result);
  });
};

Mongo.prototype.find = function(collection_name, identifier, callback) {
  var self = this;
  var collection = self.db.collection(collection_name);
  collection.find(identifier, function(err, result) {
    if(err || !result) {
      return callback(err || (new Error("Error: Couldn't fetch documents")));
    }
    return callback(null, result);
  });
};

module.exports = Mongo;

/*
 * Test code
 */
if(require.main === module) {
  var config = require("../config");
  var mongodb = Mongo(config.app.db);
}
