require("dotenv").config();

const secret = process.env.jwtSecret;

const bcrypt = require("bcrypt");
const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");
const { verifyAdmin, verifyUser } = require("../../functions/verifyAdmin");

const connection = require("../../../connection");

const saltRounds = 10;

Route.delete("/deleteJob/:jobId", verifyAdmin, (req, res) => {
  console.log("PARAMS =>", req.params.jobId);
  connection.query(
    `DELETE FROM jobs WHERE id = ?`,
    [req.params.jobId],
    (e, data) => {
      if (e) {
        console.log(e);
      }
      return res.json({ deletion: "Mission Succesful" });
    }
  );
});

module.exports = Route;
