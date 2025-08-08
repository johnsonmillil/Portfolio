require("dotenv").config();

const secret = process.env.jwtSecret;

const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");

const connection = require("../../connection");
const { verifyUser, verifyAdmin } = require("../functions/verifyAdmin");

Route.get("/yearly", verifyUser, (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "").trim();
  console.log("TOKEN =>", token);
  const userId = req.userId;
  console.log("userId ====", userId);
  connection.query(
    `SELECT
    YEAR(start_time) AS workyear,
    MIN(start_time) AS year_start_date,
    MAX(end_time) AS year_end_date,
    project_id,
    user_id,
    SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time))) AS total_seconds
FROM
    workHours
WHERE
    user_id = ?
GROUP BY
    workyear,
    project_id,
    user_id`,
    [userId],
    (e, times) => {
      if (e) {
        res.json({
          errMessage:
            "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
        });
      }
      res.json({ yearlyTimes: times });
    }
  );
});

module.exports = Route;
