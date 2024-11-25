import { SmoothieDetails } from './SmoothieDetails';

export const SmoothieList = ({ smoothies, onDeleteSmoothie, onEditSmoothie }) => {
  return (
    <div>
      <h2>Your Smoothies</h2>
      {smoothies.map((smoothie) => (
        <SmoothieDetails
          key={smoothie.id}
          smoothie={smoothie}
          onDelete={onDeleteSmoothie}
          onEdit={onEditSmoothie}
        />
      ))}
    </div>
  );
}
