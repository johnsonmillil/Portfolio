require("dotenv").config();

const secret = process.env.jwtSecret;

const bcrypt = require("bcrypt");
const express = require("express");
const Route = express.Router();
const jwt = require("jsonwebtoken");

const connection = require("../connection");

const saltRounds = 10;

Route.post("/", (req, res) => {
  const { username, password } = req.body;
  connection.query(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    (e, user) => {
      if (e) {
        console.log("ERROR ", e);
        return res
          .status(500)
          .json({ login: false, error: "Internal Server Error" });
      } else if (user.length === 0) {
        console.log("no results found", user);
        return res
          .status(500)
          .json({ login: false, error: "username not found" });
      }
      bcrypt.compare(password, user[0].password).then((result) => {
        if (result) {
          const token = jwt.sign(
            {
              user_id: user[0].id,
              role: user[0].role,
            },
            secret,
            { expiresIn: "2h" }
          );
          user[0].role === "admin"
            ? res
                .status(200)
                .json({
                  login: true,
                  token: token,
                  admin: true,
                  user_id: user[0].id,
                })
            : res.status(200).json({ login: true, token: token, admin: false });
        } else {
          return res
            .status(500)
            .json({ login: false, error: "incorect password" });
        }
      });
    }
  );
});

module.exports = Route;
