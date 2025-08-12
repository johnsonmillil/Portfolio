# House Price Prediction with PCA and Linear Regression

## Overview
Used PCA to reduce housing features and built a linear regression model to predict prices for a real estate company.

## Approach
- Standardized 15 features (e.g., SquareFootage, CrimeRate).
- PCA: 6 components (58.69% variance). 80/20 split.
- Forward selection: PC1, PC2, PC3, PC6 for regression.

## Technologies
Python, scikit-learn, Statsmodels, Matplotlib.

## Results
| Metric          | Value          |
|-----------------|----------------|
| R² / Adj R²     | 0.639 / 0.638  |
| Test MSE        | 0.360          |

Equation: Price = 0.0048 + 0.4154*PC1 - 0.1602*PC2 + 0.2028*PC3 - 0.0028*PC6.

## Learnings
PCA eliminated multicollinearity; non-normal residuals suggest log-transforms.

## Artifacts
- Full Repo: [Principal Component Analysis_and_Linear_Regression](../Principal_Component_Analysis_and_Linear_Regression)
- Code File: [PCA_LinearRegression.py](../Principal_Component_Analysis_and_Linear_Regression/main.py)


   <img width="1000" height="600" alt="scree_plot" src="https://github.com/user-attachments/assets/35181bed-26d9-483c-9e85-a9405614b2b5" />


[Back to Home](/)
