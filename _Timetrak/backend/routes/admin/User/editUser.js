const express = require("express");
const Route = express.Router();
const bcrypt = require("bcrypt");

const connection = require("../../../connection");
const adminFunc = require("../../functions/verifyAdmin");

const saltRounds = 10;

Route.put("/editUser/:userId", adminFunc.verifyAdmin, (req, res) => {
  const userId = req.params.userId;
  console.log("BODY +====", req.body);
  const { username, hourly_pay, role } = req.body;
  console.log("USERNAME =>>>", username);
  connection.query(
    `UPDATE users SET username = ?, hourly_pay = ?, role = ? WHERE id = ?`,
    [username, hourly_pay, role, userId],
    (e) => {
      if (e) {
        console.log("Error adding user:", e);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(201).json({ status: "user edited" });
    }
  );
});

Route.put("/editPassword/:userId", adminFunc.verifyAdmin, (req, res) => {
  const userId = req.params.userId;
  const { changedPassword } = req.body;

  bcrypt.genSalt(saltRounds, (e, salt) => {
    if (e) {
      console.log(e);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    bcrypt.hash(changedPassword, salt, function (e, hash) {
      if (e) {
        console.log("Password hash operation unsuccessful");
        return res.status(500).json({ error: "Internal Server Error" });
      }
      connection.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hash, userId],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          res.json({ update: "complete" });
        }
      );
    });
  });
});

Route.put("/editTime/:userId/:start/:projectId", (req, res) => {
  const { userId, start, projectId } = req.params;
  console.log(start);
  // const startDateTime = start.slice(0, -1).replace("T", " ");
  console.log(
    "SQL STATEMENT =>",
    `SELECT * FROM workHours WHERE user_id = ${userId} AND start_time LIKE "${start}" AND project_id = ${projectId}`
  );

  connection.query(
    `SELECT * FROM workHours WHERE user_id = ? AND start_time LIKE ? AND project_id = ?`,
    [userId, start, projectId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({ status: "unsuccessful" });
      } else {
        if (result.length > 0) {
          console.log(result);
          console.log(result[0].workhour_id);
          res.json({ workHourId: result[0].workhour_id });
        } else {
          console.log("No matching records found");
          res.json({ status: "no records found" });
        }
      }
    }
  );
});

// /users/
Route.put("/insertNewTime/:recordId/:start/:finish", (req, res) => {
  const { recordId, start, finish } = req.params;
  console.log("LOOKING => ", recordId, start, finish);
  connection.query(
    `UPDATE workHours
  SET start_time = ?, end_time = ?
  WHERE workhour_id = ?;`,
    [start, finish, recordId],
    (err, data) => {
      if (err) {
        res.json({ err: "error storing new Times" });
      }
      res.json({ newTimesInserted: true });
    }
  );
});

module.exports = Route;
