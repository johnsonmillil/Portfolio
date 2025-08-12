# Patient Readmission Prediction with Random Forest

## Overview
Used Random Forest to predict 30-day readmissions (ReAdmis) for Horizon Health Network using medical_clean.csv, focusing on Initial_days, HighBlood, Complication_risk to reduce CMS penalties.

## Approach
- Preprocessed: Selected features, encoded categoricals, 70/15/15 split.
- Modeled: Random Forest (100 trees, tuned with GridSearchCV).
- Evaluated: Accuracy, precision, recall, F1, AUC-ROC.

## Technologies
Python, Scikit-learn, Pandas.

## Results
<img width="343" height="240" alt="image" src="https://github.com/user-attachments/assets/4ae163e7-d610-4de8-99f3-ffb906024426" /><br>

<img width="346" height="229" alt="image" src="https://github.com/user-attachments/assets/2421aef1-961d-412e-a192-99e4de536b7b" />


## Learnings
High accuracy but potential overfitting; ethical splits mitigated bias.

## Artifacts
- Full Repo: [Patient_Readmission_Prediction_with_Random_Forest](../Patient_Readmission_Prediction_with_Random_Forest)
- Code: [Analysis.py](../Patient_Readmission_Prediction_with_Random_Forest/analysis.py)


[Back to Home](/)
