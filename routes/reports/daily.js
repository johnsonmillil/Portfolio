require("dotenv").config();

const secret = process.env.jwtSecret;

const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");

const connection = require("../../connection");
const { verifyUser, verifyAdmin } = require("../functions/verifyAdmin");

Route.get("/daily", verifyUser, (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "").trim();
  console.log("TOKEN =>", token);
  const userId = req.userId;
  connection.query(
    `SELECT
    DATE(start_time) AS workday,
    project_id,
    user_id,
    SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time))) AS total_seconds
FROM
    workHours
WHERE
    user_id = ?
GROUP BY
    workday,
    project_id,
    user_id
HAVING 
  total_seconds > 0`,
    [userId],
    (e, times) => {
      if (e) {
        res.json({
          errMessage:
            "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
        });
      }
      res.json({ dailyTimes: times });
    }
  );
});

//reports/
// Route.get("/day/:id", (req, res) => {
//   const { id } = req.params;
//   return console.log("ok");
// });

module.exports = Route;
