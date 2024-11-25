import { act, renderHook } from "@testing-library/react";
import { SmoothieRepository } from "../storage/Repository";
import { Smoothie } from "../types/Smoothie";
import { useSmoothieState } from "./SmoothieState";

export const mockRepository = {
  createSmoothie: jest.fn(),
  updateSmoothie: jest.fn(),
  deleteSmoothie: jest.fn(),
  publishSmoothie: jest.fn(),
  unpublishSmoothie: jest.fn(),
} as unknown as SmoothieRepository;

export const mockSmoothies: Smoothie[] = [
  {
    id: "1",
    name: "Berry Blast",
    ingredients: [
      { name: "Blueberries", quantity: "150g" },
      { name: "Raspberries", quantity: "100g" },
    ],
    tags: ["Fruit", "Antioxidants"],
    isPublished: false,
  },
  {
    id: "2",
    name: "Tropical Delight",
    ingredients: [
      { name: "Mango", quantity: "1 cup" },
      { name: "Pineapple", quantity: "1 cup" },
    ],
    tags: ["Tropical", "Refreshing"],
    isPublished: true,
  },
];

describe("useSmoothieState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with the given smoothies", () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies: mockSmoothies, repository: mockRepository })
    );

    expect(result.current.smoothies).toEqual(mockSmoothies);
  });

  it("should create a new smoothie and call repository", () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies: mockSmoothies, repository: mockRepository })
    );

    const newSmoothie = {
      id: "3",
      name: "Green Machine",
      ingredients: [{ name: "Spinach", quantity: "1 cup" }],
      tags: ["Healthy"],
      isPublished: false,
    };

    act(() => {
      result.current.createSmoothie(newSmoothie);
    });

    expect(result.current.smoothies).toContainEqual(newSmoothie);
    expect(mockRepository.createSmoothie).toHaveBeenCalledWith(newSmoothie);
  });

  it("should update an existing smoothie and call repository", () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies: mockSmoothies, repository: mockRepository })
    );

    const update = { id: "1", name: "Berry Blast Supreme" };

    act(() => {
      result.current.updateSmoothie(update);
    });

    expect(result.current.smoothies.find((s) => s.id === "1")?.name).toBe("Berry Blast Supreme");
    expect(mockRepository.updateSmoothie).toHaveBeenCalledWith(update, false);
  });

  it("should alert and not update if the smoothie to update is not found", () => {
    global.alert = jest.fn();
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies: mockSmoothies, repository: mockRepository })
    );

    const update = { id: "nonexistent", name: "Unknown Smoothie" };

    act(() => {
      result.current.updateSmoothie(update);
    });

    expect(global.alert).toHaveBeenCalledWith("Could not find smoothie to update");
    expect(mockRepository.updateSmoothie).not.toHaveBeenCalled();
  });

  it("should delete a smoothie and call repository", () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies: mockSmoothies, repository: mockRepository })
    );

    act(() => {
      result.current.deleteSmoothie("1");
    });

    expect(result.current.smoothies).not.toContainEqual(mockSmoothies[0]);
    expect(mockRepository.deleteSmoothie).toHaveBeenCalledWith("1", false);
  });

  it("should alert and not delete if the smoothie to delete is not found", () => {
    global.alert = jest.fn();
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies: mockSmoothies, repository: mockRepository })
    );

    act(() => {
      result.current.deleteSmoothie("nonexistent");
    });

    expect(global.alert).toHaveBeenCalledWith("Could not find smoothie to delete");
    expect(mockRepository.deleteSmoothie).not.toHaveBeenCalled();
  });

  it("should publish a smoothie and call repository", () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies: mockSmoothies, repository: mockRepository })
    );

    act(() => {
      result.current.publishSmoothie({...mockSmoothies[0], isPublished: true});
    });

    expect(result.current.smoothies.find((s) => s.id === "1")?.isPublished).toBe(true);
    expect(mockRepository.publishSmoothie).toHaveBeenCalledWith({...mockSmoothies[0], isPublished: true});
  });

  it("should filter smoothies", () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies: mockSmoothies, repository: mockRepository })
    );

    act(() => {
      result.current.filterSmoothies("berry");
    });

    expect(result.current.smoothies).toEqual([mockSmoothies[0]]);
  });
});
