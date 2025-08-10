import pickle
import json
from sklearn.linear_model import Ridge
import numpy as np

# Create mock airport encodings (simulating arrival airports from ATL)
airport_encodings = {
    "LAX": 0,
    "ORD": 1,
    "JFK": 2,
    "SFO": 3,
    "MIA": 4
}

# Save airport encodings
with open("airport_encodings.json", "w") as f:
    json.dump(airport_encodings, f)

# Create a mock model (simulating the Ridge regression model from Task 2)
# Features: polynomial order, one-hot encoded airport array (5 elements), departure time (seconds), arrival time (seconds)
# Total features: 1 + 5 + 1 + 1 = 8
mock_model = Ridge(alpha=3.8)
# Dummy data: [poly_order, airport_encoding (5 elements), dep_time, arr_time]
X_dummy = np.array([
    [1, 1, 0, 0, 0, 0, 28800, 43200],  # 8:00 AM, 12:00 PM
    [1, 0, 1, 0, 0, 0, 36000, 50400],  # 10:00 AM, 2:00 PM
    [1, 0, 0, 1, 0, 0, 43200, 57600]   # 12:00 PM, 4:00 PM
])
y_dummy = np.array([10, 15, 20])  # Mock delays
mock_model.fit(X_dummy, y_dummy)

# Save the mock model
with open("finalized_model.pkl", "wb") as f:
    pickle.dump(mock_model, f)

print("Mock airport encodings and model created successfully.")