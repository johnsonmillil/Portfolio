#!/usr/bin/env python
# coding: utf-8

# import statements
from fastapi import FastAPI, HTTPException
import json
import numpy as np
import pickle
import datetime

# Initialize FastAPI app
app = FastAPI()

# Import the label conversion file
try:
    with open('label_conversion.json', 'r') as f:
        label_conversion = json.load(f)
except FileNotFoundError:
    raise FileNotFoundError("label_conversion.json not found.")

# Load the model
try:
    with open('finalized_model.pkl', 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    raise FileNotFoundError("finalized_model.pkl not found.")


def create_airport_encoding(airport: str, label_conversion: dict) -> np.array:
    """
    create_airport_encoding is a function that creates an array the length of all arrival airports from the chosen
    departure aiport.  The array consists of all zeros except for the specified arrival airport, which is a 1.

    Parameters
    ----------
    airport : str
        The specified arrival airport code as a string
    label_conversion: dict
        A dictionary containing all of the arrival airport codes served from the chosen departure airport

    Returns
    -------
    np.array
        A NumPy array the length of the number of arrival airports.  All zeros except for a single 1
        denoting the arrival airport.  Returns None if arrival airport is not found in the input list.
        This is a one-hot encoded airport array.
    """
    temp = np.zeros(len(label_conversion))
    if airport in label_conversion:
        temp[label_conversion.get(airport)] = 1
        temp = temp.T
        return temp
    else:
        return None


def predict_delay(arrival_airport: str, departure_time: str, arrival_time: str) -> float:
    """
    Predict the departure delay given the arrival airport, departure time, and arrival time.

    Parameters
    ----------
    arrival_airport : str
        The arrival airport code
    departure_time : str
        Local departure time in format 'YYYY-MM-DD HH:MM:SS'
    arrival_time : str
        Local arrival time in format 'YYYY-MM-DD HH:MM:SS'

    Returns
    -------
    float
        Predicted departure delay in minutes
    """
    # Validate arrival airport
    if not arrival_airport:
        raise HTTPException(status_code=400, detail="Arrival airport cannot be empty")
    if arrival_airport not in label_conversion:
        raise HTTPException(status_code=400,
                            detail=f"Invalid arrival airport. Must be one of {list(label_conversion.keys())}")

    # Get one-hot encoded airport array
    encoded_airport = create_airport_encoding(arrival_airport, label_conversion)
    if encoded_airport is None:
        raise HTTPException(status_code=400, detail="Invalid arrival airport")

    # Parse times and convert to seconds since midnight
    try:
        dep_dt = datetime.datetime.strptime(departure_time, "%Y-%m-%d %H:%M:%S")
        arr_dt = datetime.datetime.strptime(arrival_time, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid time format. Use YYYY-MM-DD HH:MM:SS")

    # Validate time logic
    if arr_dt <= dep_dt:
        raise HTTPException(status_code=400, detail="Arrival time must be after departure time")

    dep_seconds = (dep_dt.hour * 3600) + (dep_dt.minute * 60) + dep_dt.second
    arr_seconds = (arr_dt.hour * 3600) + (arr_dt.minute * 60) + arr_dt.second

    # Prepare input for the model: [poly_order, encoded_airport (many elements), dep_time, arr_time]
    poly_order = 1  # As specified in the comments
    input_array = np.concatenate(([poly_order], encoded_airport, [dep_seconds], [arr_seconds]))

    # Predict
    try:
        prediction = model.predict([input_array])[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
    return float(prediction)


# API Endpoints
@app.get("/")
async def root():
    return {"message": "API is functional"}


@app.get("/predict/delays")
async def predict_delays(arrival_airport: str, departure_time: str, arrival_time: str):
    prediction = predict_delay(arrival_airport, departure_time, arrival_time)
    return {"average_departure_delay_minutes": prediction}
