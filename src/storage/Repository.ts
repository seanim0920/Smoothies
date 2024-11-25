import { Smoothie, SmoothieID, SmoothiePublish, SmoothieUpdate } from '../types/Smoothie';
import { LocalSmoothieStorage, localSmoothieStorage } from './LocalStorage';
import { PublicSmoothieStorage, publicSmoothieStorage } from './PublicStorage';

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
      return this.localSmoothieStorage.loadSmoothies();
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
    smoothie: Smoothie
  ): Promise<void> => {
    try {
      await this.localSmoothieStorage.createSmoothie(smoothie);

      if (smoothie.isPublished) {
        await this.publicSmoothieStorage.createSmoothie(smoothie);
      }
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
   * @param smoothieUpdate The updated smoothie data.
   */
  updateSmoothie = async (smoothieUpdate: SmoothieUpdate, shouldPublish: boolean): Promise<void> => {
    try {
      await this.localSmoothieStorage.updateSmoothie(smoothieUpdate);

      if (shouldPublish) {
        await this.publicSmoothieStorage.updateSmoothie(smoothieUpdate);
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