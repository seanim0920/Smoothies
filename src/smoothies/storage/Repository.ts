import { Smoothie, SmoothieID, SmoothieInput, SmoothiePublish } from '../Types';
import { LocalSmoothieStorage, localSmoothieStorage } from './LocalStorage';
import { PublicSmoothieStorage, publicSmoothieStorage } from './PublicStorage';

const randomId = () => {
  return Math.random().toString(36).substring(2, 10);
}

export class SmoothieRepository {
  private localSmoothieStorage: LocalSmoothieStorage;
  private publicSmoothieStorage: PublicSmoothieStorage;

  constructor(
    localSmoothieStorage: LocalSmoothieStorage,
    publicSmoothieStorage: PublicSmoothieStorage
  ) {
    this.localSmoothieStorage = localSmoothieStorage;
    this.publicSmoothieStorage = publicSmoothieStorage;
  }

  /**
   * Loads smoothies from storage.
   */
  loadSmoothies = async (): Promise<Smoothie[]> => {
    try {
      const data = await this.localSmoothieStorage.loadSmoothies();
      return data ?? [];
    } catch (err) {
      console.error('Error loading smoothies:', err);
      throw err
    }
  };

  /**
   * Creates a new smoothie and optionally publishes it.
   * @param smoothie The smoothie data.
   * @param shouldPublish Whether to publish the smoothie upon creation.
   */
  createSmoothie = async (
    smoothieInput: SmoothieInput
  ): Promise<Smoothie> => {
    try {
      const smoothie = {...smoothieInput, id: randomId()}

      await this.localSmoothieStorage.createSmoothie(smoothie);

      if (smoothie.isPublished) {
        await this.publicSmoothieStorage.createSmoothie(smoothie);
      }

      return smoothie
    } catch (err) {
      console.error('Error creating smoothie:', err);
      throw err
    }
  };

  /**
   * Publishes a smoothie.
   * @param smoothie The smoothie to publish.
   */
  publishSmoothie = async (smoothie: SmoothiePublish): Promise<void> => {
    try {
      await this.publicSmoothieStorage.createSmoothie(smoothie);
      
      await this.localSmoothieStorage.updateSmoothie(smoothie);
    } catch (err) {
      console.error('Error publishing smoothie:', err);
      throw err
    }
  };

  /**
   * Updates a smoothie.
   * @param SmoothieInput The updated smoothie data.
   */
  updateSmoothie = async (smoothie: Smoothie): Promise<void> => {
    try {
      await this.localSmoothieStorage.updateSmoothie(smoothie);

      if (smoothie.isPublished) {
        await this.publicSmoothieStorage.updateSmoothie(smoothie);
      }
    } catch (err) {
      console.error('Error updating smoothie:', err);
      throw err
    }
  };

  /**
   * Unpublishes a smoothie by its ID.
   * @param smoothieId The ID of the smoothie to unpublish.
   */
  unpublishSmoothie = async (smoothieId: SmoothieID): Promise<void> => {
    try {
      await this.publicSmoothieStorage.deleteSmoothie(smoothieId);

      await this.localSmoothieStorage.updateSmoothie({ id: smoothieId, isPublished: false });
    } catch (err) {
      console.error('Error unpublishing smoothie:', err);
      throw err
    }
  };

  /**
   * Deletes a smoothie by its ID.
   * @param smoothieId The ID of the smoothie to delete.
   */
  deleteSmoothie = async (smoothieId: SmoothieID, shouldPublish: boolean): Promise<void> => {
    try {
      await this.localSmoothieStorage.deleteSmoothie(smoothieId);

      if (shouldPublish) {
        await this.publicSmoothieStorage.deleteSmoothie(smoothieId);
      }
    } catch (err) {
      console.error('Error deleting smoothie:', err);
      throw err
    }
  };
};

export const smoothieRespository = new SmoothieRepository(localSmoothieStorage, publicSmoothieStorage)