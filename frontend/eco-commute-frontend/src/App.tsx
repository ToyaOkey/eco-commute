import './App.css'
import Hero from './components/Hero.tsx'
import CommuteForm   from "./components/CommuteForm.tsx";
import Impact from "./components/Impact.tsx";
import Simulation from "./components/Simulation.tsx";
import Map from "./components/Map.tsx";



function App() {

  return (
    <>
      <Hero></Hero>
      <CommuteForm></CommuteForm>
        <Map></Map>
      {/*<AIExplanation></AIExplanation>*/}
      <Impact></Impact>
      {/*<ComparisonView></ComparisonView>*/}
        <Simulation />




    </>
  )
}

export default App;
