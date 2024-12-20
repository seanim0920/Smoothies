import { useEffect, useRef, useState } from 'react';
import { useRequest } from '../../common/useRequest';
import { SmoothieRepository } from '../storage/Repository';
import { Smoothie, SmoothieID, SmoothieInput, SmoothiePublish } from '../Types';
import { filterSmoothies } from '../utils/FilterSmoothies';

export const useSmoothieStorageState = (repository: SmoothieRepository) => {
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
      const updatedSmoothie = {...smoothie, ...update}
      await repository.updateSmoothie(updatedSmoothie)
      saveSmoothies(savedSmoothies.current.map((s) => (s.id === smoothieId ? updatedSmoothie : s)))
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
    filterSmoothies: (filterText?: string) => {
      smoothiesFilter.current = filterText ?? "";
      setSmoothies(!filterText ? savedSmoothies.current : filterSmoothies(filterText, savedSmoothies.current));
    }
  }
}
