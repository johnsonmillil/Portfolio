const express = require("express");
const Route = express.Router();
const bcrypt = require("bcrypt");

const connection = require("../../../connection");
const adminFunc = require("../../functions/verifyAdmin");

const saltRounds = 10;

Route.post("/addJob/:jobId/:userId", (req, res) => {
  console.log("PARAMS =>", req.params.jobId, req.params.userId);

  connection.query(
    `INSERT INTO workHours (user_id, start_time, end_time, project_id)
  VALUES (?, '0000-00-00 00:00:00', '0000-00-00 00:00:00', ?)`,
    [req.params.userId, req.params.jobId],
    (err, data) => {
      if (err) res.json({ addJob: false });
      res.json({ addJob: true });
    }
  );
});

module.exports = Route;
