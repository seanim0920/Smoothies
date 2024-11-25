import { Smoothie } from "../Types";

export class PublicSmoothieStorage {
  async createSmoothie(smoothie: Smoothie): Promise<void> {
    console.log("Creating a public smoothie", smoothie);
  }

  async updateSmoothie(smoothie: Smoothie): Promise<void> {
    console.log("Updating a public smoothie", smoothie);
  }

  async deleteSmoothie(smoothieId: string): Promise<void> {
    console.log("Deleting a public smoothie", smoothieId);
  }
}

export const publicSmoothieStorage = new PublicSmoothieStorage();
