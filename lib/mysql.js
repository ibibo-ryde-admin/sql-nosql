var mysql = require('mysql'),
    _ = require('underscore'),
    util = require('util');

var MySQL = function(config) {
  util.log('Connect to MySQL...');
  var self = this;
  this.config = config;
};

MySQL.prototype.getConnection = function () {

  if (this.client && this.client._socket && this.client._socket.readable && this.client._socket.writable) {
    return this.client;
  }
  this.client = mysql.createConnection({
    host: this.config.host,
    port: this.config.port,
    user: this.config.username,
    password: this.config.password,
    multipleStatements: true
  });

  this.client.connect(function (err) {
    if (err) {
      util.log("SQL CONNECT ERROR: " + err);
    } else {
      util.log("SQL CONNECT SUCCESSFUL.");
    }
  });

  this.client.on("close", function (err) {
    util.log("SQL CONNECTION CLOSED.");
  });
  this.client.on("error", function (err) {
    util.log("SQL CONNECTION ERROR: " + err);
  });

  this.client.query('USE ' + this.config.mysql.db);
  return this.client;
};

MySQL.prototype.insert = function (table, item, callback) {

  item = transform(item);

  var self = this;
  var fields = [],
      values = [];
  _.each(item, function (val, key) {
    fields.push(key);
    if (typeof(val) === 'string') {
      val = val || '';
      val = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      values.push('"' + val + '"');
    } else if (typeof(val) === 'number') {
      values.push(val || 0);
    }
  });
  var fields_str = fields.join(', ');
  var values_str = values.join(', ');
  var sql = 'INSERT INTO ' + table + ' (' + fields_str + ') VALUES (' + values_str + ');';
  var conn = self.getConnection();
  conn.query(sql, function (err, results) {
    if (err) {
      util.log(sql);
      return callback(err);
    }
    return callback();
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
  _.each(item, function (val, key) {
    if (typeof(val) === 'string') {
      val = val || '';
      val = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      sets.push(key + ' = "' + val + '"');
    } else if (typeof(val) === 'int') {
      sets.push(key + ' = ' + (val || 0));
    }
  });

  _.each(unset_items, function (val, key) {
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
