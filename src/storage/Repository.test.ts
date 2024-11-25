import { SmoothieInput, SmoothiePublish } from "../types/Smoothie";
import { LocalSmoothieStorage } from "./LocalStorage";
import { PublicSmoothieStorage } from "./PublicStorage";
import { SmoothieRepository } from "./Repository";

const localSmoothieStorageMock = {
  loadSmoothies: jest.fn(),
  createSmoothie: jest.fn(),
  updateSmoothie: jest.fn(),
  deleteSmoothie: jest.fn(),
} as unknown as jest.Mocked<LocalSmoothieStorage>;

const publicSmoothieStorageMock = {
  createSmoothie: jest.fn(),
  updateSmoothie: jest.fn(),
  deleteSmoothie: jest.fn(),
} as unknown as jest.Mocked<PublicSmoothieStorage>;

const smoothieRepository = new SmoothieRepository(
  localSmoothieStorageMock,
  publicSmoothieStorageMock
);

const testSmoothie: SmoothieInput = {
  name: 'Berry Blast',
  ingredients: [{name: 'Berries', quantity: "1 cup"}, {name: 'Yogurt', quantity: "1 cup"}],
  tags: ['Healthy', 'Fruity'],
  isPublished: false,
};

describe("SmoothieRepository", () => {
  describe('loadSmoothies', () => {
    it('should load all saved smoothies', async () => {
      const savedSmoothie = {...testSmoothie, id: '1'}

      localSmoothieStorageMock.loadSmoothies.mockResolvedValueOnce([savedSmoothie]);
  
      const smoothies = await smoothieRepository.loadSmoothies();
  
      expect(smoothies).toEqual([savedSmoothie]);
    });
  
    it('should not fail if no smoothies are saved', async () => {
      localSmoothieStorageMock.loadSmoothies.mockResolvedValueOnce([]);
  
      const smoothies = await smoothieRepository.loadSmoothies();

      expect(smoothies).toEqual([]);
    });
  });  

  describe('createSmoothie', () => {
    it('should create a private smoothie', async () => {
      const smoothie = await smoothieRepository.createSmoothie(testSmoothie);
  
      expect(localSmoothieStorageMock.createSmoothie).toHaveBeenCalledWith(smoothie);
      expect(publicSmoothieStorageMock.createSmoothie).not.toHaveBeenCalled();
    });
  
    it('should create and publish a smoothie', async () => {
      const publishedSmoothie = { ...testSmoothie, isPublished: true };
  
      const smoothie = await smoothieRepository.createSmoothie(publishedSmoothie);
  
      expect(localSmoothieStorageMock.createSmoothie).toHaveBeenCalledWith(smoothie);
      expect(publicSmoothieStorageMock.createSmoothie).toHaveBeenCalledWith(smoothie);
    });
  });

  describe('publishSmoothie', () => {
    it('should publish a smoothie', async () => {
      const smoothie = await smoothieRepository.createSmoothie(testSmoothie);
      const update: SmoothiePublish = { ...smoothie, isPublished: true }
      await smoothieRepository.publishSmoothie(update);
  
      expect(publicSmoothieStorageMock.createSmoothie).toHaveBeenCalledWith(update);
      expect(localSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith(update);
    });
  });  
  
  describe('updateSmoothie', () => {
    it('should update a private smoothie', async () => {
      const smoothie = await smoothieRepository.createSmoothie(testSmoothie);
      const update = { ...smoothie, name: "test" }
      await smoothieRepository.updateSmoothie(update);
  
      expect(localSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith(update);
      expect(publicSmoothieStorageMock.updateSmoothie).not.toHaveBeenCalled();
    });
  
    it('should update a public smoothie', async () => {
      const smoothie = await smoothieRepository.createSmoothie(testSmoothie);
      const updatedSmoothie = { ...smoothie, isPublished: true }

      await smoothieRepository.updateSmoothie(updatedSmoothie);
  
      expect(localSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith(updatedSmoothie);
      expect(publicSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith(updatedSmoothie);
    });
  });  

  describe('unpublishSmoothie', () => {
    it('should unpublish a public smoothie', async () => {
      const smoothie = await smoothieRepository.createSmoothie(testSmoothie);
      await smoothieRepository.unpublishSmoothie(smoothie.id);
  
      expect(publicSmoothieStorageMock.deleteSmoothie).toHaveBeenCalledWith(smoothie.id);
      expect(localSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith({
        id: smoothie.id,
        isPublished: false,
      });
    });
  });  

  describe('deleteSmoothie', () => {
    it('should delete a private smoothie', async () => {
      const smoothie = await smoothieRepository.createSmoothie(testSmoothie);
      await smoothieRepository.deleteSmoothie(smoothie.id, false);
  
      expect(localSmoothieStorageMock.deleteSmoothie).toHaveBeenCalledWith(smoothie.id);
    });
  
    it('should delete and unpublish a public smoothie', async () => {
      const smoothie = await smoothieRepository.createSmoothie(testSmoothie);
      await smoothieRepository.deleteSmoothie(smoothie.id, true);
  
      expect(localSmoothieStorageMock.deleteSmoothie).toHaveBeenCalledWith(smoothie.id);
      expect(publicSmoothieStorageMock.deleteSmoothie).toHaveBeenCalledWith(smoothie.id);
    });
  });  
});
