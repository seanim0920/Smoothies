import { Smoothie } from "../types/Smoothie";

export class LocalSmoothieStorage {
  private storageKey = 'smoothies';

  async createSmoothie(smoothie: Smoothie): Promise<void> {
    console.log("creating local smoothie")
    const smoothies = await this.loadSmoothies();
    smoothies.push(smoothie);
    localStorage.setItem(this.storageKey, JSON.stringify(smoothies));
  }

  async loadSmoothies(): Promise<Smoothie[]> {
    console.log("loading local smoothies")
    const data = localStorage.getItem(this.storageKey);
    console.log(data)
    return data ? (JSON.parse(data) as Smoothie[]) : [];
  }

  async updateSmoothie(smoothie: Partial<Smoothie> & Pick<Smoothie, "id">): Promise<void> {
    console.log("updating local smoothie")
    const smoothies = await this.loadSmoothies();
    const index = smoothies.findIndex((s) => s.id === smoothie.id);
    if (index !== -1) {
      smoothies[index] = {...smoothies[index], ...smoothie};
      localStorage.setItem(this.storageKey, JSON.stringify(smoothies));
    }
  }

  async deleteSmoothie(smoothieId: string): Promise<void> {
    console.log("deleting local smoothie")
    const smoothies = await this.loadSmoothies();
    const filtered = smoothies.filter((s) => s.id !== smoothieId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}

export const localSmoothieStorage = new LocalSmoothieStorage()