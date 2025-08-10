import sys
print("Python interpreter:", sys.executable)

import pandas as pd
import mlxtend
from mlxtend.frequent_patterns import apriori, association_rules

try:
    print("Pandas version:", pd.__version__)
    print("mlxtend version:", mlxtend.__version__)

    file_path = r"C:\Users\JohnsonMillil\Downloads\Megastore_Dataset_Task_3.csv"
    df = pd.read_csv(file_path)
    print("Number of unique OrderIDs:", df['OrderID'].nunique())
    print("Dataset shape:", df.shape)

    # Encode ordinal variables
    order_priority_map = {'Low': 0, 'Medium': 1, 'High': 2}
    satisfaction_map = {'Prefer not to answer': 0, 'Dissatisfied': 1, 'Very Dissatisfied': 2, 'Satisfied': 3, 'Very Satisfied': 4}
    df['OrderPriority'] = df['OrderPriority'].map(order_priority_map)
    df['CustomerOrderSatisfaction'] = df['CustomerOrderSatisfaction'].map(satisfaction_map)

    # Transactionalize data with OrderID as a column
    # Step 1: Group by OrderID and collect ProductName lists
    grouped = df.groupby('OrderID')['ProductName'].apply(list)
    # Step 2: Explode the lists into individual rows
    exploded = grouped.explode()
    # Step 3: Reset index to make OrderID a column
    exploded_df = exploded.reset_index(name='ProductName')
    # Step 4: Create a pivot table to get binary matrix
    basket = pd.pivot_table(exploded_df, index='OrderID', columns='ProductName', aggfunc='size', fill_value=0).astype(bool)
    # Step 5: Ensure OrderID is a column, not an index
    basket = basket.reset_index()
    print("Cleaned dataset shape:", basket.shape)

    # Apriori analysis
    frequent_itemsets = apriori(basket.drop(columns='OrderID'), min_support=0.01, use_colnames=True)
    rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.0)
    rules = rules.sort_values('lift', ascending=False)
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', None)
    print("Top 3 Rules:\n", rules[['antecedents', 'consequents', 'support', 'confidence', 'lift']].head(3))

    # Save cleaned dataset with overwrite capability
    output_path = r'C:\Users\JohnsonMillil\Downloads\cleaned_dataset.csv'
    basket.to_csv(output_path)
    print(f"Cleaned dataset saved as '{output_path}'")

except ModuleNotFoundError as e:
    print(f"Error: {e}. Please ensure the required module is installed.")
except FileNotFoundError:
    print(f"Error: '{file_path}' not found. Check the file path and name.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
