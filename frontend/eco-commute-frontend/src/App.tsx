import './App.css'
import Hero from './components/Hero.tsx'
import Impact from './components/Impact.tsx'
import Simulation from "./components/Simulation.tsx";
import CommutePage from "./components/CommutePage.tsx";
import 'leaflet/dist/leaflet.css'; 



function App() {

  return (
    <>
      <Hero></Hero>
      <CommutePage></CommutePage>
      <Impact></Impact>
        <Simulation />




    </>
  )
}

export default App;
