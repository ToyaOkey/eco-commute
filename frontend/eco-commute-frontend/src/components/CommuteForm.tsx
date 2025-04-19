import { useEffect, useState } from "react";

type CommuteFormProps = {
  selectedLocation: [number, number] | null;
};

const CommuteForm = ({ selectedLocation }: CommuteFormProps) => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [recommendedMode, setRecommendedMode] = useState('');
  const [distanceKm, setDistanceKm] = useState(0);
  const [cleanestRoute, setCleanestRoute] = useState<null | {
    mode: string;
    co2_emitted: number;
    duration_min: number;
  }>(null);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    if (hour < 21) return "evening";
    return "night";
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const [startLat, startLng] = start.split(",").map(Number);
      const [destLat, destLng] = destination.split(",").map(Number);
      const distance = calculateDistance(startLat, startLng, destLat, destLng);
      setDistanceKm(distance);

      // 1. Fetch recommended mode
      const rec = await fetch(`http://localhost:8000/recommend_mode/${distance}`);
      const recData = await rec.json();
      setRecommendedMode(recData.recommended_mode);

      // 2. Fetch cleanest historical route
      const cleanest = await fetch(
        `http://localhost:8000/suggest_cleanest_route/1?origin=${start}&destination=${destination}`
      );
      const cleanestData = await cleanest.json();
      if (cleanestData?.mode) {
        setCleanestRoute(cleanestData);
      }

      // 3. Log this trip
      const tripData = {
        user_id: 1,
        origin: start,
        destination: destination,
        mode: recData.recommended_mode,
        distance_km: distance,
        duration_min: 18,
        time_of_day: getTimeOfDay(),
        date: new Date().toISOString().split("T")[0],
      };

      await fetch("http://localhost:8000/log_trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      setStart(`${selectedLocation[0].toFixed(4)}, ${selectedLocation[1].toFixed(4)}`);
    }
  }, [selectedLocation]);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        🚗 Plan Your Commute
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Start Location
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g. 37.7749,-122.4194"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Destination
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g. 34.0522,-118.2437"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
          >
            🚀 Optimize Route
          </button>
        </div>
      </form>

      {/* Display Results */}
      {recommendedMode && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-lg font-semibold text-green-800">
            Recommended Mode: <span className="font-bold">{recommendedMode}</span>
          </p>
          <p>Estimated Distance: {distanceKm.toFixed(2)} km</p>
        </div>
      )}

      {cleanestRoute && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-700 mb-1">🌿 Cleanest Past Route</h3>
          <p>Mode: {cleanestRoute.mode}</p>
          <p>CO₂ Emitted: {cleanestRoute.co2_emitted.toFixed(2)} g</p>
          <p>Duration: {cleanestRoute.duration_min} min</p>
        </div>
      )}
    </div>
  );
};

export default CommuteForm;