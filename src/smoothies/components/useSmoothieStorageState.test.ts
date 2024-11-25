import { act, renderHook } from "@testing-library/react";
import { SmoothieRepository } from "../storage/Repository";
import { Smoothie } from "../Types";
import { useSmoothieStorageState } from "./useSmoothieStorageState";

export const mockRepository = {
  loadSmoothies: jest.fn(),
  createSmoothie: jest.fn(),
  updateSmoothie: jest.fn(),
  deleteSmoothie: jest.fn(),
  publishSmoothie: jest.fn(),
  unpublishSmoothie: jest.fn(),
} as unknown as jest.Mocked<SmoothieRepository>;

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

describe("useSmoothieStorageState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load smoothies from the repository", async () => {
    mockRepository.loadSmoothies.mockResolvedValueOnce(mockSmoothies);

    const { result } = renderHook(() => useSmoothieStorageState(mockRepository));

    await act(async () => {});

    expect(result.current.status).toBe("success");
    expect(result.current.smoothies).toEqual(mockSmoothies);
  });

  it("should create a new smoothie in state and repository", async () => {
    const newSmoothie = {
      id: "3",
      name: "Green Machine",
      ingredients: [{ name: "Spinach", quantity: "1 cup" }],
      tags: ["Healthy"],
      isPublished: false,
    };
  
    mockRepository.loadSmoothies.mockResolvedValueOnce([]);
  
    const { result } = renderHook(() => useSmoothieStorageState(mockRepository));
  
    await act(async () => {});
  
    mockRepository.createSmoothie.mockResolvedValueOnce(newSmoothie);
  
    await act(async () => {
      await result.current.createSmoothie(newSmoothie);
    });
  
    expect(result.current.smoothies).toContainEqual(newSmoothie);
    expect(mockRepository.createSmoothie).toHaveBeenCalledWith(newSmoothie);
  });

  it("should update a smoothie in state and repository", async () => {
    mockRepository.loadSmoothies.mockResolvedValueOnce(mockSmoothies);

    const { result } = renderHook(() => useSmoothieStorageState(mockRepository));

    await act(async () => {});

    const update = { ...mockSmoothies[0], name: "Berry Blast Supreme" };

    await act(async () => {
      await result.current.updateSmoothie("1", update);
    });

    expect(result.current.smoothies.find((s) => s.id === "1")?.name).toBe("Berry Blast Supreme");
    expect(mockRepository.updateSmoothie).toHaveBeenCalledWith({
      ...mockSmoothies[0],
      ...update,
    });
  });

  it("should delete a smoothie in state and repository", async () => {
    mockRepository.loadSmoothies.mockResolvedValueOnce(mockSmoothies);

    const { result } = renderHook(() => useSmoothieStorageState(mockRepository));

    await act(async () => {});

    await act(async () => {
      await result.current.deleteSmoothie("1");
    });

    expect(result.current.smoothies).not.toContainEqual(mockSmoothies[0]);
    expect(mockRepository.deleteSmoothie).toHaveBeenCalledWith("1", false);
  });

  it("should publish a smoothie in state and repository", async () => {
    mockRepository.loadSmoothies.mockResolvedValueOnce(mockSmoothies);

    const { result } = renderHook(() => useSmoothieStorageState(mockRepository));

    await act(async () => {});

    await act(async () => {
      await result.current.publishSmoothie({ ...mockSmoothies[0], isPublished: true });
    });

    expect(result.current.smoothies.find((s) => s.id === "1")?.isPublished).toBe(true);
    expect(mockRepository.publishSmoothie).toHaveBeenCalledWith({ ...mockSmoothies[0], isPublished: true });
  });

  it("should unpublish a smoothie in state and repository", async () => {
    mockRepository.loadSmoothies.mockResolvedValueOnce(mockSmoothies);

    const { result } = renderHook(() => useSmoothieStorageState(mockRepository));

    await act(async () => {});

    await act(async () => {
      await result.current.unpublishSmoothie("2");
    });

    expect(result.current.smoothies.find((s) => s.id === "2")?.isPublished).toBe(false);
    expect(mockRepository.unpublishSmoothie).toHaveBeenCalledWith("2");
  });

  it("should filter smoothies", async () => {
    mockRepository.loadSmoothies.mockResolvedValueOnce(mockSmoothies);

    const { result } = renderHook(() => useSmoothieStorageState(mockRepository));

    await act(async () => {});

    act(() => {
      result.current.filterSmoothies("berry");
    });

    expect(result.current.smoothies).toEqual([mockSmoothies[0]]);
  });
});