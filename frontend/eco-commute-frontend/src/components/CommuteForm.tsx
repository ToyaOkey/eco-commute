import { useEffect, useState } from "react";

type CommuteFormProps = {
  selectedLocation: [number, number] | null;
};

const CommuteForm = ({ selectedLocation }: CommuteFormProps) => {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [recommendedMode, setRecommendedMode] = useState("");
  const [trafficInfo, setTrafficInfo] = useState<any>(null);
  const [co2Info, setCo2Info] = useState<any>(null);
  const [cleanestRoute, setCleanestRoute] = useState<any>(null);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    if (hour < 21) return "evening";
    return "night";
  };

  const timeOfDay = getTimeOfDay();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchRecommendedMode = async (distanceKm: number) => {
    const res = await fetch(`http://localhost:8000/recommend_mode/${distanceKm}`);
    const data = await res.json();
    return data.recommended_mode;
  };

  const getTrafficLevel = (normal: number, traffic: number) => {
    const delay = traffic - normal;
    if (isNaN(delay)) return "Unknown";
    if (delay <= 1) return "🟢 Low";
    if (delay <= 5) return "🟡 Moderate";
    return "🔴 High";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!start || !destination || !start.includes(",") || !destination.includes(",")) {
        alert("Please enter valid coordinates.");
        return;
      }

      const [startLat, startLng] = start.split(",").map(Number);
      const [destLat, destLng] = destination.split(",").map(Number);
      if ([startLat, startLng, destLat, destLng].some(isNaN)) {
        alert("Invalid lat/lng values.");
        return;
      }

      const distanceKm = calculateDistance(startLat, startLng, destLat, destLng);
      const recommended = await fetchRecommendedMode(distanceKm);
      setRecommendedMode(recommended);

      const origin = start.replace(/\s/g, "");
      const dest = destination.replace(/\s/g, "");

      const trafficRes = await fetch(
        `http://localhost:8000/route_with_traffic?origin=${origin}&destination=${dest}`
      );

      const trafficData = await trafficRes.json();
      setTrafficInfo(trafficData);

      const tripData = {
        user_id: 1,
        origin: start,
        destination: destination,
        mode: recommended,
        distance_km: distanceKm,
        duration_min: trafficData?.duration?.split(" ")[0] || 0,
        time_of_day: timeOfDay,
        date: new Date().toISOString().split("T")[0],
      };

      const tripRes = await fetch("http://localhost:8000/log_trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });
      const tripResult = await tripRes.json();
      setCo2Info(tripResult);

      const cleanestRes = await fetch(
        `http://localhost:8000/suggest_cleanest_route/1?origin=${origin}&destination=${dest}`
      );
      const cleanestData = await cleanestRes.json();
      setCleanestRoute(cleanestData);

    } catch (err) {
      console.error("Error submitting trip:", err);
      setTrafficInfo(null);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      setStart(`${selectedLocation[0].toFixed(4)},${selectedLocation[1].toFixed(4)}`);
    }
  }, [selectedLocation]);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">🚦 Commute Optimizer</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Start Location</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="lat,lng"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Destination</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="lat,lng"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition"
          >
            🚀 Get Optimized Route
          </button>
        </div>
      </form>

      {recommendedMode && (
        <div className="mt-6 text-center text-lg">
          ✅ <strong>Recommended Mode:</strong> {recommendedMode.toUpperCase()}
        </div>
      )}

      {trafficInfo ? (
        trafficInfo.duration ? (
          <div className="mt-4 p-4 border border-green-300 rounded-lg bg-green-50">
            <h4 className="font-semibold text-green-700 mb-2">🛣️ Route With Traffic:</h4>
            <p><strong>Duration:</strong> {trafficInfo.duration}</p>
            <p><strong>Distance:</strong> {trafficInfo.distance}</p>
            <p>
              <strong>Traffic Level:</strong>{" "}
              {getTrafficLevel(
                parseInt(trafficInfo.traffic_duration),
                parseInt(trafficInfo.duration)
              )}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-center text-red-600 font-medium">⚠️ No route found.</p>
        )
      ) : null}

      {co2Info && (
        <div className="mt-4 p-4 border border-yellow-300 rounded-lg bg-yellow-50">
          <h4 className="font-semibold text-yellow-700 mb-2">🌍 Emissions:</h4>
          <p><strong>CO₂ Emitted:</strong> {co2Info.co2_emitted?.toFixed(2)} g</p>
          <p><strong>CO₂ Saved:</strong> {co2Info.co2_saved?.toFixed(2)} g</p>
          {co2Info.badge_earned && (
            <p className="text-green-700 mt-1">🏅 Badge Earned: {co2Info.badge_earned}</p>
          )}
        </div>
      )}

      {cleanestRoute && cleanestRoute.mode && (
        <div className="mt-4 p-4 border border-blue-300 rounded-lg bg-blue-50">
          <h4 className="font-semibold text-blue-700 mb-2">♻️ Cleanest Past Route:</h4>
          <p><strong>Mode:</strong> {cleanestRoute.mode}</p>
          <p><strong>CO₂ Emitted:</strong> {cleanestRoute.co2_emitted?.toFixed(2)} g</p>
          <p><strong>Duration:</strong> {cleanestRoute.duration_min} mins</p>
        </div>
      )}
    </div>
  );
};

export default CommuteForm;