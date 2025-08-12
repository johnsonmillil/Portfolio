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

  <img width="1701" height="333" alt="image" src="https://github.com/user-attachments/assets/f38d1832-ed45-4d8f-a50e-64b7e84a619f" />


[Back to Home](/)
