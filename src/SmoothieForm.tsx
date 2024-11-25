import { ListField } from "./components/ListField";
import { useForm } from "./hooks/Form";
import { Ingredient, SmoothieInput } from "./types/Smoothie";
import { validateIngredients, validateName } from "./utils/SmoothieFormValidation";

const initialSmoothie = {
  name: "",
  ingredients: [{ name: "", quantity: "" }],
  tags: [],
  isPublished: false
}

export const SmoothieForm = (
  {
    initialValues = initialSmoothie, 
    onSubmit,
    submitText
  } : {
    initialValues?: SmoothieInput
    onSubmit: (smoothie: SmoothieInput) => void
    submitText: string
  }
) => {
  const { isValid, values, setValue, getValue, resetForm } = useForm<SmoothieInput>({
    initialValues,
    validations: {
      name: validateName,
      ingredients: validateIngredients,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    console.log("Smoothie Created:", values);
    onSubmit(values)
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Smoothie</h2>

      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={getValue("name")}
          onChange={(e) => setValue("name", e.target.value)}
          placeholder="Smoothie Name"
          required
        />
      </div>

      <div>
        <h3>Ingredients</h3>
        <ListField<Ingredient>
          value={getValue("ingredients")}
          onChange={(newIngredients) => setValue("ingredients", newIngredients)}
          addItem={() => ({ name: "", quantity: "" })}
          renderItem={(ingredient, index, onChangeItem, onRemove) => (
            <div key={index}>
              {
                index === 0 && <label htmlFor="name">Name</label>
              }
              <input
                type="text"
                placeholder="Ingredient Name"
                value={ingredient.name}
                onChange={(e) =>
                  onChangeItem({ ...ingredient, name: e.target.value })
                }
                required
              />
              {
                index === 0 && <label htmlFor="quantity">Quantity</label>
              }
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) =>
                  onChangeItem({ ...ingredient, quantity: e.target.value })
                }
                required
              />
              {
                getValue("ingredients").length > 1 ? (
                  <button type="button" onClick={onRemove}>
                    Remove
                  </button>
                ) : null
              }
            </div>
          )}
        />
      </div>

      <div>
        <h3>Tags</h3>
        <ListField<string>
          value={getValue("tags") ?? []}
          onChange={(newTags) => setValue("tags", newTags)}
          addItem={() => ""}
          renderItem={(tag, index, onChangeItem, onRemove) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={(e) => onChangeItem(e.target.value)}
              />
              <button type="button" onClick={onRemove}>
                Remove
              </button>
            </div>
          )}
        />
      </div>

      <button type="submit">{submitText}</button>
      <button type="button" onClick={resetForm}>
        Reset
      </button>
    </form>
  );
};
