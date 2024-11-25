import { ListField } from "../../common/form/ListField";
import { useForm } from "../../common/form/useForm";
import { Ingredient, SmoothieInput } from "../Types";
import { validateIngredients, validateName } from "../utils/ValidateSmoothie";

const initialSmoothie: SmoothieInput = {
  name: "",
  ingredients: [{ name: "", quantity: "" }],
  tags: [],
  isPublished: false
}

const MIN_INGREDIENTS = 1

export const SmoothieForm = (
  {
    initialValues = initialSmoothie, 
    onSubmit,
    onReturn,
    submitText
  } : {
    initialValues?: SmoothieInput
    onSubmit: (smoothie: SmoothieInput) => void
    onReturn: () => void,
    submitText: string
  }
) => {
  const { isValid, isDirty, values, setValue, getValue, resetForm } = useForm<SmoothieInput>({
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
  
  const handleReturn = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave without saving?"
      );
      if (!confirmLeave) return;
    }
    onReturn();
  };

  const handleReset = () => {
    if (isDirty) {
      const confirmReset = window.confirm(
        "Are you sure you want to reset the form?"
      );
      if (!confirmReset) return;
    }
    resetForm();
  };

  return (
    <>
      <button onClick={handleReturn}>Return to Smoothies</button>
      <form onSubmit={handleSubmit}>
        <h2>Create a New Smoothie</h2>

        <div>
          <label style={{ fontWeight: "bold", marginBottom: "1rem" }} htmlFor="name">Name</label>
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
            labels={["Name", "Quantity"]}
            value={getValue("ingredients")}
            onChange={(newIngredients) => setValue("ingredients", newIngredients)}
            addItem={() => ({ name: "", quantity: "" })}
            renderItem={(ingredient, index, onChangeItem, onRemove) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Ingredient Name"
                  value={ingredient.name}
                  onChange={(e) =>
                    onChangeItem({ ...ingredient, name: e.target.value })
                  }
                  required
                />
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
                  getValue("ingredients").length > MIN_INGREDIENTS ? (
                    <button className="destructive" type="button" onClick={onRemove}>
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
                <button className="destructive" type="button" onClick={onRemove}>
                  Remove
                </button>
              </div>
            )}
          />
        </div>

        <div style={{marginTop: "2rem"}}>
          <button className="confirm" type="submit">{submitText}</button>
          <button className="destructive" type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </>
  );
};
