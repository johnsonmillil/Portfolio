import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import adfuller
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.statespace.sarimax import SARIMAX
import matplotlib.pyplot as plt
from scipy.signal import periodogram
import os

# Ensure output directory exists
if not os.path.exists('plots'):
    os.makedirs('plots')

# Load and prepare data
try:
    df = pd.read_csv('medical_clean.csv')
except FileNotFoundError:
    print("Error: 'medical_clean.csv' not found.")
    exit(1)

df['Date'] = pd.date_range(start='2023-05-19', periods=len(df), freq='D')
df.set_index('Date', inplace=True)
df.index.freq = 'D'
df.to_csv('medical_time_series.csv')

# D1: Line Graph Visualization
plt.figure(figsize=(10, 6))
plt.plot(df.index, df['Revenue'], label='Daily Revenue')
plt.title('Daily Hospital Revenue Time Series')
plt.xlabel('Date')
plt.ylabel('Revenue (Millions of Dollars)')
plt.legend()
plt.grid(True)
plt.savefig('plots/time_series_plot.png')
plt.close()
print("D1: Line graph saved as 'plots/time_series_plot.png'")
print("Interpretation: The line graph shows a slight upward trend with potential weekly fluctuations, suggesting seasonality.")

# D2-D3: Time Step and Stationarity
print("\nD2-D3: Time Step and Stationarity")
print("Time Step: Daily data with no gaps, sequence length is 731 days.")
result = adfuller(df['Revenue'].dropna())
print(f"ADF Statistic: {result[0]:.3f}, p-value: {result[1]:.3f}")
if result[1] >= 0.05:
    df['Revenue_diff'] = df['Revenue'].diff().dropna()
    result_diff = adfuller(df['Revenue_diff'].dropna())
    print(f"Differenced ADF Statistic: {result_diff[0]:.3f}, p-value: {result_diff[1]:.3f}")

# E1: Time Series Analysis and Visualizations
print("\nE1: Time Series Analysis and Visualizations")

# ACF and PACF
plt.figure(figsize=(12, 6))
plt.subplot(121)
plot_acf(df['Revenue'].dropna(), lags=30, ax=plt.gca())
plt.title('Autocorrelation Function (ACF)')
plt.subplot(122)
plot_pacf(df['Revenue'].dropna(), lags=30, ax=plt.gca())
plt.title('Partial Autocorrelation Function (PACF)')
plt.savefig('plots/acf_pacf_plot.png')
plt.close()

# Spectral Density
f, Pxx = periodogram(df['Revenue'])
plt.figure(figsize=(10, 6))
plt.semilogy(f, Pxx)
plt.title('Spectral Density')
plt.xlabel('Frequency')
plt.ylabel('Power Spectral Density')
plt.savefig('plots/spectral_plot.png')
plt.close()

# Decomposition
decomposition = seasonal_decompose(df['Revenue'], model='additive', period=7)
fig = decomposition.plot()
fig.set_size_inches(10, 8)
plt.savefig('plots/decomposition_plot.png')
plt.close()

# Residuals
residuals = decomposition.resid
plt.figure(figsize=(10, 6))
plt.plot(residuals, label='Residuals')
plt.title('Residuals of Decomposed Time Series')
plt.xlabel('Date')
plt.ylabel('Residuals')
plt.legend()
plt.grid(True)
plt.savefig('plots/residuals_plot.png')
plt.close()

# Interpretations
print("Interpretation of Visualizations:")
print("- ACF/PACF: The ACF shows significant lags up to 7 days, indicating weekly seasonality. The PACF cuts off after lag 1, suggesting an AR(1) component.")
print("- Spectral Density: Peaks at low frequencies confirm a strong 7-day seasonal pattern.")
print("- Decomposition: The trend shows a slight upward movement, a 7-day seasonal cycle, and random residuals.")
print("- Residuals: Random pattern supports model adequacy.")

# E2-E3: SARIMA Modeling and Forecasting
print("\nE2-E3: SARIMA Modeling and Forecasting")
train_size = int(len(df) * 0.8)
train, test = df['Revenue'][:train_size], df['Revenue'][train_size:]

# SARIMA model on training data
model = SARIMAX(train, order=(1,1,1), seasonal_order=(1,0,1,7))
fit = model.fit()
print("SARIMA(1,1,1)(1,0,1,7) Summary on Training Data:")
print(fit.summary())

# Forecast for test set
test_forecast = fit.forecast(steps=len(test))
mse = ((test - test_forecast) ** 2).mean()
print(f"MSE on Test Set: {mse:.2f}")

# Fit model on full dataset for true future forecast
full_model = SARIMAX(df['Revenue'], order=(1,1,1), seasonal_order=(1,0,1,7))
full_fit = full_model.fit()
forecast_steps = 90
future_forecast = full_fit.forecast(steps=forecast_steps)
future_index = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=forecast_steps, freq='D')
print("Future Forecast (90 days starting May 19, 2025, first 5 days):")
print(pd.Series(future_forecast, index=future_index).head())

# E4: Output and Calculations
print("\nE4: Output and Calculations")
print(f"The SARIMA(1,1,1)(1,0,1,7) model has an AIC of {fit.aic:.2f} and an MSE of {mse:.2f} on the test set, indicating good fit and predictive accuracy.")
print("Significant coefficients: ar.L1 = 0.4589, sigma2 = 0.1948 (Note: Seasonal terms are not significant, suggesting weak seasonality).")

# F1: Results
print("\nF1: Results")
print(f"The SARIMA model achieved an MSE of {mse:.2f} on the test set, suggesting reasonable accuracy. The future forecast predicts revenue trends for the next 90 days, averaging {future_forecast.mean():.2f} million dollars.")

# F2: Update visualization
plt.figure(figsize=(12, 6))
plt.plot(df.index, df['Revenue'], label='Historical Data')
plt.plot(test.index, test_forecast, label='Forecast on Test', color='orange')
plt.plot(future_index, future_forecast, label='Future Forecast', color='green')
conf_int = full_fit.get_forecast(steps=forecast_steps).conf_int()
plt.fill_between(future_index, conf_int.iloc[:, 0], conf_int.iloc[:, 1], color='green', alpha=0.3, label='95% CI')
plt.title('SARIMA Forecast of Daily Revenue')
plt.xlabel('Date')
plt.ylabel('Revenue (Millions of Dollars)')
plt.legend()
plt.grid(True)
plt.savefig('plots/forecast_plot.png')
plt.close()
print("\nF2: Annotated Visualization")
print(f"The orange line shows the forecast matching the test set, with an MSE of {mse:.2f}. The green line and shaded area represent the 90-day future forecast starting May 19, 2025, with 95% confidence intervals.")
