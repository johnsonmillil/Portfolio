import pandas as pd
import os
import argparse

# Determine the absolute path to the project root and data directory
script_path = os.path.abspath(__file__)
project_root = os.path.dirname(os.path.dirname(script_path))
data_dir = os.path.join(project_root, "data")
input_file = os.path.join(data_dir, "formatted_data.csv")
output_file = os.path.join(data_dir, "cleaned_data.csv")

def clean_data(input_path=input_file, output_path=output_file, airport="ATL"):
    """
    Filter On-Time Performance data for departures from specified airport in Georgia.
    """
    try:
        # Load data
        data = pd.read_csv(input_path)

        # Debug: Print unique ORG_AIRPORT values
        print("Unique ORG_AIRPORT values:", data["ORG_AIRPORT"].unique())

        # Filter for departures from specified airport
        filtered_data = data[data["ORG_AIRPORT"] == airport].copy()

        # Debug: Print number of rows after filtering
        print(f"Rows after filtering for {airport}: {len(filtered_data)}")

        # If no rows for ATL, try SAV (Savannah/Hilton Head International Airport)
        if len(filtered_data) == 0 and airport == "ATL":
            print("No rows found for ORG_AIRPORT = 'ATL'. Trying SAV...")
            filtered_data = data[data["ORG_AIRPORT"] == "SAV"].copy()
            print(f"Rows after filtering for SAV: {len(filtered_data)}")

        # If still no rows, try filtering by ORIGIN_AIRPORT_ID (SAV ID: 14893)
        if len(filtered_data) == 0:
            print("No rows found for ORG_AIRPORT = 'SAV'. Trying ORIGIN_AIRPORT_ID for SAV (14893)...")
            # Load the original dataset to get ORIGIN_AIRPORT_ID
            raw_data = pd.read_csv(os.path.join(data_dir, "T_ONTIME_REPORTING.csv"))
            # Merge ORIGIN_AIRPORT_ID into formatted_data
            data_with_id = data.merge(raw_data[['ORIGIN', 'ORIGIN_AIRPORT_ID']],
                                    left_on="ORG_AIRPORT", right_on="ORIGIN", how="left")
            filtered_data = data_with_id[data_with_id["ORIGIN_AIRPORT_ID"] == 14893].copy()
            print(f"Rows after filtering for ORIGIN_AIRPORT_ID 14893 (SAV): {len(filtered_data)}")

        # Sample 10% of the data to manage memory usage
        if len(filtered_data) > 0:
            filtered_data = filtered_data.sample(frac=0.1, random_state=42)
            print(f"Rows after sampling (10%): {len(filtered_data)}")
        else:
            print("No data available after filtering. Exiting.")
            return None

        # Handle missing values in critical columns
        critical_columns = ["DEPARTURE_DELAY", "SCHEDULED_DEPARTURE", "ARRIVAL_TIME", "ARRIVAL_DELAY"]
        filtered_data = filtered_data.dropna(subset=critical_columns)
        print(f"Rows after dropping missing values in critical columns: {len(filtered_data)}")

        # Ensure data types are correct
        for col in ["YEAR", "MONTH", "DAY", "DAY_OF_WEEK", "SCHEDULED_DEPARTURE", "DEPARTURE_TIME", "DEPARTURE_DELAY", "SCHEDULED_ARRIVAL", "ARRIVAL_TIME", "ARRIVAL_DELAY"]:
            filtered_data[col] = pd.to_numeric(filtered_data[col], errors="coerce")

        # Save cleaned data
        airport_name = "Savannah, GA" if airport == "SAV" or len(filtered_data) > 0 and filtered_data["ORG_AIRPORT"].iloc[0] == "SAV" else "Atlanta, GA"
        filtered_data.to_csv(output_path, index=False)
        print(f"Cleaned data for airport {airport} ({airport_name}) saved to {output_path}")
        return filtered_data
    except Exception as e:
        print(f"Error during cleaning: {e}")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--airport", type=str, default="ATL")
    args = parser.parse_args()
    clean_data(airport=args.airport)