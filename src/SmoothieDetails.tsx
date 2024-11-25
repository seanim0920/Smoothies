export const SmoothieDetails = ({ smoothie, onDelete, onEdit }) => {
  return (
    <div>
      <h3>{smoothie.name}</h3>
      <p>Ingredients:</p>
      <ul>
        {smoothie.ingredients.map((ing, index) => (
          <li key={index}>
            {ing.quantity} of {ing.name}
          </li>
        ))}
      </ul>
      {smoothie.tags && (
        <p>
          Tags: {smoothie.tags.join(', ')}
        </p>
      )}
      <button onClick={() => onEdit(smoothie.id)}>Edit</button>
      <button onClick={() => onDelete(smoothie.id)}>Delete</button>
    </div>
  );
}
