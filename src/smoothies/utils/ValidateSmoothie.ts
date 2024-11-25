import { Ingredient } from "../Types";

export const validateName = (value: string) => {
  if (!value || value.trim() === "") {
    return "Name is required";
  }
  return null;
}

export const validateIngredients = (ingredients: Ingredient[]) => {
  if (!ingredients || ingredients.length === 0) {
    return "At least one ingredient is required";
  }
  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];
    if (!ingredient.name || ingredient.name.trim() === "") {
      return `Ingredient ${i + 1} name is required`;
    }
    if (!ingredient.quantity || ingredient.quantity.trim() === "") {
      return `Ingredient ${i + 1} quantity is required`;
    }
  }
  return null;
}