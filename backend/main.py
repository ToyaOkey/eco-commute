from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sqlite3
import datetime
from utils import calculate_emissions, calculate_savings, check_badges, recommend_mode, get_route_with_traffic
import requests
import config
# from google import genai
import google.generativeai as genai
 


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class ExplainRequest(BaseModel):
    mode: str
    distance_km: float
    duration_min: float
    time_of_day: str
    co2_saved: float

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



@app.get("/latest_trip/{user_id}")
def latest_trip(user_id: int):
    with sqlite3.connect("eco.db") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT mode, distance_km, duration_min, time_of_day, co2_emitted, co2_saved
            FROM trips
            WHERE user_id = ?
            ORDER BY id DESC LIMIT 1
        """, (user_id,))
        row = cursor.fetchone()

    if not row:
        return JSONResponse(content={"error": "No trips found"}, status_code=404)

    keys = ["mode", "distance_km", "duration_min", "time_of_day", "co2_emitted", "co2_saved"]
    return dict(zip(keys, row))
    


@app.post("/explain_route")
async def explain_route(data: ExplainRequest):
    try:
        genai.configure(api_key=config.GEMINI_API)
        model = genai.GenerativeModel("gemini-2.0-flash")

        prompt = f"""
        Explain why this transportation in detail with the following details: 
        - Mode: {data.mode}
        - Distance: {data.distance_km} km
        - Duration: {data.duration_min} min
        - Time of Day: {data.time_of_day}
        - CO₂ Saved: {data.co2_saved}g

        Make this a detailed explanation, including the environmental impact, health benefits, and any other relevant information.
        Provide a summary of the benefits of this mode of transportation.
        Also, include a comparison with other modes of transportation.
        Use a friendly and informative tone.
        Do not inclide any code or technical jargon simply provide a detailed explanation.

        also include a short summary at the end.
        """

        print("Sending prompt to Gemini:", prompt)
        response = model.generate_content(prompt)

        print("🔁 Gemini raw response:", response)

        if hasattr(response, "text"):
            return {"explanation": response.text}
        else:
            return {
                "explanation": "Gemini did not return text.",
                "debug": str(response)
            }

    except Exception as e:
        print("❌ Gemini error:", str(e))
        return {"explanation": "Gemini failed to generate a response.", "error": str(e)}