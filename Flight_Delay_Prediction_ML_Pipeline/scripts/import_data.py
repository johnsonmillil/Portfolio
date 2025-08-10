# scripts/import_data.py
import pandas as pd
import os

# Determine the absolute path to the project root and data directory
script_path = os.path.abspath(__file__)
project_root = os.path.dirname(os.path.dirname(script_path))
data_dir = os.path.join(project_root, "data")
input_file = os.path.join(data_dir, "T_ONTIME_REPORTING.csv")
output_file = os.path.join(data_dir, "formatted_data.csv")

# Debug: Print the paths to verify
print(f"Script path: {script_path}")
print(f"Project root: {project_root}")
print(f"Data directory: {data_dir}")
print(f"Input file: {input_file}")

def import_and_format_data(input_path=input_file, output_path=output_file):
    """
    Import BTS On-Time Performance data and format for further processing.
    """
    try:
        # Load raw data
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"Input file {input_path} not found. Please download from BTS website.")
        raw_data = pd.read_csv(input_path)

        # Debug: Print available columns
        print("Available columns:", raw_data.columns.tolist())

        # Select and rename columns to match poly_regressor expectations
        columns_to_select = {
            "YEAR": "YEAR",
            "MONTH": "MONTH",
            "DAY_OF_MONTH": "DAY",
            "DAY_OF_WEEK": "DAY_OF_WEEK",
            "ORIGIN": "ORG_AIRPORT",
            "DEST": "DEST_AIRPORT",
            "CRS_DEP_TIME": "SCHEDULED_DEPARTURE",
            "DEP_TIME": "DEPARTURE_TIME",
            "DEP_DELAY": "DEPARTURE_DELAY",
            "CRS_ARR_TIME": "SCHEDULED_ARRIVAL",
            "ARR_TIME": "ARRIVAL_TIME",
            "ARR_DELAY": "ARRIVAL_DELAY"
        }
        formatted_data = raw_data[list(columns_to_select.keys())].copy()
        formatted_data.rename(columns=columns_to_select, inplace=True)

        # Check for missing values in critical columns
        critical_columns = ["DEPARTURE_DELAY", "SCHEDULED_DEPARTURE"]
        if formatted_data[critical_columns].isnull().any().any():
            print("Warning: Missing values detected in critical columns")

        # Save formatted data
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        formatted_data.to_csv(output_path, index=False)
        print(f"Formatted data saved to {output_path}")
        return formatted_data
    except Exception as e:
        print(f"Error during import: {e}")
        return None

if __name__ == "__main__":
    import_and_format_data()