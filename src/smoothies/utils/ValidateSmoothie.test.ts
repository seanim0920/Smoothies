import { Ingredient } from "../Types";
import { validateIngredients, validateName } from "./ValidateSmoothie";

describe("validateName", () => {
  it("should return an error if the name is empty", () => {
    expect(validateName("    ")).toBe("Name is required");
  });

  it("should return null if the name is valid", () => {
    expect(validateName("Berry Blast")).toBeNull();
  });
});

describe("validateIngredients", () => {
  it("should return an error if ingredients array is empty", () => {
    expect(validateIngredients([])).toBe("At least one ingredient is required");
  });

  it("should return an error if ingredients array is null", () => {
    expect(validateIngredients(null as unknown as Ingredient[])).toBe(
      "At least one ingredient is required"
    );
  });

  it("should return an error if an ingredient name is empty", () => {
    const ingredients: Ingredient[] = [
      { name: "    ", quantity: "1 cup" },
    ];
    expect(validateIngredients(ingredients)).toBe("Ingredient 1 name is required");
  });

  it("should return an error if an ingredient quantity is empty", () => {
    const ingredients: Ingredient[] = [
      { name: "Banana", quantity: "    " },
    ];
    expect(validateIngredients(ingredients)).toBe("Ingredient 1 quantity is required");
  });

  it("should return null if all ingredients are valid", () => {
    const ingredients: Ingredient[] = [
      { name: "Banana", quantity: "1 cup" },
      { name: "Milk", quantity: "200ml" },
    ];
    expect(validateIngredients(ingredients)).toBeNull();
  });
});
