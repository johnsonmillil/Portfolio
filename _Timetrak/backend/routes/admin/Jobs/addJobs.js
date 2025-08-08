require("dotenv").config();

const secret = process.env.jwtSecret;

const bcrypt = require("bcrypt");
const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");
const { verifyAdmin, verifyUser } = require("../../functions/verifyAdmin");

const connection = require("../../../connection");

const saltRounds = 10;

Route.post("/addJob", verifyAdmin, (req, res) => {
  const reqBody = req.body;
  connection.query(
    `INSERT INTO jobs (name, description,active) VALUES (?,? ,?)`,
    [reqBody.name, reqBody.description, reqBody.active],
    (e, result) => {
      if (e) {
        console.log(e);
        return res.json({ errMessage: e });
      }
      console.log(result);
      res.json({ userAdded: "complete" });
    }
  );
});

module.exports = Route;
