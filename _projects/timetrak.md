# Timetrak: Time-Tracking App for Construction Workers

## Overview
Built a full-stack web application for construction workers to clock in/out, manage jobs/users, and generate time reports (daily, weekly, monthly, yearly). Deployed on AWS for real-time tracking, streamlining payroll and productivity analysis.

## Approach
- **Backend**: Node.js/Express with MySQL RDS (UserManagementDB). Routes for authentication (JWT/Bcrypt), user/job CRUD, check-in/out, and report generation. CORS configured for frontend.
- **Frontend**: React with Vite, React Router for navigation, Axios for API calls, Chart.js for report visualizations, react-csv for data exports.
- **Database**: MySQL schema for users, jobs, time logs; optimized queries for reports.
- **Deployment**: Hosted on AWS EC2 (port 3000), RDS for database. Frontend built with `npm run build` and served via Express.

## Technologies
Node.js, Express, React, MySQL2, AWS (EC2, RDS), Chart.js, react-csv, JWT, Bcrypt, Axios, Vite.

## Results
- Delivered a scalable system for user management and time reporting, reducing manual payroll errors.
- Visualized time data with Chart.js charts and enabled CSV exports for further analysis.
- Demo: Previously hosted on AWS EC2; contact me for a redeployment or see screenshots.
- Metrics: Designed to handle 100+ concurrent users, generate reports in <2 seconds (based on local testing).

## Learnings
Mastered secure database connections (RDS), modular API routing, and integrating frontend builds with backend. Future extensions could include ML for anomaly detection in time logs.

## Artifacts
- Code: [server.js](/timetrak/server.js), [connection.js](/timetrak/connection.js), [vite.config.js](/timetrak/vite.config.js)
- Screenshots: [<img src="/assets/timetrak/dashboard.png" alt="Dashboard">, <img src="/assets/timetrak/report-chart.png" alt="Report Chart">]
- Video: [Demo video, upload to assets/timetrak/demo.mp4 if available]
- Backend/Frontend Files: [timetrak folder](/timetrak/)

[Back to Home](/)
