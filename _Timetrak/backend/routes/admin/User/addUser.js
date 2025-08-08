const express = require("express");
const Route = express.Router();
const bcrypt = require("bcrypt");

const connection = require("../../../connection");
const adminFunc = require("../../functions/verifyAdmin");

const saltRounds = 10;

Route.post("/addUser", adminFunc.verifyAdmin, (req, res) => {
  const { username, password, hourly_pay, role } = req.body;

  connection.query(
    `SELECT * FROM users WHERE username = '${username}'`,
    (e, user) => {
      if (e) {
        console.log("ERROR ", e);
        return res
          .status(500)
          .json({ login: false, error: "Internal Server Error" });
      } else if (user.length > 0) {
        console.log("username already taken");
        return res.status(500).json({ usernameAvailable: false });
      } else {
        bcrypt.genSalt(saltRounds, (e, salt) => {
          if (e) {
            console.log(e);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          bcrypt.hash(password, salt, function (e, hash) {
            if (e) {
              console.log("password hash operation unsuccessful");
              return res.status(500).json({ error: "Internal Server Error" });
            }

            connection.query(
              `INSERT INTO users (username, password,hourly_pay, role) VALUES (?, ?, ?, ?)`,
              [username, hash, hourly_pay, role],
              (e) => {
                if (e) {
                  console.log("Error adding user:", e);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }
                res.status(201).json({ status: "new user created" });
              }
            );
          });
        });
      }
    }
  );
});

module.exports = Route;
