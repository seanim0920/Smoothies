import { Smoothie, SmoothieUpdate } from "../types/Smoothie";

export class PublicSmoothieStorage {
  private apiBaseUrl = 'https://api.yourdomain.com/smoothies';

  async createSmoothie(smoothie: Smoothie): Promise<void> {
    // await fetch(this.apiBaseUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(smoothie),
    // });
  }

  async updateSmoothie(smoothieUpdate: SmoothieUpdate): Promise<void> {
    // await fetch(`${this.apiBaseUrl}/${smoothieUpdate.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(smoothieUpdate),
    // });
  }

  async deleteSmoothie(smoothieId: string): Promise<void> {
    // await fetch(`${this.apiBaseUrl}/${smoothieId}`, {
    //   method: 'DELETE',
    // });
  }
}

export const publicSmoothieStorage = new PublicSmoothieStorage()