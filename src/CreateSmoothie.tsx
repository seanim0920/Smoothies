import { useState } from 'react';

export const SmoothieForm = ({ onCreateSmoothie }: {onCreateSmoothie: (smoothie: Smoothie) => void}) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [tags, setTags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    onCreateSmoothie({
      id: Date.now().toString(),
      name,
      ingredients,
      tags,
    });

    setName('');
    setIngredients([{ name: '', quantity: '' }]);
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Smoothie</h2>
      <input
        type="text"
        placeholder="Smoothie Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Add Smoothie</button>
    </form>
  );
}
