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
      {/* <CommuteForm selectedLocation={null}></CommuteForm> */}
      <CommutePage></CommutePage>
        {/* <Map center={[0, 0]}></Map> */}
      {/*<AIExplanation></AIExplanation>*/}
      <Impact></Impact>
      {/*<ComparisonView></ComparisonView>*/}
        <Simulation />




    </>
  )
}

export default App;
