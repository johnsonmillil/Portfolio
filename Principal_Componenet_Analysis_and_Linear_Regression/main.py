# Task 3: Principal Component Analysis and Linear Regression

# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Load the dataset
data = pd.read_csv('D600 Task 3 Dataset 1 Housing Information.csv')

# D1. Identify Continuous Variables (documented here for reference)
# - Dependent Variable: Price
# - Independent Variables (Continuous): SquareFootage, NumBathrooms, NumBedrooms, BackyardSpace,
#   CrimeRate, SchoolRating, AgeOfHome, DistanceToCityCenter, EmploymentRate, PropertyTaxRate,
#   RenovationQuality, LocalAmenities, TransportAccess, Windows, PreviousSalePrice

# D2. Standardize the Continuous Variables
# Select continuous variables
continuous_vars = [
    'Price', 'SquareFootage', 'NumBathrooms', 'NumBedrooms', 'BackyardSpace',
    'CrimeRate', 'SchoolRating', 'AgeOfHome', 'DistanceToCityCenter',
    'EmploymentRate', 'PropertyTaxRate', 'RenovationQuality', 'LocalAmenities',
    'TransportAccess', 'Windows', 'PreviousSalePrice'
]
data_continuous = data[continuous_vars]

# Standardize the continuous variables
scaler = StandardScaler()
data_standardized = scaler.fit_transform(data_continuous)
data_standardized_df = pd.DataFrame(data_standardized, columns=continuous_vars)

# Save the standardized dataset
data_standardized_df.to_csv('standardized_house_data.csv', index=False)

# Display the first few rows
print("D2. Standardized Data (First 5 Rows):")
print(data_standardized_df.head())

# D3. Descriptive Statistics of Continuous Variables
# Compute descriptive statistics for the original (non-standardized) data
desc_stats = data_continuous.describe()

# Add mode and range
modes = data_continuous.mode().iloc[0]
desc_stats.loc['mode'] = modes
desc_stats.loc['range'] = desc_stats.loc['max'] - desc_stats.loc['min']

# Save the descriptive statistics
desc_stats.to_csv('descriptive_stats.csv')

# Display the descriptive statistics
print("\nD3. Descriptive Statistics of Continuous Variables:")
print(desc_stats)

# E. Perform PCA

# E1. Determine the Matrix of All Principal Components
from sklearn.decomposition import PCA

# Separate the independent variables (exclude Price)
X = data_standardized_df.drop(columns=['Price'])

# Apply PCA
pca = PCA()
principal_components = pca.fit_transform(X)

# Create a DataFrame for the principal components
pc_columns = [f'PC{i+1}' for i in range(X.shape[1])]
principal_components_df = pd.DataFrame(principal_components, columns=pc_columns)

# Display the first few rows of the principal components matrix
print("\nE1. Principal Components Matrix (First 5 Rows):")
print(principal_components_df.head())

# E2. Identify the Total Number of Principal Components to Retain
import matplotlib.pyplot as plt

# Get the eigenvalues (explained variance)
eigenvalues = pca.explained_variance_

# Plot the scree plot
plt.figure(figsize=(10, 6))
plt.plot(range(1, len(eigenvalues) + 1), eigenvalues, marker='o')
plt.title('Scree Plot')
plt.xlabel('Principal Component')
plt.ylabel('Eigenvalue')
plt.axhline(y=1, color='r', linestyle='--', label='Eigenvalue = 1 (Kaiser Rule)')
plt.legend()
plt.grid()
plt.savefig('scree_plot.png')
plt.show()

# Determine the number of components to retain (Kaiser rule: eigenvalue > 1)
num_components_kaiser = sum(eigenvalues > 1)
print(f"\nE2. Number of components to retain (Kaiser rule): {num_components_kaiser}")

# E3. Identify the Variance of Each Principal Component
# Variance (eigenvalues) and proportion of variance explained
variance = pca.explained_variance_
variance_ratio = pca.explained_variance_ratio_

