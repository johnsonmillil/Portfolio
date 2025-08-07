const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');

// CORS configuration to allow only a specific origin
 const corsOptions = {
  origin: 'http://ec2-23-20-246-112.compute-1.amazonaws.com:3000',
optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Use CORS with specified options before all route handlers
 app.use(cors(corsOptions));

const connection = require("./connection");
const login = require("./routes/login");
const jobs = require("./routes/getJobsList");
const checkInOut = require("./routes/checkInOut");
const addUser = require("./routes/admin/User/addUser");
const editUser = require("./routes/admin/User/editUser");
const assignJob = require("./routes/admin/User/AssignJob");
const getUsers = require("./routes/admin/User/getUsers");
const daily = require("./routes/reports/daily");
const singleUserReport = require("./routes/reports/singleUserReport");
const weekly = require("./routes/reports/weekly");
const monthly = require("./routes/reports/monthly");
const yearly = require("./routes/reports/yearly");
const addJobs = require("./routes/admin/Jobs/addJobs");
const deleteJob = require("./routes/admin/Jobs/deleteJob");
const editJob = require("./routes/admin/Jobs/editJob");
const deleteUser = require("./routes/admin/User/deleteUser");


// Apply JSON parsing middleware
app.use(express.json());

app.use("/login", login);
app.use("/admin", addUser);
app.use("/jobs", jobs);
app.use("/users", getUsers);
app.use("/users", editUser);
app.use("/users", deleteUser);
app.use("/jobs", addJobs);
app.use("/jobs", assignJob);
app.use("/jobs", deleteJob);

app.use("/jobs", editJob);
app.use("/", checkInOut);
app.use("/reports", daily);
app.use("/reports", weekly);
app.use("/reports", monthly);
app.use("/reports", yearly);
app.use("/reports", singleUserReport);

// Serve static files from the React app's dist folder
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// The "catchall" handler: for any requests that don't
// match the ones above, send back the React app's index.html file from the dist folder.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`running on port ${PORT}`));


