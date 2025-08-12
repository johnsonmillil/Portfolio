# Hospital Revenue Forecasting with SARIMA

## Overview
Forecasted daily hospital revenue for Horizon Health Network using medical_clean.csv (731 days) to inform resource planning with a SARIMA model.

## Approach
- Prepared data: Daily aggregation, differencing for stationarity (ADF p=0.000).
- Analyzed trends: ACF/PACF showed 7-day seasonality.
- Fitted SARIMA(1,1,1)(1,0,1,7), 80/20 split, forecasted 90 days.

## Technologies
Python, Statsmodels, Pandas, Matplotlib.

## Results
| Metric          | Value          |
|-----------------|----------------|
| Test MSE        | 12.78          |
| AIC             | 710.92         |
| 90-Day Avg Forecast | ~16.28M/day |

Visuals: Forecast plot with 95% CI, decomposition.

## Learnings
Weak seasonality suggests model refinement; stationarity assumptions held.

## Artifacts
- Code: [analysis.py](../Time_Series_Modeling_for_Hospital_Revenue_Forecasting_analysis/analysis.py)
- Full Repo: [Time_Series_Modeling_for_Hospital_Revenue_Forecasting](../Time_Series_Modeling_for_Hospital_Revenue_Forecasting_analysis)

<img width="1200" height="600" alt="forecast_plot" src="https://github.com/user-attachments/assets/f4ad0c7a-4a41-4ef4-87d6-ad7586dc85a4" />


[Back to Home](/)