# Create a DataFrame to display the results
variance_df = pd.DataFrame({
    'Principal Component': [f'PC{i+1}' for i in range(len(variance))],
    'Variance (Eigenvalue)': variance,
    'Proportion of Variance Explained': variance_ratio,
    'Cumulative Variance Explained': np.cumsum(variance_ratio)
})
print("\nE3. Variance of Principal Components:")
print(variance_df)

# E4. Summarize the Results of PCA

# Number of Components Retained: 6 (based on Kaiser rule: eigenvalues > 1)
# Variance Explained: The first 6 components explain approximately 58.69% of the total variance.
# Implications: PCA reduced the dimensionality from 15 variables to 6 components, capturing over half of the variance in the data while minimizing multicollinearity for regression. This reduction simplifies the model and focuses on the most significant patterns in the data.

# F. Perform Data Analysis and Report Results

# F1. Split the Data into Training and Test Datasets
from sklearn.model_selection import train_test_split

# Select the retained principal components (PC1 to PC6, based on E2 output)
X_reduced = principal_components_df.iloc[:, :6]  # Using 6 components as per E2
y = data_standardized_df['Price']

# Split the data: 80% training, 20% testing
X_train, X_test, y_train, y_test = train_test_split(X_reduced, y, test_size=0.2, random_state=42)

# Save the training and test datasets
train_data = pd.concat([X_train, y_train.rename('Price')], axis=1)
test_data = pd.concat([X_test, y_test.rename('Price')], axis=1)
train_data.to_csv('train_data.csv', index=False)
test_data.to_csv('test_data.csv', index=False)

print(f"\nF1. Training set size: {X_train.shape[0]} samples")
print(f"Test set size: {X_test.shape[0]} samples")

# F2. Create and Optimize a Regression Model
import statsmodels.api as sm
from sklearn.linear_model import LinearRegression

# Initial regression model with all retained components
X_train_sm = sm.add_constant(X_train)
model = sm.OLS(y_train, X_train_sm).fit()


# Forward stepwise selection
def forward_selection(X, y, significance_level=0.05):
    initial_features = []
    remaining_features = list(X.columns)
    best_model = None
    best_adj_r2 = -float('inf')

    while remaining_features:
        best_pvalue = float('inf')
        best_feature = None

        for feature in remaining_features:
            current_features = initial_features + [feature]
            X_current = sm.add_constant(X[current_features])
            model = sm.OLS(y, X_current).fit()

            pvalue = model.pvalues[feature]
            if pvalue < best_pvalue:
                best_pvalue = pvalue
                best_feature = feature
                current_adj_r2 = model.rsquared_adj

        if best_pvalue < significance_level:
            initial_features.append(best_feature)
            remaining_features.remove(best_feature)
            if current_adj_r2 > best_adj_r2:
                best_adj_r2 = current_adj_r2
                best_model = model
        else:
            break

    return best_model, initial_features


# Perform forward selection
best_model, selected_features = forward_selection(X_train, y_train)
print("\nF2. Optimized Model Summary:")
print(best_model.summary())

# Save the model summary
with open('model_summary.txt', 'w') as f:
    f.write(best_model.summary().as_text())

# F3. Mean Squared Error (MSE) on the Training Set
from sklearn.metrics import mean_squared_error

# Predict on the training set using the selected features
X_train_selected = X_train[selected_features]
model_sklearn = LinearRegression().fit(X_train_selected, y_train)
y_train_pred = model_sklearn.predict(X_train_selected)

# Compute MSE
mse_train = mean_squared_error(y_train, y_train_pred)
print(f"\nF3. MSE on training set: {mse_train}")

# F4. Run Prediction on the Test Set and Compute MSE
# Predict on the test set using the selected features
X_test_selected = X_test[selected_features]
y_test_pred = model_sklearn.predict(X_test_selected)

# Compute MSE on the test set
mse_test = mean_squared_error(y_test, y_test_pred)
print(f"F4. MSE on test set: {mse_test}")

