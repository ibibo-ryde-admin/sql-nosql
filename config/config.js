"use strict";

var config = {
  app: {
    db: {
      driver: "",
      host: "",
      port: "",
      username: "",
      password: "",
      database: ""
    }
  },
  sync: {
    collections: [],
    master: {
      driver: "",
      host: "",
      port: "",
      username: "",
      password: "",
      database: ""
    },
    slave: {
      driver: "",
      host: "",
      port: "",
      username: "",
      password: "",
      database: ""
    }
  }
};

module.exports = config;
