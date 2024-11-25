import { Smoothie, SmoothieUpdate } from "../types/Smoothie";

export class LocalSmoothieStorage {
  private storageKey = 'smoothies';

  async createSmoothie(smoothie: Smoothie): Promise<void> {
    const smoothies = await this.loadSmoothies();
    smoothies.push(smoothie);
    localStorage.setItem(this.storageKey, JSON.stringify(smoothies));
  }

  async loadSmoothies(): Promise<Smoothie[]> {
    const data = localStorage.getItem(this.storageKey);
    return data ? (JSON.parse(data) as Smoothie[]) : [];
  }

  async updateSmoothie(smoothieUpdate: SmoothieUpdate): Promise<void> {
    const smoothies = await this.loadSmoothies();
    const index = smoothies.findIndex((s) => s.id === smoothieUpdate.id);
    if (index !== -1) {
      smoothies[index] = {...smoothies[index], ...smoothieUpdate};
      localStorage.setItem(this.storageKey, JSON.stringify(smoothies));
    }
  }

  async deleteSmoothie(smoothieId: string): Promise<void> {
    const smoothies = await this.loadSmoothies();
    const filtered = smoothies.filter((s) => s.id !== smoothieId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}

export const localSmoothieStorage = new LocalSmoothieStorage()