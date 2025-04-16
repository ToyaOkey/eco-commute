const ComparisonView = () => (
    <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
            <h4 className="text-xl font-bold mb-2">Before</h4>
            <p className="text-sm text-gray-600">8.5 kg CO₂ • 45 min • $7.80</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 text-center">
            <h4 className="text-xl font-bold mb-2 text-green-700">Optimized</h4>
            <p className="text-sm text-gray-700">3.2 kg CO₂ • 38 min • $4.20</p>
        </div>
    </div>
);

export default ComparisonView;