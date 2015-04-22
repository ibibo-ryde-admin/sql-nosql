"use strict";

var config = {
  app: {
    db: {
      driver: "mongodb",
      host: "localhost",
      port: 27017,
      username: "",
      password: "",
      database: "ryde"
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
