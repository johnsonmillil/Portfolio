# Flight Delay Model Deployment with FastAPI

## Overview
Deployed a machine learning model for flight delay prediction via FastAPI, Docker, and GitLab CI/CD.

## Approach
- Built FastAPI app (app.py) with /predict/delays endpoint.
- Dockerfile: python:3.12-slim, scipy==1.15.2, health checks.
- CI/CD: GitLab pipeline for testing (pytest) and building.

## Technologies
FastAPI, Uvicorn, Docker, GitLab CI/CD, Pytest.

## Results
| Metric          | Value          |
|-----------------|----------------|
| Tests Passed    | 5/5 (1 warning)|
| Container Health| Passed         |

## Learnings
Resolved scipy compatibility; emphasized CI/CD for production.

## Artifacts
- Repo: [GitLab](https://gitlab.com/wgu-gitlab-environment/student-repos/jmillil/d602-deployment-task-3)
- Code: [main.ipynb](../Flight_Delay_Prediction_ML_Pipeline/poly_regressor_Python_1.0.0.ipynb), [Dockerfile](../ml_deployment_dockerfile)

  <img width="376" height="380" alt="image" src="https://github.com/user-attachments/assets/63572d18-4cb5-4448-98fa-13514a01d6cd" />


[Back to Home](/)
