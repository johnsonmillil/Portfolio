require("dotenv").config();

const secret = process.env.jwtSecret;

const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");

const connection = require("../../connection");
const { verifyUser, verifyAdmin } = require("../functions/verifyAdmin");

Route.get("/weekly", verifyUser, (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "").trim();
  console.log("TOKEN =>", token);
  const userId = req.userId;
  connection.query(
    `SELECT
    YEAR(week_start_date) AS workyear,
    WEEK(week_start_date) AS workweek,
    MIN(week_start_date) AS week_start_date,
    MAX(week_end_date) AS week_end_date,
    project_id,
    user_id,
    SUM(total_seconds) AS total_seconds
FROM (
    SELECT
        DATE(start_time - INTERVAL WEEKDAY(start_time) DAY) AS week_start_date,
        DATE_ADD(DATE(start_time - INTERVAL WEEKDAY(start_time) DAY), INTERVAL 6 DAY) AS week_end_date,
        project_id,
        user_id,
        SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time)))/3600 AS total_seconds
    FROM
        workHours
    WHERE
        user_id = ?
    GROUP BY
        week_start_date,
        project_id,
        user_id
) AS subquery
GROUP BY
    workyear,
    workweek,
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
      res.json({ weeklyTimes: times });
    }
  );
});

module.exports = Route;
