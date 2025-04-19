import { useEffect, useState } from "react";

type CommuteFormProps = {
  selectedLocation: [number, number] | null;
};

const CommuteForm = ({ selectedLocation }: CommuteFormProps) => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState('car');
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationMin, setDurationMin] = useState(0);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const timeOfDay = getTimeOfDay();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const [startLat, startLng] = start.split(',').map(Number);
      const [destLat, destLng] = destination.split(',').map(Number);

      const distance = calculateDistance(startLat, startLng, destLat, destLng);
      setDistanceKm(distance);

      const recommended = await fetch(`http://localhost:8000/recommend_mode/${distance}`);
      const recommendRes = await recommended.json();
      setMode(recommendRes.recommended_mode);

      const tripData = {
        user_id: 1,
        origin: start,
        destination: destination,
        mode: recommendRes.recommended_mode,
        distance_km: distance,
        duration_min: 18, // can be calculated later
        time_of_day: timeOfDay,
        date: new Date().toISOString().split('T')[0],
      };

      const res = await fetch('http://localhost:8000/log_trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });

      const result = await res.json();
      console.log('Trip logged:', result);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
    }
  };

  const fetchCleanestRoute = async () => {
    try {
      const res = await fetch(`http://localhost:8000/suggest_cleanest_route/1?origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(destination)}`);
      if (!res.ok) throw new Error("Failed to fetch cleanest route");
      const data = await res.json();
      console.log("Cleanest route data:", data);
      if (data.mode) {
        setMode(data.mode);
        setDurationMin(data.duration_min);
      }
    } catch (err) {
      console.error("Error fetching cleanest route:", err);
    }
  };

  useEffect(() => {
    if (selectedLocation) {
      setStart(`${selectedLocation[0].toFixed(4)}, ${selectedLocation[1].toFixed(4)}`);
    }
  }, [selectedLocation]);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">🚗 Plan Your Commute</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">Mode of Transport</label>
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

        <div className="md:col-span-2 flex flex-col gap-4 items-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition duration-300"
          >
            🚀 Optimize Route
          </button>

          <button
            type="button"
            onClick={fetchCleanestRoute}
            className="px-6 py-2 text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-200"
          >
            ♻️ Suggest Cleanest Route
          </button>

          {distanceKm > 0 && (
            <p className="text-gray-600 text-sm">
              Distance: <strong>{distanceKm.toFixed(2)} km</strong> — Duration: <strong>{durationMin} min</strong>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CommuteForm;