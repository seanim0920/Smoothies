
import { Smoothie } from "../Types";
import { filterSmoothies } from "./FilterSmoothies";

export const mockSmoothies: Smoothie[] = [
  {
    id: "1",
    name: "Strawberry Blast",
    ingredients: [
      { name: "Strawberries", quantity: "200g" },
      { name: "Banana", quantity: "1 medium" },
      { name: "Yogurt", quantity: "150ml" },
    ],
    isPublished: false,
    tags: ["Fruit", "Summer"],
  },
  {
    id: "2",
    name: "Mango Mania",
    ingredients: [
      { name: "Mango", quantity: "2 cups" },
      { name: "Pineapple", quantity: "1 cup" },
      { name: "Coconut Milk", quantity: "250ml" },
    ],
    isPublished: true,
    tags: ["Tropical", "Refreshing"],
  },
  {
    id: "3",
    name: "Green Goddess",
    ingredients: [
      { name: "Spinach", quantity: "100g" },
      { name: "Kale", quantity: "50g" },
      { name: "Apple", quantity: "1 large" },
    ],
    isPublished: true,
    tags: ["Healthy", "Vegan"],
  },
  {
    id: "4",
    name: "Berry Blast",
    ingredients: [
      { name: "Blueberries", quantity: "150g" },
      { name: "Raspberries", quantity: "100g" },
      { name: "Almond Milk", quantity: "200ml" },
    ],
    isPublished: false,
    tags: ["Fruit", "Antioxidants"],
  },
  {
    id: "5",
    name: "Chocolate Delight",
    ingredients: [
      { name: "Cocoa Powder", quantity: "2 tbsp" },
      { name: "Banana", quantity: "1 medium" },
      { name: "Milk", quantity: "200ml" },
    ],
    isPublished: true,
  },
  {
    id: "6",
    name: "Sunday Surprise",
    ingredients: [
      { name: "Mystery Ingredient", quantity: "1 unit" },
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

describe("filterSmoothies", () => {
  it("returns all smoothies when filterText is empty", () => {
    expect(filterSmoothies("", mockSmoothies)).toEqual(mockSmoothies);
  })
  
  it("returns no smoothies when filterText does not match", () => {
    expect(filterSmoothies("nonexistent", mockSmoothies)).toEqual([]);
  })

  describe("Filtering by Name", () => {
    it.each([
      {
        filterText: "Sunday Surprise",
        expected: [mockSmoothies[5]],
        description: "match smoothie name",
      },
      {
        filterText: "BlAsT",
        expected: [mockSmoothies[0], mockSmoothies[3]],
        description: "match smoothie name case insensitively with partial text",
      },
    ])("should $description", ({ filterText, expected }) => {
      const result = filterSmoothies(filterText, mockSmoothies);
      expect(result).toEqual(expected);
    });
  });
  
  describe("Filtering by Ingredients", () => {
    it.each([
      {
        filterText: "ystery",
        expected: [mockSmoothies[5]],
        description: "match smoothies based on ingredients with partial text",
      },
      {
        filterText: "mILk",
        expected: [mockSmoothies[1], mockSmoothies[3], mockSmoothies[4], mockSmoothies[6]],
        description: "match smoothies based on ingredients case insensitively",
      },
      {
        filterText: "raspberries blueberries",
        expected: [mockSmoothies[3]],
        description: "match smoothies based on multiple ingredients",
      },
    ])("should $description", ({ filterText, expected }) => {
      const result = filterSmoothies(filterText, mockSmoothies);
      expect(result).toEqual(expected);
    });
  });

  describe("Filtering by Tag", () => {
    it.each([
      {
        filterText: "tRoPiCa",
        expected: [mockSmoothies[1]],
        description: "match tag case insensitively with partial text",
      },
      {
        filterText: "No Ingredients",
        expected: [mockSmoothies[6]],
        description: "match tag in smoothies with no ingredients",
      },
      {
        filterText: "Fruit-",
        expected: [mockSmoothies[0], mockSmoothies[3]],
        description: "ignores special characters",
      },
      {
        filterText: "Summer Fruit",
        expected: [mockSmoothies[0]],
        description: "match multiple tags"
      },
    ])("should $description", ({ filterText, expected }) => {
      const result = filterSmoothies(filterText, mockSmoothies);
      expect(result).toEqual(expected);
    });
  });
});
