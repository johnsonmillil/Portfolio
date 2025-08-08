# House Price Prediction with PCA and Linear Regression (D600)

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
- Repo: [GitLab task3-principal-component-analysis]
- Code: [PCA_LinearRegression.py](../pca-regression/PCA_LinearRegression.py)
- [Add scree_plot.png to assets/pca-regression/, e.g., <img src="../assets/pca-regression/scree_plot.png" alt="Scree Plot">]

[Back to Home](/)
