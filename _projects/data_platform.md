# Data Platform: Organization Management System

## Overview
Developed a full-stack web application for managing organizational data, enabling user authentication, role-based access (viewer/editor), and data operations. Built collaboratively by students in CIS 4339, with contributions in Spring 2023 (Jeremy Griffith, Edwin Charly) and Fall 2022 (Elliot Farmer Garcia, Agatha Molski, Chris Blanco). Deployable locally or in the cloud for secure and scalable organization management.

## Approach
**Backend**: Built with Node.js and Express, integrated with MongoDB using Mongoose as the ODM. Implemented JWT-based authentication with bcrypt for secure password hashing. Configured API endpoints for user management, role assignment, and organization data operations, with environment variables for MongoDB connection, port, organization ID, and JWT secret.

**Frontend**: Developed using Vue.js 3 with Vite for fast builds and TailwindCSS for responsive styling. Utilized Pinia for state management and Vuelidate for form validation. Connected to the backend via API calls configured through a `.env` file (`VITE_ROOT_API`).

**Database**: MongoDB with collections for organizations (`org`) and users (`users`). Each user document includes username, hashed password, role (viewer/editor), and organization reference. Sample scripts provided for password hashing and database setup.

**Deployment**: Designed for local development with options for cloud deployment. Backend runs on a configurable port (e.g., 3000), and frontend supports hot-reloading with Vite. Postman documentation provided for API testing.

## Technologies
- Node.js
- Express
- MongoDB
- Mongoose
- Vue.js 3
- Vite
- TailwindCSS
- Pinia
- Vuelidate
- JWT
- Bcrypt

## Results
Delivered a secure, role-based platform for managing organizational data, with scalable backend APIs and a responsive frontend. Enabled efficient user and organization management with clear documentation for setup and testing. API endpoints documented via Postman for developer accessibility.

**Demo**: Configured for local deployment; contact me for setup instructions or screenshots.  
**Metrics**: Supports multiple users with distinct roles, with API responses optimized for low latency (based on local testing).

## Learnings
Gained expertise in MongoDB schema design, JWT authentication, and Vue.js state management with Pinia. Learned to integrate TailwindCSS for rapid UI development and configure environment variables for flexible deployment. Future enhancements could include advanced role permissions or real-time data updates via WebSockets.
