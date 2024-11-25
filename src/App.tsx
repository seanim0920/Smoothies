import { useRef, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { confetti } from './Confetti';
import { useSmoothieState } from './hooks/SmoothieState';
import { SmoothieDetails } from './SmoothieDetails';
import { SmoothieForm } from './SmoothieForm';
import { smoothieRespository } from './storage/Repository';
import { Smoothie } from './types/Smoothie';

type Navigation = 
  | { flow: 'ViewSmoothies' }
  | { flow: 'CreateSmoothie' }
  | { flow: 'EditSmoothie'; smoothie: Smoothie }

export const App = () => {
  const smoothieState = useSmoothieState(smoothieRespository)
  const [currentFlow, setCurrentFlow] = useState<Navigation>({ flow: 'ViewSmoothies' });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (smoothieState.status === "error") {
    alert("Failed to fetch smoothies from local storage. Data may not be persisted.");
  }

  if (smoothieState.status === "loading") {
    return <h1>Loading Smoothie Recipes</h1>
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
        }}
      />
      <h1>Smoothie Recipes</h1>
      {currentFlow.flow === 'ViewSmoothies' ? (
        <>
          <button onClick={() => setCurrentFlow({flow: 'CreateSmoothie'})}>Make a Smoothie</button>
          <SearchBar onSearch={smoothieState.filterSmoothies} />
          <div>
            <h2>{
              smoothieState.smoothies.length === 0 ?
              "Make a New Smoothie!" :
              "Your Smoothies"
            }</h2>
            {smoothieState.smoothies.map((smoothie) => (
              <SmoothieDetails
                key={smoothie.id}
                smoothie={smoothie}
                onDelete={smoothieState.deleteSmoothie}
                onEdit={
                  (smoothie) => {
                    setCurrentFlow({flow: "EditSmoothie", smoothie})
                  }
                }
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {currentFlow.flow === "EditSmoothie" ?
            <SmoothieForm 
              onReturn={() => setCurrentFlow({flow: 'ViewSmoothies'})}
              initialValues={currentFlow.smoothie}
              onSubmit={
                (smoothieForm) => {
                  smoothieState.updateSmoothie(currentFlow.smoothie.id, smoothieForm)
                  setCurrentFlow({flow: "ViewSmoothies"})
                }
              } 
              submitText={"Finish Editing"}
            /> :
            <SmoothieForm
              onReturn={() => setCurrentFlow({flow: 'ViewSmoothies'})}
              onSubmit={
                (smoothie) => {
                  smoothieState.createSmoothie(smoothie)
                  confetti(canvasRef.current)
                  setCurrentFlow({flow: "ViewSmoothies"})
                }
              } 
              submitText={"Create Smoothie"}
            />
          }
        </>
      )}
    </div>
  );
}