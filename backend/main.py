from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
import datetime
from utils import calculate_emissions, calculate_savings, check_badges, recommend_mode, get_route_with_traffic

app = FastAPI()

# Trip model for request body
class Trip(BaseModel):
    user_id: int
    origin: str
    destination: str
    mode: str  # 'car', 'bike', 'bus', 'train', 'walk'
    distance_km: float
    duration_min: float
    time_of_day: str  # 'morning', 'afternoon', 'evening', 'night'
    date: str  # 'YYYY-MM-DD'

@app.on_event("startup")
def startup():
    with sqlite3.connect("eco.db") as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                origin TEXT,
                destination TEXT,
                mode TEXT,
                distance_km REAL,
                duration_min REAL,
                time_of_day TEXT,
                co2_emitted REAL,
                co2_saved REAL,
                date TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS badges (
                user_id INTEGER,
                badge TEXT
            )
        ''')
        conn.commit()

@app.post("/log_trip")
def log_trip(trip: Trip):
    co2_emitted = calculate_emissions(trip.distance_km, trip.mode)
    co2_saved = calculate_savings(trip.mode, trip.distance_km)
    with sqlite3.connect("eco.db") as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO trips (user_id, origin, destination, mode, distance_km, duration_min, time_of_day, co2_emitted, co2_saved, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (trip.user_id, trip.origin, trip.destination, trip.mode, trip.distance_km, trip.duration_min, trip.time_of_day, co2_emitted, co2_saved, trip.date))
        conn.commit()
    badge = check_badges(trip.user_id)
    return {"co2_emitted": co2_emitted, "co2_saved": co2_saved, "badge_earned": badge}

@app.get("/recommend_mode/{distance_km}")
def recommend_mode_route(distance_km: float):
    mode = recommend_mode(distance_km)
    return {"recommended_mode": mode}

@app.get("/suggest_cleanest_route/{user_id}")
def suggest_cleanest_route(user_id: int, origin: str, destination: str):
    with sqlite3.connect("eco.db") as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT * FROM trips
            WHERE user_id = ? AND origin = ? AND destination = ?
            ORDER BY co2_emitted ASC
            LIMIT 1
        ''', (user_id, origin, destination))
        cleanest_trip = cursor.fetchone()
    if cleanest_trip:
        return {
            "origin": cleanest_trip[2],
            "destination": cleanest_trip[3],
            "mode": cleanest_trip[4],
            "co2_emitted": cleanest_trip[8],
            "duration_min": cleanest_trip[7]
        }
    return {"message": "No trips found for this route."}

@app.get("/route_with_traffic")
def route_with_traffic(origin: str, destination: str, departure_time: str = "now"):
    traffic_info = get_route_with_traffic(origin, destination, departure_time)
    return traffic_info 