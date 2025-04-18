import {useEffect, useState} from "react";

type CommuteFormProps = {
    selectedLocation: [number, number] | null;
};

const CommuteForm = ({ selectedLocation }: { selectedLocation: [number, number] | null }) => {
    const [start, setStart] = useState('');
    const [destination, setDestination] = useState('');

    useEffect(() => {
        if (selectedLocation) {
            setStart(`${selectedLocation[0].toFixed(4)}, ${selectedLocation[1].toFixed(4)}`);
        }
    }, [selectedLocation]);

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">🚗 Plan Your Commute</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Start Location</label>
                    <input
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter or select on map"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Destination</label>
                    <input
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Where are you going?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
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