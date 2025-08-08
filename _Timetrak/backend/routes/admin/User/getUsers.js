const express = require("express");
const Route = express.Router();
const bcrypt = require("bcrypt");

const connection = require("../../../connection");
const adminFunc = require("../../functions/verifyAdmin");

const saltRounds = 10;

Route.get("/allUsers", adminFunc.verifyAdmin, (req, res) => {
  connection.query("SELECT * FROM users ORDER BY username;", (e, data) => {
    if (e) {
      console.log(e);
    }
    console.log(data);
    return res.json({ userList: data });
  });
});

Route.get("/getUser/:userId", adminFunc.verifyAdmin, (req, res) => {
  const userId = req.params.userId;

  connection.query(`SELECT * FROM users WHERE id = ? `, [userId], (e, data) => {
    if (e) {
      console.log(e);
    }

    return res.json({ user: data });
  });
});

Route.put("/getUser/:userId", adminFunc.verifyAdmin, (req, res) => {
  const userId = req.params.userId;

  connection.query(`SELECT * FROM users WHERE id = ?`, [userId], (e, data) => {
    if (e) {
      console.log(e);
    }

    return res.json({ user: data });
  });
});

module.exports = Route;
