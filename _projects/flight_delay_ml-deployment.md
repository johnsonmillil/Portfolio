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
- Full Repo: [Flight_Delay_Model_Deployment](../Flight_Delay_Model_Deployment)
- Code Files: [main.ipynb](../Flight_Delay_Model_Deployment/ml_deployment_app.py), [Dockerfile](../Flight_Delay_Model_Deployment/ml_deployment_dockerfile)

  <img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/63572d18-4cb5-4448-98fa-13514a01d6cd" />

[Back to Home](/)
