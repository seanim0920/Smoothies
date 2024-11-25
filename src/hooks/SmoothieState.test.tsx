import { act, renderHook } from '@testing-library/react';
import { SmoothieRepository } from '../storage/Repository';
import { Smoothie } from '../types/Smoothie';
import { useSmoothieState } from './SmoothieState';

jest.mock('../utils/FilterSmoothies', () => ({
  filterSmoothies: jest.fn((filterText: string, smoothies: Smoothie[]) => {
    if (!filterText) return smoothies;
    return smoothies.filter(s => s.name.includes(filterText));
  }),
}));

describe('useSmoothieState Hook', () => {
  let repository: SmoothieRepository;
  const initialSmoothies: Smoothie[] = [
    { id: '1', name: 'Strawberry Blast', isPublished: false },
    { id: '2', name: 'Mango Mania', isPublished: true },
  ];

  beforeEach(() => {
    repository = new SmoothieRepository();
    jest.clearAllMocks();
  });

  it('should initialize with initial smoothies', () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    expect(result.current.smoothies).toEqual(initialSmoothies);
  });

  it('should create a new smoothie', () => {
    const newSmoothie: Smoothie = { id: '3', name: 'Blueberry Bliss', isPublished: false };
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.createSmoothie(newSmoothie);
    });

    expect(repository.createSmoothie).toHaveBeenCalledWith(newSmoothie);
    expect(result.current.smoothies).toContainEqual(newSmoothie);
  });

  it('should update an existing smoothie', () => {
    const update = { id: '1', name: 'Strawberry Explosion' };
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.updateSmoothie(update);
    });

    expect(repository.updateSmoothie).toHaveBeenCalledWith(update, false);
    expect(result.current.smoothies.find(s => s.id === '1')?.name).toBe('Strawberry Explosion');
  });

  it('should alert when updating a non-existent smoothie', () => {
    window.alert = jest.fn();
    const update = { id: '999', name: 'Non-existent' };
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.updateSmoothie(update);
    });

    expect(window.alert).toHaveBeenCalledWith('Could not find smoothie to update');
    expect(repository.updateSmoothie).not.toHaveBeenCalled();
  });

  it('should delete an existing smoothie', () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.deleteSmoothie('1');
    });

    expect(repository.deleteSmoothie).toHaveBeenCalledWith('1', false);
    expect(result.current.smoothies.find(s => s.id === '1')).toBeUndefined();
  });

  it('should alert when deleting a non-existent smoothie', () => {
    window.alert = jest.fn();
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.deleteSmoothie('999');
    });

    expect(window.alert).toHaveBeenCalledWith('Could not find smoothie to delete');
    expect(repository.deleteSmoothie).not.toHaveBeenCalled();
  });

  it('should publish a smoothie', () => {
    const publishSmoothie = { id: '1' };
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.publishSmoothie(publishSmoothie);
    });

    expect(repository.publishSmoothie).toHaveBeenCalledWith(publishSmoothie);
    expect(result.current.smoothies.find(s => s.id === '1')?.isPublished).toBe(true);
  });

  it('should alert if smoothie is already published when trying to publish', () => {
    window.alert = jest.fn();
    const publishSmoothie = { id: '2' }; // Already published
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.publishSmoothie(publishSmoothie);
    });

    expect(window.alert).toHaveBeenCalledWith('Smoothie already published');
    expect(repository.publishSmoothie).not.toHaveBeenCalled();
  });

  it('should unpublish a smoothie', () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.unpublishSmoothie('2');
    });

    expect(repository.unpublishSmoothie).toHaveBeenCalledWith('2');
    expect(result.current.smoothies.find(s => s.id === '2')?.isPublished).toBe(false);
  });

  it('should alert if smoothie is not published when trying to unpublish', () => {
    window.alert = jest.fn();
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.unpublishSmoothie('1'); // Not published
    });

    expect(window.alert).toHaveBeenCalledWith('Smoothie is not published');
    expect(repository.unpublishSmoothie).not.toHaveBeenCalled();
  });

  it('should filter smoothies based on filter text', () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.filterSmoothies('Mango');
    });

    expect(result.current.smoothies).toEqual([
      { id: '2', name: 'Mango Mania', isPublished: true },
    ]);
  });

  it('should reset filter when filter text is empty', () => {
    const { result } = renderHook(() =>
      useSmoothieState({ initialSmoothies, repository })
    );

    act(() => {
      result.current.filterSmoothies('Mango');
    });

    expect(result.current.smoothies).toHaveLength(1);

    act(() => {
      result.current.filterSmoothies('');
    });

    expect(result.current.smoothies).toHaveLength(initialSmoothies.length);
  });
});
