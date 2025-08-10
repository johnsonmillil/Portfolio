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
| Metric          | Value          |
|-----------------|----------------|
| Test Accuracy   | 96.8%          |
| F1 Score        | 95.3%          |
| AUC-ROC         | 96.6%          |

## Learnings
High accuracy but potential overfitting; ethical splits mitigated bias.

## Artifacts
- Code: [Analysis.py](../Patient_Readmission_Prediction_with_Random_Forest/analysis.py)
- [<img src="/assets/patient-readmission-rf/confusion_matrix.png" alt="Confusion Matrix">]

[Back to Home](/)
