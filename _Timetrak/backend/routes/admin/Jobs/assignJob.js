const express = require("express");
const Route = express.Router();
const bcrypt = require("bcrypt");

const connection = require("../../../connection");
const adminFunc = require("../../functions/verifyAdmin");

const saltRounds = 10;

Route.post("/assignJob/:id", adminFunc.verifyUser, (req, res) => {
  console.log(req.body);
});

module.exports = Route;
