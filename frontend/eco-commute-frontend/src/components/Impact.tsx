import CarbonMeter from "./CarbonMeter.tsx";
import ComparisonView from "./ComparisionView.tsx";

function ExplainRoute() {
    return null;
}

const Impact = () => (
    <section className="bg-green-50 py-10 text-center rounded-xl shadow max-w-3xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold text-emerald-800">🌍 Collective Impact</h2>
        <p className="text-4xl mt-2 text-green-700 font-extrabold">+3,200 kg CO₂ Saved</p>
        <p className="text-sm mt-1 text-gray-600">That's like planting 150 trees 🌱</p>
        <CarbonMeter percentage={42} />
        <ComparisonView />
        <ExplainRoute />
    </section>
);

export default Impact;