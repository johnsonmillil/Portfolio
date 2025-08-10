import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

# Step 1: Load data
df = pd.read_csv('medical_clean.csv')
print(df.head())

# Step 2: Preprocess data
df['ReAdmis'] = df['ReAdmis'].map({'Yes': 1, 'No': 0})
df['HighBlood'] = df['HighBlood'].map({'Yes': 1, 'No': 0})
print("Complication_risk values:", df['Complication_risk'].unique())
df = pd.get_dummies(df, columns=['Complication_risk'], drop_first=True)
for col in ['Complication_risk_Medium', 'Complication_risk_High']:
    if col not in df.columns:
        df[col] = 0
# Select only relevant variables
relevant_cols = ['ReAdmis', 'Initial_days', 'HighBlood', 'Complication_risk_Medium', 'Complication_risk_High']
df_cleaned = df[relevant_cols]
df_cleaned.to_csv('medical_cleaned.csv', index=False)
print("Cleaned data saved as medical_cleaned.csv")

# Step 3: Split data
X = df_cleaned[['Initial_days', 'HighBlood', 'Complication_risk_Medium', 'Complication_risk_High']]
y = df_cleaned['ReAdmis']
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
print(f"Train size: {len(X_train)}, Val size: {len(X_val)}, Test size: {len(X_test)}")
# Save split datasets
train_df = pd.concat([X_train, y_train], axis=1)
val_df = pd.concat([X_val, y_val], axis=1)
test_df = pd.concat([X_test, y_test], axis=1)
train_df.to_csv('train.csv', index=False)
val_df.to_csv('val.csv', index=False)
test_df.to_csv('test.csv', index=False)
print("Split datasets saved as train.csv, val.csv, test.csv")

# Step 4: Initial model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_val)
initial_metrics = {
    'Accuracy': accuracy_score(y_val, y_pred),
    'Precision': precision_score(y_val, y_pred),
    'Recall': recall_score(y_val, y_pred),
    'F1': f1_score(y_val, y_pred),
    'AUC-ROC': roc_auc_score(y_val, y_pred)
}
print("Initial Model Metrics:")
for metric, value in initial_metrics.items():
    print(f"{metric}: {value:.3f}")

# Step 5: Hyperparameter tuning
param_grid = {'n_estimators': [50, 100, 200], 'max_depth': [10, 20, None]}
grid = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5)
grid.fit(X_train, y_train)
best_model = grid.best_estimator_
print(f"Best parameters: {grid.best_params_}")

# Step 6: Optimized model
y_pred_opt = best_model.predict(X_test)
optimized_metrics = {
    'Accuracy': accuracy_score(y_test, y_pred_opt),
    'Precision': precision_score(y_test, y_pred_opt),
    'Recall': recall_score(y_test, y_pred_opt),
    'F1': f1_score(y_test, y_pred_opt),
    'AUC-ROC': roc_auc_score(y_test, y_pred_opt)
}
print("Optimized Model Metrics:")
for metric, value in optimized_metrics.items():
    print(f"{metric}: {value:.3f}")