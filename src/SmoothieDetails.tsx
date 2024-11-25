import { Smoothie, SmoothieID } from "./types/Smoothie";

export const SmoothieDetails = (
  { 
    smoothie, 
    onDelete, 
    onEdit 
  } : {
    smoothie: Smoothie,
    onDelete: (smoothieId: SmoothieID) => void,
    onEdit: (smoothie: Smoothie) => void
  }
) => {
  return (
    <div>
      <h3>{smoothie.name}</h3>
      <p>Ingredients:</p>
      <ul>
        {smoothie.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} of {ingredient.name}
          </li>
        ))}
      </ul>
      {smoothie.tags && smoothie.tags.length > 0 && (
        <p>
          Tags: {smoothie.tags.join(', ')}
        </p>
      )}
      <button onClick={() => onEdit(smoothie)}>Edit</button>
      <button onClick={() => onDelete(smoothie.id)}>Delete</button>
    </div>
  );
}
