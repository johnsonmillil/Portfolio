require("dotenv").config();

const secret = process.env.jwtSecret;

const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");
const { verifyAdmin, verifyUser } = require("./functions/verifyAdmin");

const connection = require("../connection");

Route.get("/", verifyUser, (req, res) => {
  console.log("String Token", req.headers.authorization);
  const token = req.headers.authorization.replace("Bearer ", "").trim();
  console.log("Token => ", token);
  jwt.verify(token, secret, (e, data) => {
    if (e) {
      console.log("probelm verifying", e);
    }
    console.log("DATA => ", data);
    connection.query(
      `SELECT DISTINCT workHours.project_id,jobs.name,jobs.description
    FROM workHours
    INNER JOIN jobs ON workHours.project_id = jobs.id 
    WHERE user_id = ? AND jobs.active = 1 `,
      [data.user_id],
      (e, jobs) => {
        if (e) {
          console.log("querry problem");
          return res.json({ error: "error with query" });
        }
        console.log("Jobssss  ", jobs);
        res.json({ jobs });
      }
    );
  });
});

// /jobs/allJobs

Route.get("/allJobs", verifyAdmin, (req, res) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization.replace("Bearer ", "").trim();
  console.log("TOKEN =>", token);
  jwt.verify(token, secret, (e, data) => {
    if (e) {
      console.log("probelm verifying", e);
    }
    console.log(data);
    connection.query(
      `SELECT * FROM jobs
    ORDER BY name ASC; `,
      (e, jobs) => {
        if (e) {
          console.log("querry problem");
          return res.json({ error: "error with query" });
        }
        console.log("Jobssss  ", jobs);
        res.json({ jobs });
      }
    );
  });
});

module.exports = Route;
