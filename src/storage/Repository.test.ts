import { Smoothie } from "../types/Smoothie";
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

const testSmoothie: Smoothie = {
  id: '1',
  name: 'Berry Blast',
  ingredients: [{name: 'Berries', quantity: "1 cup"}, {name: 'Yogurt', quantity: "1 cup"}],
  tags: ['Healthy', 'Fruity'],
  isPublished: false,
};

describe("SmoothieRepository", () => {
  describe('loadSmoothies', () => {
    it('should load all saved smoothies', async () => {
      localSmoothieStorageMock.loadSmoothies.mockResolvedValueOnce([testSmoothie]);
  
      const smoothies = await smoothieRepository.loadSmoothies();
  
      expect(smoothies).toEqual([testSmoothie]);
    });
  
    it('should not fail if no smoothies are saved', async () => {
      localSmoothieStorageMock.loadSmoothies.mockResolvedValueOnce([]);
  
      const smoothies = await smoothieRepository.loadSmoothies();

      expect(smoothies).toEqual([]);
    });
  });  

  describe('createSmoothie', () => {
    it('should create a private smoothie', async () => {
      await smoothieRepository.createSmoothie(testSmoothie);
  
      expect(localSmoothieStorageMock.createSmoothie).toHaveBeenCalledWith(testSmoothie);
      expect(publicSmoothieStorageMock.createSmoothie).not.toHaveBeenCalled();
    });
  
    it('should create and publish a smoothie', async () => {
      const publishedSmoothie = { ...testSmoothie, isPublished: true };
  
      await smoothieRepository.createSmoothie(publishedSmoothie);
  
      expect(localSmoothieStorageMock.createSmoothie).toHaveBeenCalledWith(publishedSmoothie);
      expect(publicSmoothieStorageMock.createSmoothie).toHaveBeenCalledWith(publishedSmoothie);
    });
  });

  describe('publishSmoothie', () => {
    it('should publish a smoothie', async () => {
      await smoothieRepository.publishSmoothie({ ...testSmoothie, isPublished: true });
  
      expect(publicSmoothieStorageMock.createSmoothie).toHaveBeenCalledWith(testSmoothie);
      expect(localSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith(testSmoothie);
    });
  });  
  
  describe('updateSmoothie', () => {
    it('should update a private smoothie', async () => {
      await smoothieRepository.updateSmoothie(testSmoothie);
  
      expect(localSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith(testSmoothie);
      expect(publicSmoothieStorageMock.updateSmoothie).not.toHaveBeenCalled();
    });
  
    it('should update a public smoothie', async () => {
      const updatedSmoothie = { ...testSmoothie, isPublished: true }

      await smoothieRepository.updateSmoothie(updatedSmoothie);
  
      expect(localSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith(updatedSmoothie);
      expect(publicSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith(updatedSmoothie);
    });
  });  

  describe('unpublishSmoothie', () => {
    it('should unpublish a public smoothie', async () => {
      await smoothieRepository.unpublishSmoothie(testSmoothie.id);
  
      expect(publicSmoothieStorageMock.deleteSmoothie).toHaveBeenCalledWith(testSmoothie.id);
      expect(localSmoothieStorageMock.updateSmoothie).toHaveBeenCalledWith({
        id: testSmoothie.id,
        isPublished: false,
      });
    });
  });  

  describe('deleteSmoothie', () => {
    it('should delete a private smoothie', async () => {
      await smoothieRepository.deleteSmoothie(testSmoothie.id, false);
  
      expect(localSmoothieStorageMock.deleteSmoothie).toHaveBeenCalledWith(testSmoothie.id);
    });
  
    it('should delete and unpublish a public smoothie', async () => {
      await smoothieRepository.deleteSmoothie(testSmoothie.id, true);
  
      expect(localSmoothieStorageMock.deleteSmoothie).toHaveBeenCalledWith(testSmoothie.id);
      expect(publicSmoothieStorageMock.deleteSmoothie).toHaveBeenCalledWith(testSmoothie.id);
    });
  });  
});
