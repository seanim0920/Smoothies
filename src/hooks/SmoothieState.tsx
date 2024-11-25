import { useRef, useState } from 'react';
import { SmoothieRepository } from '../storage/Repository';
import { Smoothie, SmoothieID, SmoothiePublish, SmoothieUpdate } from '../types/Smoothie';
import { filterSmoothies } from '../utils/FilterSmoothies';

export const useSmoothieState = ({
  initialSmoothies,
  repository
} : {
  initialSmoothies: Smoothie[],
  repository: SmoothieRepository
}) => {
  const savedSmoothies = useRef(initialSmoothies)
  const smoothiesFilter = useRef("")
  const [smoothies, setSmoothies] = useState(initialSmoothies)

  const saveSmoothies = (smoothies: Smoothie[]) => {
    savedSmoothies.current = [...smoothies]
    setSmoothies(filterSmoothies(smoothiesFilter.current, smoothies))
  }

  const findSmoothie = (smoothieId: string) => {
    return savedSmoothies.current.find((smoothie) => smoothieId === smoothie.id)
  }

  return {
    smoothies,
    createSmoothie: (smoothie: Smoothie) => {
      saveSmoothies([...savedSmoothies.current, smoothie])
      repository.createSmoothie(smoothie)
    },
    updateSmoothie: (update: SmoothieUpdate) => {
      const smoothie = findSmoothie(update.id)
      if (!smoothie) {
        alert("Could not find smoothie to update")
        return;
      }
      saveSmoothies(savedSmoothies.current.map((s) => (s.id === update.id ? {...smoothie, ...update} : s)))
      repository.updateSmoothie(update, smoothie.isPublished)
    },
    deleteSmoothie: (smoothieId: SmoothieID) => {
      const smoothie = findSmoothie(smoothieId)
      if (!smoothie) {
        alert("Could not find smoothie to delete")
        return;
      }
      saveSmoothies(savedSmoothies.current.filter((s) => s.id !== smoothieId))
      repository.deleteSmoothie(smoothieId, smoothie.isPublished)
    },
    publishSmoothie: (smoothie: SmoothiePublish) => {
      if (findSmoothie(smoothie.id)?.isPublished) {
        alert("Smoothie already published")
        return;
      }
      saveSmoothies(savedSmoothies.current.map((s) => (s.id === smoothie.id ? {...smoothie, isPublished: true} : s)))
      repository.publishSmoothie(smoothie)
    },
    unpublishSmoothie: (smoothieId: SmoothieID) => {
      if (!findSmoothie(smoothieId)?.isPublished) {
        alert("Smoothie is not published")
        return;
      }
      saveSmoothies(savedSmoothies.current.map((s) => (s.id === smoothieId ? {...s, isPublished: false} : s)))
      repository.unpublishSmoothie(smoothieId)
    },
    filterSmoothies: (filterText: string) => {
      smoothiesFilter.current = filterText;
      setSmoothies(filterSmoothies(filterText, savedSmoothies.current));
    }
  }
}
