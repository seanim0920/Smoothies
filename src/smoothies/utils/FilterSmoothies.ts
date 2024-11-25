import { normalize } from "../../common/String";
import { Smoothie } from "../Types";

export const filterSmoothies = (filterText: string, smoothies: Smoothie[]): Smoothie[] => {
  const queries = filterText.split(/\s+/).map(normalize);

  return smoothies.filter((smoothie) => {
    const normalizedName = normalize(smoothie.name);

    const normalizedTags = smoothie.tags?.map(normalize) || [];

    const normalizedIngredients = smoothie.ingredients.map((ingredient) => normalize(ingredient.name));

    return queries.every((query) =>
      normalizedName.includes(query) ||
      normalizedTags.some((tag) => tag.includes(query)) ||
      normalizedIngredients.some((ingredient) => ingredient.includes(query))
    );
  });
};
