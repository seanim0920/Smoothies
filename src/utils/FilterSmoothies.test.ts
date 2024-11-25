
import { Ingredient, Smoothie } from "../types/Smoothie";
import { filterSmoothies } from "./FilterSmoothies";

const createIngredient = (name: string, quantity: string): Ingredient => ({
  name,
  quantity,
});

describe("filterSmoothies", () => {
  const smoothies: Smoothie[] = [
    {
      id: "1",
      name: "Strawberry Blast",
      ingredients: [
        createIngredient("Strawberries", "200g"),
        createIngredient("Banana", "1 medium"),
        createIngredient("Yogurt", "150ml"),
      ],
      isPublished: false,
      tags: ["Fruit", "Summer"],
    },
    {
      id: "2",
      name: "Mango Mania",
      ingredients: [
        createIngredient("Mango", "2 cups"),
        createIngredient("Pineapple", "1 cup"),
        createIngredient("Coconut Milk", "250ml"),
      ],
      isPublished: true,
      tags: ["Tropical", "Refreshing"],
    },
    {
      id: "3",
      name: "Green Goddess",
      ingredients: [
        createIngredient("Spinach", "100g"),
        createIngredient("Kale", "50g"),
        createIngredient("Apple", "1 large"),
      ],
      isPublished: true,
      tags: ["Healthy", "Vegan"],
    },
    {
      id: "4",
      name: "Berry Blast",
      ingredients: [
        createIngredient("Blueberries", "150g"),
        createIngredient("Raspberries", "100g"),
        createIngredient("Almond Milk", "200ml"),
      ],
      isPublished: false,
      tags: ["Fruit", "Antioxidants"],
    },
    {
      id: "5",
      name: "Chocolate Delight",
      ingredients: [
        createIngredient("Cocoa Powder", "2 tbsp"),
        createIngredient("Banana", "1 medium"),
        createIngredient("Milk", "200ml"),
      ],
      isPublished: true,
    },
    {
      id: "6",
      name: "Sunday Surprise",
      ingredients: [
        createIngredient("Mystery Ingredient", "1 unit"),
      ],
      isPublished: false,
      tags: [""],
    },
    {
      id: "7",
      name: "Milk",
      ingredients: [],
      isPublished: false,
      tags: ["No Ingredients"],
    },
  ];

  it("returns all smoothies when filterText is empty", () => {
    expect(filterSmoothies("", smoothies)).toEqual(smoothies);
  })
  
  it("returns no smoothies when filterText does not match", () => {
    expect(filterSmoothies("nonexistent", smoothies)).toEqual(smoothies);
  })

  describe("Filtering by Name", () => {
    it.each([
      {
        filterText: "Sunday Surprise",
        expected: [smoothies[5]],
        description: "matches smoothie name",
      },
      {
        filterText: "BlAsT",
        expected: [smoothies[0], smoothies[3]],
        description: "matches smoothie name case insensitively with partial text",
      },
    ])("should $description", ({ filterText, expected }) => {
      const result = filterSmoothies(filterText, smoothies);
      expect(result).toEqual(expected);
    });
  });
  
  describe("Filtering by Ingredients", () => {
    it.each([
      {
        filterText: "ystery",
        expected: [smoothies[5]],
        description: "matches smoothies based on ingredients with partial text",
      },
      {
        filterText: "mILk",
        expected: [smoothies[3], smoothies[4], smoothies[6]],
        description: "matches smoothies based on ingredients case insensitively",
      },
      {
        filterText: "raspberries blueberries",
        expected: [smoothies[3]],
        description: "matches smoothies based on multiple ingredients",
      },
    ])("should $description", ({ filterText, expected }) => {
      const result = filterSmoothies(filterText, smoothies);
      expect(result).toEqual(expected);
    });
  });

  describe("Filtering by Tag", () => {
    it.each([
      {
        filterText: "tRoPiCa",
        expected: [smoothies[1]],
        description: "matches tag case insensitively with partial text",
      },
      {
        filterText: "No Ingredients",
        expected: [smoothies[6]],
        description: "matches tag in smoothies with no ingredients",
      },
      {
        filterText: "Fruit-",
        expected: [smoothies[0], smoothies[3]],
        description: "ignores special characters",
      },
      {
        filterText: "Summer Fruit",
        expected: [smoothies[0]],
        description: "matches multiple tags"
      },
    ])("should $description", ({ filterText, expected }) => {
      const result = filterSmoothies(filterText, smoothies);
      expect(result).toEqual(expected);
    });
  });
});
