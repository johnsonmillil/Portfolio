require("dotenv").config();

const secret = process.env.jwtSecret;

const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");

const connection = require("../connection");
const { verifyUser } = require("./functions/verifyAdmin");

Route.post("/checkIn", (req, res) => {
  console.log(req.body);
  const { pId, startTime } = req.body;
  console.log(`pId = ${pId} startTime = ${startTime}`);
  const token = req.headers.authorization.replace("Bearer ", "").trim();
  jwt.verify(token, secret, (e, data) => {
    if (e) {
      console.log(e);
      return res.json({ error: "Problem verifying token to check in" });
    }
    console.log("data => ", data);
    connection.query(
      `INSERT INTO workHours (user_id,start_time,project_id) VALUES (?,?,?)`,
      [data.user_id, startTime, pId],
      (e, data) => {
        if (e) {
          return console.log("error=>", e);
        }
        const workHoursId = data.insertId;
        // console.log("lastInsertedID ===", workHoursId);
        return res.json({ added: true, workHoursId: workHoursId });
      }
    );
  });
});

Route.post("/checkOut", (req, res) => {
  const { endTime, wTimeId } = req.body;
  console.log(`WTId = ${wTimeId} startTime = ${endTime}`);
  const token = req.headers.authorization.replace("Bearer ", "").trim();
  jwt.verify(token, secret, (e, data) => {
    if (e) {
      console.log(e);
      return res.json({ error: "Problem verifying token to check in" });
    }
    connection.query(
      `UPDATE workHours
      SET end_time = ?
      WHERE workhour_id = ?;`,
      [endTime, wTimeId],
      (e, data) => {
        if (e) {
          console.log("error=>", e);
        }
        return res.json({ added: true, transaction: "complete" });
      }
    );
  });
});

module.exports = Route;
