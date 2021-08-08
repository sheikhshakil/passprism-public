const express = require("express");
const bodyParser = require("body-parser");
const setLocals = require("../middlewares/setLocals");
const session = require("express-session");
const sessionConfigs = require('../apis/sessionConfigs')

const middlewares = [
  express.static("public"),
  session(sessionConfigs),
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json(),
  setLocals(),
];

module.exports = (app) => {
  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
};
