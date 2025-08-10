import pickle
import os

# Path to the finalized_model.pkl file
model_path = "C:/Users/johns/PycharmProjects/d602-deployment-task-2/finalized_model.pkl"

# Verify the file exists
if not os.path.exists(model_path):
    print(f"Error: {model_path} does not exist.")
else:
    print(f"Found {model_path}")

# Load the model
try:
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    print("Model loaded successfully.")
    print("Model type:", type(model))
    print("Model alpha:", model.alpha)
    print("Model coefficients:", model.coef_)
    print("Model intercept:", model.intercept_)
except Exception as e:
    print(f"Error loading model: {e}")