require("dotenv").config();

const secret = process.env.jwtSecret;

const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");

const connection = require("../../connection");
const { verifyUser, verifyAdmin } = require("../functions/verifyAdmin");

Route.get("/userTimes", verifyUser, (req, res) => {
  console.log("ReqObj ==>", req);
  const token = req.headers.authorization.replace("Bearer ", "").trim();
  // console.log("TOKEN =>", token);
  const userId = req.userId;
  // console.log("User Id", userId);
  connection.query(
    `SELECT
    DATE(w.start_time) AS workday,
    MONTH(w.start_time) AS workmonth, 
    YEAR(w.start_time) AS workyear,
    w.project_id,
    w.user_id,
    SUM(TIME_TO_SEC(TIMEDIFF(w.end_time, w.start_time))) AS total_seconds,
    j.name AS jobName
FROM
    workHours w
JOIN
    jobs j
ON
    w.project_id = j.id
WHERE
    w.user_id = ?
GROUP BY
    workday,
    workmonth,
    workyear,
    w.project_id,
    w.user_id,
    j.name
HAVING 
    total_seconds > 0
ORDER BY
    workday;
`,
    [userId],
    (e, dTimes) => {
      if (e) {
        res.json({
          errMessage:
            "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
        });
      }
      connection.query(
        `SELECT
        YEAR(week_start_date) AS workyear,
        WEEK(week_start_date) AS workweek,
        MONTH(subquery.start_time) AS workmonth,
        MIN(week_start_date) AS week_start_date,
        MAX(week_end_date) AS week_end_date,
        project_id,
        user_id,
        SUM(total_seconds) AS total_seconds,
        subquery.name AS jobName
    FROM (
        SELECT
            DATE(start_time - INTERVAL WEEKDAY(start_time) DAY) AS week_start_date,
            DATE_ADD(DATE(start_time - INTERVAL WEEKDAY(start_time) DAY), INTERVAL 6 DAY) AS week_end_date,
            w.project_id,
            w.user_id,
            start_time,
            SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time))) AS total_seconds,
            j.name
        FROM
            workHours w
        JOIN
            jobs j
        ON
            w.project_id = j.id
        WHERE
            w.user_id = ?
        GROUP BY
            week_start_date,
            w.project_id,
            w.user_id, start_time, j.name
        HAVING
            total_seconds > 0
    ) AS subquery
    GROUP BY
        workyear,
        workweek,
        project_id,
        user_id;
    `,
        [userId],
        (e, wTimes) => {
          if (e) {
            res.json({
              errMessage:
                "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
            });
          }
          connection.query(
            `SELECT
            YEAR(w.start_time) AS workyear,
            MONTH(w.start_time) AS workmonth,
            MIN(w.start_time) AS month_start_date,
            MAX(w.end_time) AS month_end_date,
            w.project_id,
            w.user_id,
            SUM(TIME_TO_SEC(TIMEDIFF(w.end_time, w.start_time))) AS total_seconds,
            j.name AS jobName
        FROM
            workHours w
        JOIN
            jobs j
        ON
            w.project_id = j.id
        WHERE
            w.user_id = ?
        GROUP BY
            workyear,
            workmonth,
            w.project_id,
            w.user_id,
            j.name
        HAVING 
            total_seconds > 0
        ORDER BY
            workyear, workmonth;`,
            [userId],
            (e, mTimes) => {
              if (e) {
                res.json({
                  errMessage:
                    "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
                });
              }
              connection.query(
                `SELECT
                YEAR(w.start_time) AS workyear,
                MIN(w.start_time) AS year_start_date,
                MAX(w.end_time) AS year_end_date,
                w.project_id,
                w.user_id,
                SUM(TIME_TO_SEC(TIMEDIFF(w.end_time, w.start_time))) AS total_seconds,
                j.name AS jobName
            FROM
                workHours w
            JOIN
                jobs j
            ON
                w.project_id = j.id
            WHERE
                w.user_id = ?
            GROUP BY
                workyear,
                w.project_id,
                w.user_id,
                j.name
            HAVING
                total_seconds > 0
            ORDER BY
                workyear;`,
                [userId],
                (e, yTimes) => {
                  if (e) {
                    res.json({
                      errMessage:
                        "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
                    });
                  }
                  res.json({
                    dailyTimes: dTimes,
                    weeklyTimes: wTimes,
                    monthlyTimes: mTimes,
                    yearlyTimes: yTimes,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

Route.post("/userTimes", verifyUser, (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "").trim();
  let userId;
  console.log("Found IT", req.body.selectedUser);

  if (req.body.selectedUser) {
    console.log("if");
    userId = req.body.selectedUser;
  } else {
    // userId = req.userId;
    console.log("else");
    userId = req.userId;
  }

  // const userId = req.userId;
  connection.query(
    `SELECT
    w.start_time AS workday,
    DATE_FORMAT(w.start_time, '%Y-%m-%d %H:%i:%s') AS dateString,
    DATE_FORMAT(w.end_time, '%Y-%m-%d %H:%i:%s') AS dateStringEnd,
    MONTH(w.start_time) AS workmonth, 
    YEAR(w.start_time) AS workyear,
    w.project_id,
    w.user_id,
    SUM(TIME_TO_SEC(TIMEDIFF(w.end_time, w.start_time))) AS total_seconds,
    j.name AS jobName
FROM
    workHours w
JOIN
    jobs j
ON
    w.project_id = j.id
WHERE
    w.user_id = ?
GROUP BY
    workday,
    workmonth,
    workyear,
    w.project_id,
    w.user_id,
    j.name
HAVING 
    total_seconds > 0
ORDER BY
    workday;
`,
    [userId],
    (e, dTimes) => {
      if (e) {
        res.json({
          errMessage:
            "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
        });
      }
      connection.query(
        `SELECT
        YEAR(week_start_date) AS workyear,
        WEEK(week_start_date) AS workweek,
        MONTH(subquery.start_time) AS workmonth,
        MIN(week_start_date) AS week_start_date,
        MAX(week_end_date) AS week_end_date,
        project_id,
        user_id,
        SUM(total_seconds) AS total_seconds,
        subquery.name AS jobName
    FROM (
        SELECT
            DATE(start_time - INTERVAL WEEKDAY(start_time) DAY) AS week_start_date,
            DATE_ADD(DATE(start_time - INTERVAL WEEKDAY(start_time) DAY), INTERVAL 6 DAY) AS week_end_date,
            w.project_id,
            w.user_id,
            start_time,
            SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time))) AS total_seconds,
            j.name
        FROM
            workHours w
        JOIN
            jobs j
        ON
            w.project_id = j.id
        WHERE
            w.user_id = ?
        GROUP BY
            week_start_date,
            w.project_id,
            w.user_id, start_time, j.name
		HAVING
			total_seconds > 0
    ) AS subquery
    GROUP BY
        workyear,
        workweek,
        project_id,
        user_id;
    `,
        [userId],
        (e, wTimes) => {
          if (e) {
            res.json({
              errMessage:
                "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
            });
          }
          connection.query(
            `SELECT
            YEAR(w.start_time) AS workyear,
            MONTH(w.start_time) AS workmonth,
            MIN(w.start_time) AS month_start_date,
            MAX(w.end_time) AS month_end_date,
            w.project_id,
            w.user_id,
            SUM(TIME_TO_SEC(TIMEDIFF(w.end_time, w.start_time))) AS total_seconds,
            j.name AS jobName
        FROM
            workHours w
        JOIN
            jobs j
        ON
            w.project_id = j.id
        WHERE
            w.user_id = ?
        GROUP BY
            workyear,
            workmonth,
            w.project_id,
            w.user_id,
            j.name
        HAVING
            total_seconds > 0
        ORDER BY
            workyear, workmonth;`,
            [userId],
            (e, mTimes) => {
              if (e) {
                res.json({
                  errMessage:
                    "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
                });
              }
              connection.query(
                `SELECT
                YEAR(w.start_time) AS workyear,
                MIN(w.start_time) AS year_start_date,
                MAX(w.end_time) AS year_end_date,
                w.project_id,
                w.user_id,
                SUM(TIME_TO_SEC(TIMEDIFF(w.end_time, w.start_time))) AS total_seconds,
                j.name AS jobName
            FROM
                workHours w
            JOIN
                jobs j
            ON
                w.project_id = j.id
            WHERE
                w.user_id = ?
            GROUP BY
                workyear,
                w.project_id,
                w.user_id,
                j.name
            HAVING
                total_seconds > 0
            ORDER BY
                workyear;`,
                [userId],
                (e, yTimes) => {
                  if (e) {
                    res.json({
                      errMessage:
                        "ISSUE RUNNING QUERY SELECT * FROM workHours WHERE user_id",
                    });
                  }
                  connection.query(
                    "SELECT hourly_pay FROM UserManagementDB.users WHERE id = ?",
                    [userId],
                    (err, payRate) => {
                      if (err) {
                        res.json({ allUsers: false });
                      }
                      console.log("Find me", payRate);
                      res.json({
                        dailyTimes: dTimes,
                        weeklyTimes: wTimes,
                        monthlyTimes: mTimes,
                        yearlyTimes: yTimes,
                        payRate: payRate,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

Route.post("/compJobs", verifyUser, (req, res) => {
  connection.query(
    `SELECT
    j.id AS id,
    j.name AS job_name,
    j.active AS job_active,
    SUM(TIMESTAMPDIFF(SECOND, w.start_time, w.end_time)) / 3600 AS total_hours,
    SUM((TIMESTAMPDIFF(SECOND, w.start_time, w.end_time) / 3600) * u.hourly_pay) AS total_cost
FROM workHours w
JOIN users u ON w.user_id = u.id
JOIN jobs j ON w.project_id = j.id
WHERE w.end_time > w.start_time
GROUP BY job_name
ORDER BY total_hours DESC;`,
    (err, overallGroupByHours) => {
      if (err) {
        console.log(err);
      }
      connection.query(
        `SELECT
      j.id AS id,
      j.name AS job_name,
      j.active AS job_active,
      SUM(TIMESTAMPDIFF(SECOND, w.start_time, w.end_time)) / 3600 AS total_hours,
      SUM((TIMESTAMPDIFF(SECOND, w.start_time, w.end_time) / 3600) * u.hourly_pay) AS total_cost
  FROM workHours w
  JOIN users u ON w.user_id = u.id
  JOIN jobs j ON w.project_id = j.id
  WHERE w.end_time > w.start_time
  GROUP BY job_name
  ORDER BY total_cost DESC;`,
        (err, overallGroupByCost) => {
          if (err) {
            console.log(err);
          }
          res.json({ overallGroupByHours, overallGroupByCost });
        }
      );
    }
  );
});

Route.get("/UserJobsReport/:jobId", (req, res) => {
  const jobId = req.params.jobId;
  connection.query(
    `SELECT
      u.id AS user_id,
      u.username AS user_username,
      j.active AS active,
      SUM(TIMESTAMPDIFF(SECOND, w.start_time, w.end_time)) / 3600 AS total_hours,
      SUM((TIMESTAMPDIFF(SECOND, w.start_time, w.end_time) / 3600) * u.hourly_pay) AS total_cost
    FROM workHours w
    JOIN users u ON w.user_id = u.id
    JOIN jobs j ON w.project_id = j.id
    WHERE w.end_time > w.start_time
      AND j.id = ?
    GROUP BY u.id, u.username
    ORDER BY total_hours DESC`,
    [jobId],
    (err, jobSortHours) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      connection.query(
        `SELECT
          u.id AS user_id,
          u.username AS user_name,
          j.active AS active,
          SUM(TIMESTAMPDIFF(SECOND, w.start_time, w.end_time)) / 3600 AS total_hours,
          SUM((TIMESTAMPDIFF(SECOND, w.start_time, w.end_time) / 3600) * u.hourly_pay) AS total_cost
        FROM workHours w
        JOIN users u ON w.user_id = u.id
        JOIN jobs j ON w.project_id = j.id
        WHERE w.end_time > w.start_time
          AND j.id = ?
        GROUP BY u.id, u.username
        ORDER BY total_cost DESC`,
        [jobId],
        (err, jobSortCost) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({ jobSortHours, jobSortCost });
        }
      );
    }
  );
});

module.exports = Route;
