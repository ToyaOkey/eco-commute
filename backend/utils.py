import sqlite3
import googlemaps

# Initialize Google Maps client
gmaps = googlemaps.Client(key="AIzaSyBqcd3igBPn9nsFkflOw0ZJP9jQjlyybbI")

# CO2 emissions per km (approx, in kg)
EMISSION_FACTORS = {
    'car': 0.192,
    'bus': 0.105,
    'train': 0.041,
    'bike': 0.0,
    'walk': 0.0
}

# Define car as baseline; anything better than car gets savings
CLEAN_MODES = ['bike', 'walk', 'bus', 'train']

BADGE_THRESHOLDS = [10, 50, 100]  # in kg
BADGE_NAMES = ['🌱 Eco Starter', '🌍 Green Hero', '🦋 Climate Champion']

#def calculate_emissions(mode: str, distance_km: float) -> float:
    #return round(EMISSION_FACTORS.get(mode, 0.0) * distance_km, 3)

def calculate_emissions(distance_km, mode):
    mode = mode.lower()  # Ensures we're comparing lowercase strings
    if mode in ["driving", "car"]:
        return round(distance_km * 0.2, 1)  # ~0.2 kg CO2 per km
    elif mode in ["transit", "bus", "train"]:
        return round(distance_km * 0.1, 1)
    elif mode in ["bicycling", "bike", "walking", "walk"]:
        return 0.0
    else:
        return 0.0

def calculate_savings(mode: str, distance_km: float) -> float:
    mode_map = {
        "driving": "car",
        "transit": "bus",
        "bicycling": "bike",
        "walking": "walk"
    }
    standard_mode = mode_map.get(mode.lower(), "car")

    car_emissions = EMISSION_FACTORS['car'] * distance_km
    actual_emissions = EMISSION_FACTORS.get(standard_mode, 0.0) * distance_km
    savings = max(0, car_emissions - actual_emissions)
    return round(savings, 3)

def check_badges(user_id: int):
    with sqlite3.connect("eco.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT SUM(co2_saved) FROM trips WHERE user_id = ?", (user_id,))
        total_saved = cursor.fetchone()[0] or 0
        cursor.execute("SELECT badge FROM badges WHERE user_id = ?", (user_id,))
        earned = {row[0] for row in cursor.fetchall()}
        for i, threshold in enumerate(BADGE_THRESHOLDS):
            if total_saved >= threshold and BADGE_NAMES[i] not in earned:
                cursor.execute("INSERT INTO badges (user_id, badge) VALUES (?, ?)", (user_id, BADGE_NAMES[i]))
                conn.commit()
                return BADGE_NAMES[i]
    return None

def recommend_mode(distance_km: float) -> str:
    if distance_km < 1:
        return 'walk'
    elif distance_km < 5:
        return 'bike'
    elif distance_km < 30:
        return 'bus'
    else:
        return 'train'

def get_route_with_traffic(origin: str, destination: str, departure_time: str) -> dict:
    directions = gmaps.directions(
        origin,
        destination,
        mode="driving",
        departure_time=departure_time,
        traffic_model="best_guess"
    )
    if directions:
        route = directions[0]['legs'][0]
        return {
            "duration": route['duration']['text'],
            "distance": route['distance']['text'],
            "traffic_duration": route['duration_in_traffic']['text']
        }
    return {"message": "No route found."}