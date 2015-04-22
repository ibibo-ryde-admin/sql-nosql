var mysql = require('mysql'),
    underscore = require('underscore'),
    util = require('util');

var MySQL = function(config) {
  util.log('Connect to MySQL...');
  var self = this;
  this.config = config;
};

MySQL.prototype.getConnection = function () {
  var self = this;
  if(self.connection) {
    return self.connection;
  }
  self.connection = mysql.createConnection({
    host: self.config.host,
    port: self.config.port,
    user: self.config.username,
    password: self.config.password
  });
  self.connection.connect(function(err) {
    if(err) {
      util.log("Error connection to mysql");
    }
    util.log("Connected to mysql...");
  });
  return self.connection;
};

MySQL.prototype.insert = function (table, row, callback) {
  var self = this;
  var connection = self.getConnection();
  var query = "INSERT INTO '" + table + "' (";
  var keys = Object.keys(row);
  var values = "";
  Object.keys(row).forEach(function(key) {
    
  });
};

MySQL.prototype.update = function (id, item, unset_items, callback) {
  if (item) {
    item = transform(item);
  }
  if (unset_items) {
    unset_items = transform(unset_items);
  }
  var self = this;
  var sets = [];
  underscore.each(item, function (val, key) {
    if (typeof(val) === 'string') {
      val = val || '';
      val = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      sets.push(key + ' = "' + val + '"');
    } else if (typeof(val) === 'int') {
      sets.push(key + ' = ' + (val || 0));
    }
  });

  underscore.each(unset_items, function (val, key) {
    if (typeof(val) === 'string') {
      sets.push(key + ' = ""');
    } else if (typeof(val) === 'int') {
      sets.push(key + ' = 0');
    }
  });

  if (sets.length === 0) return;

  var sets_str = sets.join(', ');
  var sql = 'UPDATE ' + this.config.mysql.table + ' SET ' + sets_str + ' WHERE _id = "' + id + '";';
  var conn = self.getConnection();
  conn.query(sql, function (err, results) {
    if (err) {
      util.log(sql);
      return callback(err);
    }
    return callback();
  });
};

MySQL.prototype.find = function(identifier, table, callback) {
  var query = "SELECT * from " + table + " WHERE " + "";
  var connection = self.getConnection();
  connection.query(query, function(err, results) {
    if(err || !results) {
      return callback(err || new Error("Error fetching results"));
    }
    return callback(null, results);
  });
};

function transform(item) {
  if (item.cid) {
    item.cid = parseInt(item.cid.replace('c', ''), 10);
  }
  if (item.vid) {
    item.vid = parseInt(item.vid, 10);
  }
  if (item.order) {
    item._order = item.order;
    delete item.order;
  }
  return item;
};

module.exports = MySQL;
