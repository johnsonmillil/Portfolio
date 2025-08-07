const bcrypt = require("bcrypt");
const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");
const { verifyAdmin, verifyUser } = require("../../functions/verifyAdmin");

const connection = require("../../../connection");

const saltRounds = 10;

Route.post("/editJob", verifyAdmin, (req, res) => {
  const reqBody = req.body;
  reqBody.active = Number(reqBody.active);
  connection.query(
    `UPDATE jobs
  SET name = ?, description = ?, active = ?
  WHERE id= ?`,
    [reqBody.name, reqBody.description, reqBody.active, reqBody.jobId],
    (e, data) => {
      if (e) {
        return console.log("error");
      }
      console.log(data);
      return res.json({ jlb: "update succesful" });
    }
  );
});

Route.post("/getJob", verifyAdmin, (req, res) => {
  const jobId = req.body.jobId;
  connection.query(`SELECT * FROM jobs WHERE id = ?`, [jobId], (e, data) => {
    if (e) {
      return console.log(e);
    }
    return res.json({ data });
  });
});

module.exports = Route;
