import { Smoothie } from "../Types";

export const SmoothieDetails = (
  { 
    smoothie,
  } : {
    smoothie: Smoothie,
  }
) => {
  return (
    <>
      <h3>{smoothie.name}</h3>
      <p>Ingredients:</p>
      <ul>
        {smoothie.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} of {ingredient.name}
          </li>
        ))}
      </ul>
      {smoothie.tags && smoothie.tags.join('').length > 0 && (
        <p>
          Tags: {smoothie.tags.join(', ')}
        </p>
      )}
    </>
  );
}
