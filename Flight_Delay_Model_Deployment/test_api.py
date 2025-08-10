import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API is functional"}

def test_predict_delays_valid_request():
    response = client.get("/predict/delays", params={
        "arrival_airport": "DFW",  # Valid airport from label_conversion.json
        "departure_time": "2024-01-01 08:00:00",
        "arrival_time": "2024-01-01 12:00:00"
    })
    assert response.status_code == 200
    assert "average_departure_delay_minutes" in response.json()
    assert isinstance(response.json()["average_departure_delay_minutes"], float)

def test_predict_delays_invalid_airport():
    response = client.get("/predict/delays", params={
        "arrival_airport": "INVALID",
        "departure_time": "2024-01-01 08:00:00",
        "arrival_time": "2024-01-01 12:00:00"
    })
    assert response.status_code == 400
    assert "detail" in response.json()

def test_predict_delays_invalid_time_format():
    response = client.get("/predict/delays", params={
        "arrival_airport": "DFW",
        "departure_time": "2024-01-01 08:00",  # Missing seconds
        "arrival_time": "2024-01-01 12:00:00"
    })
    assert response.status_code == 400
    assert "detail" in response.json()
    assert "Invalid time format" in response.json()["detail"]

def test_predict_delays_invalid_time_logic():
    response = client.get("/predict/delays", params={
        "arrival_airport": "DFW",
        "departure_time": "2024-01-01 12:00:00",
        "arrival_time": "2024-01-01 08:00:00"  # Arrival before departure
    })
    assert response.status_code == 400
    assert "detail" in response.json()
    assert "Arrival time must be after departure time" in response.json()["detail"]