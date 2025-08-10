import pandas as pd

# Load the cleaned data
df = pd.read_csv("data/cleaned_data.csv")

# Print information about the data
print("Columns:", df.columns.tolist())
print("Number of rows:", len(df))
print("First few rows:\n", df.head())
print("Data types:\n", df.dtypes)
print("Missing values:\n", df.isnull().sum())