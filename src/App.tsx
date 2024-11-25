import { useRef, useState } from 'react';
import { confetti } from './common/Confetti';
import { SmoothieForm } from './smoothies/components/SmoothieForm';
import { useSmoothieStorageState } from './smoothies/components/useSmoothieStorageState';
import { smoothieRespository } from './smoothies/storage/Repository';
import { Smoothie } from './smoothies/Types';
import { ViewSmoothies } from './ViewSmoothies';

type Navigation = 
  | { flow: 'ViewSmoothies' }
  | { flow: 'CreateSmoothie' }
  | { flow: 'EditSmoothie'; smoothie: Smoothie }

export const App = () => {
  const smoothieState = useSmoothieStorageState(smoothieRespository)
  const [currentFlow, setCurrentFlow] = useState<Navigation>({ flow: 'ViewSmoothies' });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (smoothieState.status === "error") {
    alert("Failed to fetch smoothies from local storage. Data may not be persisted.");
  }

  if (smoothieState.status === "loading") {
    return <h1>Loading Smoothie Recipes</h1>
  }

  const handleNavigateToList = () => {
    smoothieState.filterSmoothies('')
    setCurrentFlow({flow: 'ViewSmoothies'})
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
          <ViewSmoothies
            smoothies={smoothieState.smoothies}
            onFilter={smoothieState.filterSmoothies}
            onDelete={smoothieState.deleteSmoothie}
            onEdit={
              (smoothie) => {
                setCurrentFlow({flow: "EditSmoothie", smoothie})
              }
            }
          />
        </>
      ) : (
        <>
          {currentFlow.flow === "EditSmoothie" ?
            <SmoothieForm 
              onReturn={handleNavigateToList}
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
              onReturn={handleNavigateToList}
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