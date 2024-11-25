import { SmoothieForm } from './CreateSmoothie';
import { useRequest } from './hooks/Request';
import { useSmoothieState } from './hooks/SmoothieState';
import { SearchBar } from './SearchBar';
import { smoothieRespository } from './storage/Repository';
import { SmoothieList } from './ViewSmoothies';

export const App = () => {
  const smoothiesResponse = useRequest(smoothieRespository.loadSmoothies)
  const smoothieState = useSmoothieState(
    smoothiesResponse.status === "success" ? smoothiesResponse.data : []
  )
  
  if (smoothiesResponse.status === "error") {
    alert("Failed to fetch smoothies from local storage. Data may not be persisted.");
  }

  return (
    <div>
      <h1>Smoothie Recipes</h1>
      <SmoothieForm onCreateSmoothie={() => {console.error("unimplemented")}} />
      <SearchBar onSearch={smoothieRespository.filterSmoothies} />
      <SmoothieList
        smoothies={smoothieState.smoothies}
        onDeleteSmoothie={() => {console.error("unimplemented")}}
        onEditSmoothie={() => {console.error("unimplemented")}}
      />
    </div>
  );
}