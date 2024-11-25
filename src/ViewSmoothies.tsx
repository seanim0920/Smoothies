import { SmoothieDetails } from "./smoothies/components/SmoothieDetails";
import { Smoothie, SmoothieID } from "./smoothies/Types";

export const ViewSmoothies = ({
  onFilter,
  onDelete,
  onEdit,
  smoothies
}: {
  onFilter: (filterText?: string) => void;
  onDelete: (smoothieId: SmoothieID) => void;
  onEdit: (smoothie: Smoothie) => void;
  smoothies: Smoothie[]
}) => {
  return (
    <>
      <input
        type="text"
        placeholder="Search smoothies..."
        onChange={(e) => onFilter(e.target.value)}
      />
      <div>
        <h2>{
          smoothies.length === 0 ?
          "Make a New Smoothie!" :
          "Your Smoothies"
        }</h2>
        {smoothies.map((smoothie) => (
          <div>
            <SmoothieDetails
              key={smoothie.id}
              smoothie={smoothie}
            />
            <button onClick={() => onEdit(smoothie)}>Edit</button>
            <button onClick={() => onDelete(smoothie.id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}