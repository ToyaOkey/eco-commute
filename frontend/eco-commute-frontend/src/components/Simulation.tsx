import CarbonMeter from './CarbonMeter';
import {useState} from "react";

const Simulation = () => {
    const [day, setDay] = useState(0);
    const carbonData = [58, 46, 42, 38, 33, 29, 25];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="text-center mt-12 bg-white shadow-lg rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">🚦 Simulate Your Week</h3>
            <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-2">
                {dayLabels.map((label, index) => (
                    <span key={index} className={`w-full text-center ${day === index ? 'text-green-600 font-bold' : ''}`}>{label}</span>
                ))}
            </div>
            <input
                type="range"
                min="0"
                max="6"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full accent-green-600"
            />
            <CarbonMeter percentage={carbonData[day]} />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">Day {day + 1}: {carbonData[day]}% emissions</p>
        </div>
    );
};

export default Simulation;