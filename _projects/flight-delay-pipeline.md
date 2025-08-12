# Flight Delay Prediction ML Pipeline

## Overview
Built an end-to-end ML pipeline for predicting flight departure delays using BTS On-Time dataset (Jan 2024, ATL flights), with steps for import, cleaning, and polynomial regression.

## Approach
- import_data.py: Loaded CSV, selected columns (e.g., DEP_DELAY, CRS_DEP_TIME), saved as raw_data.pkl.
- clean_data.py: Filtered ATL flights, top 50 destinations, label-encoded DEST_AIRPORT, saved as cleaned_data.pkl.
- poly_regressor.py: Trained polynomial regression (order 2, alpha 0.1), logged to MLflow.
- Orchestrated with MLproject file and MLflow runs.

## Technologies
Python, Pandas, Scikit-learn, MLflow.

## Results
| Metric          | Value          |
|-----------------|----------------|
| Test MSE        | 0.095          |
| Avg Delay       | 10.2 minutes   |

## Learnings
MLflow ensured reproducibility; challenges with large data and env mismatches fixed via explicit experiment setting.

## Artifacts
- Full Repo: [Flight_Delay_Prediction_ML_Pipeline](../Flight_Delay_Prediction_ML_Pipeline)
- Code Files: [main.ipynb](../Flight_Delay_Prediction_ML_Pipeline/poly_regressor_Python_1.0.0.ipynb), [clean_data.py](../Flight_Delay_Prediction_ML_Pipeline/scripts/clean_data.py), [import_data.py](../Flight_Delay_Prediction_ML_Pipeline/scripts/import_data.py)

<img width="585" height="644" alt="image" src="https://github.com/user-attachments/assets/48ab49dc-d8ff-4221-a0b5-249fa4c34aee" />

<img width="585" height="644" alt="image" src="https://github.com/user-attachments/assets/d33c0bcf-9f4c-46df-9d96-9f7f97b426c0" />

<img width="833" height="441" alt="image" src="https://github.com/user-attachments/assets/00cdc854-3f80-4f69-b5c0-3c7305716380" />

<img width="1274" height="584" alt="image" src="https://github.com/user-attachments/assets/f87af539-6c33-496d-93bd-87aedd8e0ecc" />

<img width="1276" height="587" alt="image" src="https://github.com/user-attachments/assets/adc7b8e1-f53a-4c87-b8a4-a4576aabb0bd" />


[Back to Home](/)
