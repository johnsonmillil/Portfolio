const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "database-1.cjh6xpbyq4fq.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "CIS4375!",
  database: "UserManagementDB",
});

connection.connect((e) => {
  if (e) return console.log("connection error");
  console.log("connection established!");
});

connection.on("error", (err) => {
  console.error("MySQL connection error:", err.message);
});

module.exports = connection;
