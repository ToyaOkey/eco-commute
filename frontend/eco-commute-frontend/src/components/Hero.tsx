const Hero = () => (
    <section className="relative min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-6 overflow-hidden">
      <div className="text-center space-y-8 max-w-2xl z-10">
        {/* 🌿 Main illustration */}
        <img
          src="https://i0.wp.com/discoverandshare.org/wp-content/uploads/2024/03/Recycling_sign_green.png?w=1024&ssl=1"
          alt="Eco commute"
          className="w-64 mx-auto drop-shadow-md"
        />
  
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-700 tracking-tight drop-shadow-xl">
          EcoCommute
        </h1>
  
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          Use AI to plan a smarter, greener commute. Save time. Cut costs. Shrink your footprint. 🌍
        </p>
  
        {/* ⬇️ Scroll arrow as a button */}
        <a href="#map" className="block mt-4">
          <svg
            className="mx-auto w-10 h-10 text-green-600 animate-bounce hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <span className="sr-only">Scroll to map</span>
        </a>
      </div>
  
      {/* 🌍 Bouncing Earth icon (bottom-right corner) */}
      <img
        src="https://cdn.pixabay.com/photo/2023/08/12/13/43/earth-8185636_1280.png"
        alt="Bouncing Earth"
        className="absolute bottom-6 right-6 w-12 h-12 animate-bounce drop-shadow-md opacity-80 z-0"
      />
    </section>
  );
  
  export default Hero;