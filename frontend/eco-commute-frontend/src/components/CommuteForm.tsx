import { useEffect, useState } from "react";

type CommuteFormProps = {
  selectedLocation: [number, number] | null;
};

const CommuteForm = ({ selectedLocation }: CommuteFormProps) => {
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
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const estimateTravelTime = (mode: string, distanceKm: number): number => {
    const speeds: { [key: string]: number } = {
      car: 50,
      bus: 40,
      bike: 15,
      walk: 5,
    };
    const speed = speeds[mode] || 30;
    return Math.round((distanceKm / speed) * 60);
  };

  const timeOfDay = getTimeOfDay();
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("car");
  const [distanceKm, setDistanceKm] = useState(0);

  useEffect(() => {
    if (selectedLocation) {
      setStart(`${selectedLocation[0].toFixed(4)}, ${selectedLocation[1].toFixed(4)}`);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (start && destination) {
      const [startLat, startLng] = start.split(",").map(Number);
      const [destLat, destLng] = destination.split(",").map(Number);

      if (
        !isNaN(startLat) &&
        !isNaN(startLng) &&
        !isNaN(destLat) &&
        !isNaN(destLng)
      ) {
        const distance = calculateDistance(startLat, startLng, destLat, destLng);
        setDistanceKm(distance);
      }
    }
  }, [start, destination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const recommended = await fetch(
        `http://localhost:8000/recommend_mode/${distanceKm}`
      );
      const recommendRes = await recommended.json();
      setMode(recommendRes.recommended_mode);

      const duration = estimateTravelTime(recommendRes.recommended_mode, distanceKm);

      const tripData = {
        user_id: 1,
        origin: start,
        destination,
        mode: recommendRes.recommended_mode,
        distance_km: distanceKm,
        duration_min: duration,
        time_of_day: timeOfDay,
        date: new Date().toISOString().split("T")[0],
      };

      const res = await fetch("http://localhost:8000/log_trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      const result = await res.json();
      console.log("Trip submitted:", result);
    } catch (err) {
      console.error("Error submitting trip:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        🚗 Plan Your Commute
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Start Location
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter or select on map"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Destination
          </label>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Recommended Mode
          </label>
          <select
            className="w-full px-4 py-2 border rounded-lg"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="bus">Bus</option>
            <option value="walk">Walk</option>
          </select>
        </div>
        <div className="md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
          >
            🚀 Optimize Route
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommuteForm;