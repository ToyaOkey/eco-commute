import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';

type TripData = {
  mode: string;
  distance_km: number;
  duration_min: number;
  time_of_day: string;
  co2_emitted: number;
  co2_saved: number;
};

const Impact = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [explanation, setExplanation] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true); // 👈 Toggle state

  const fetchTrip = async () => {
    try {
      const res = await fetch("http://localhost:8000/latest_trip/1");
      const data = await res.json();
      setTripData(data);
    } catch (err) {
      console.error("❌ Failed to fetch latest trip");
    }
  };

  const fetchExplanation = async (tripData: TripData) => {
    try {
      const res = await fetch("http://localhost:8000/explain_route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch (err) {
      console.error("❌ Failed to generate explanation");
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [refreshKey]);

  useEffect(() => {
    if (tripData) {
      fetchExplanation(tripData);
    }
  }, [tripData]);

  return (
    <section className="bg-green-50 p-6 rounded-xl shadow-md max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-800">🌱 Your Commute Impact</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-1 rounded"
          >
            {showExplanation ? "🙈 Hide" : "👀 Show"} Explanation
          </button>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
          >
            🔁 Refresh
          </button>
        </div>
      </div>

      {!tripData ? (
        <p className="text-gray-500 italic">Loading trip data...</p>
      ) : (
        <>
          <ul className="mb-4 space-y-1 text-gray-800">
            <li><strong>🚲 Mode:</strong> {tripData.mode.charAt(0).toUpperCase() + tripData.mode.slice(1)}</li>
            <li><strong>📏 Distance:</strong> {tripData.distance_km} <keygen />km</li>
            <li><strong>🕒 Duration:</strong> {tripData.duration_min} Min</li>
            <li><strong>🌤️ Time:</strong> {tripData.time_of_day.charAt(0).toUpperCase() + tripData.time_of_day.slice(1)}</li>
            <li><strong>🌫️ CO₂ Emitted:</strong> {tripData.co2_emitted} g</li>
            <li><strong>💚 CO₂ Saved:</strong> {tripData.co2_saved} g</li>
          </ul>

          {showExplanation && (
            <div className="bg-white border-l-4 border-green-400 p-4 rounded shadow text-green-800">
              <h3 className="font-semibold mb-1">🧠 Why this route?</h3>
              <ReactMarkdown>{explanation || "Generating explanation..."}</ReactMarkdown>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Impact;