const Hero = () => (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-2xl">
            <h1 className="text-6xl font-extrabold text-green-700 tracking-tight drop-shadow-md">
                EcoCommute
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Use AI to plan a smarter, greener commute. Save time. Cut costs. Shrink your footprint. 🌍
            </p>
            <button className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full text-lg transition duration-300 shadow-md">
                🚀 Start Planning
            </button>
        </div>
    </section>
)

export default Hero;

