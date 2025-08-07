const express = require("express");
const Route = express.Router();
const bcrypt = require("bcrypt");

const connection = require("../../../connection");
const adminFunc = require("../../functions/verifyAdmin");

const saltRounds = 10;

Route.delete("/deleteUser/:userId", (req, res) => {
  console.log("PARAMS =>", req.params.userId);
  connection.query(
    "DELETE FROM workHours WHERE user_id = ?",
    [req.params.userId],
    (err, result) => {
      if (err) {
        return console.log(err);
      }

      // Now that associated records are deleted, delete the user
      connection.query(
        "DELETE FROM users WHERE id = ?",
        [req.params.userId],
        (error, data) => {
          if (error) {
            return console.log(error);
          } else {
            return res.json({ delete: "successful" });
          }
        }
      );
    }
  );
  return;
});

module.exports = Route;
