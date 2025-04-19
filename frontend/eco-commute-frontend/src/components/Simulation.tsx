import { useState } from "react";

const Simulation = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [currentDay, setCurrentDay] = useState(0);
  const [emissionsByDay, setEmissionsByDay] = useState<number[]>([58, 62, 55, 70, 64, 40, 45]);

  const currentEmission = emissionsByDay[currentDay];

  return (
    <section className="max-w-3xl mx-auto mt-12 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        🚦 Simulate Your Week
      </h2>

      {/* Day Selector */}
      <div className="flex justify-between items-center mb-6 border-b-2 pb-2 border-gray-300">
        {days.map((day, index) => (
          <button
            key={day}
            onClick={() => setCurrentDay(index)}
            className={`text-sm font-semibold transition-colors duration-200 focus:outline-none ${
              currentDay === index ? "text-green-600" : "text-gray-400"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Emissions Bar */}
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">
          Your Carbon Emissions
        </h3>
        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${currentEmission}%` }}
          ></div>
        </div>
        <p className="mt-2 text-gray-700 text-lg font-medium">
          {currentEmission}% of average commute emissions
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Day {currentDay + 1}: {currentEmission}% emissions
        </p>
      </div>
    </section>
  );
};

export default Simulation;
