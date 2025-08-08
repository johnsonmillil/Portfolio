# Timetrak: Time-Tracking App for Construction Workers

## Overview
Built a full-stack app for construction workers to clock in/out, manage jobs/users, and generate time reports (daily, weekly, monthly, yearly). Deployed on AWS for real-time tracking.

## Approach
- **Backend**: Node.js/Express, MySQL RDS (UserManagementDB). Routes for auth (JWT/Bcrypt), user/job CRUD, check-in/out, reports. CORS for frontend.
- **Frontend**: React (Vite), React Router, Axios, Chart.js for report visuals, react-csv for exports.
- **Deployment**: AWS EC2 (port 3000), RDS for DB. Built with `npm run build`.

## Technologies
Node.js, Express, React, MySQL2, AWS (EC2, RDS), Chart.js, react-csv, JWT, Bcrypt.

## Results
- Scalable system for user management and reporting.
- Demo: [http://ec2-23-20-246-112.compute-1.amazonaws.com:3000](http://ec2-23-20-246-112.compute-1.amazonaws.com:3000) [Verify if active].
- Metrics: [Add if available, e.g., "Handles 100+ logs/day, reports in <2s"].

## Learnings
Mastered secure DB connections and API routing. Potential for ML on time logs.

## Artifacts
- Code: [server.js](../timetrak/server.js), [connection.js](../timetrak/connection.js), [vite.config.js](../timetrak/vite.config.js)
- Screenshots: [<img src="../assets/timetrak/dashboard.png" alt="Dashboard">, <img src="../assets/timetrak/report-chart.png" alt="Report Chart">]

[Back to Home](/)
