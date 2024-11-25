import { useEffect, useRef, useState } from 'react';
import { SmoothieRepository } from '../storage/Repository';
import { Smoothie, SmoothieID, SmoothieInput, SmoothiePublish } from '../types/Smoothie';
import { filterSmoothies } from '../utils/FilterSmoothies';
import { useRequest } from './Request';

export const useSmoothieState = (repository: SmoothieRepository) => {
  const savedSmoothies = useRef<Smoothie[]>([])
  const smoothiesFilter = useRef("")
  const [smoothies, setSmoothies] = useState<Smoothie[]>([])

  const smoothiesResponse = useRequest(repository.loadSmoothies)

  useEffect(() => {
    if (smoothiesResponse.status === "success") {
      saveSmoothies(smoothiesResponse.data)
    }
  }, [smoothiesResponse])

  const saveSmoothies = (smoothies: Smoothie[]) => {
    savedSmoothies.current = [...smoothies]
    setSmoothies(filterSmoothies(smoothiesFilter.current, smoothies))
  }

  const findSmoothie = (smoothieId: string) => {
    return savedSmoothies.current.find((smoothie) => smoothieId === smoothie.id)
  }

  return {
    status: smoothiesResponse.status,
    smoothies,
    createSmoothie: async (smoothieForm: SmoothieInput) => {
      const newSmoothie = await repository.createSmoothie(smoothieForm)
      saveSmoothies([...savedSmoothies.current, newSmoothie])
    },
    updateSmoothie: async (smoothieId: SmoothieID, update: SmoothieInput) => {
      const smoothie = findSmoothie(smoothieId)
      if (!smoothie) {
        alert("Could not find smoothie to update")
        return;
      }
      await repository.updateSmoothie(smoothie)
      saveSmoothies(savedSmoothies.current.map((s) => (s.id === smoothieId ? {...smoothie, ...update} : s)))
    },
    deleteSmoothie: async (smoothieId: SmoothieID) => {
      const smoothie = findSmoothie(smoothieId)
      if (!smoothie) {
        alert("Could not find smoothie to delete")
        return;
      }
      await repository.deleteSmoothie(smoothieId, smoothie.isPublished)
      saveSmoothies(savedSmoothies.current.filter((s) => s.id !== smoothieId))
    },
    publishSmoothie: async (smoothie: SmoothiePublish) => {
      if (findSmoothie(smoothie.id)?.isPublished) {
        alert("Smoothie already published")
        return;
      }
      await repository.publishSmoothie(smoothie)
      saveSmoothies(savedSmoothies.current.map((s) => (s.id === smoothie.id ? {...smoothie, isPublished: true} : s)))
    },
    unpublishSmoothie: async (smoothieId: SmoothieID) => {
      if (!findSmoothie(smoothieId)?.isPublished) {
        alert("Smoothie is not published")
        return;
      }
      await repository.unpublishSmoothie(smoothieId)
      saveSmoothies(savedSmoothies.current.map((s) => (s.id === smoothieId ? {...s, isPublished: false} : s)))
    },
    filterSmoothies: (filterText: string) => {
      smoothiesFilter.current = filterText;
      setSmoothies(filterSmoothies(filterText, savedSmoothies.current));
    }
  }
}
