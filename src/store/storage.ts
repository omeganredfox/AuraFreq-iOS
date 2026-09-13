import AsyncStorage from '@react-native-async-storage/async-storage';
import { MultiLayerMixerConfig } from '../audio/types';

const FAVORITES_KEY = '@AuraFreq:favorites';

export interface FavoriteRecipe {
  id: string;
  name: string;
  config: MultiLayerMixerConfig;
  createdAt: number;
}

export const StorageService = {
  /**
   * Favori tarifleri getirir
   */
  getFavorites: async (): Promise<FavoriteRecipe[]> => {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('getFavorites error:', e);
      return [];
    }
  },

  /**
   * Yeni bir tarif kaydeder
   */
  saveFavorite: async (name: string, config: MultiLayerMixerConfig): Promise<FavoriteRecipe> => {
    try {
      const favorites = await StorageService.getFavorites();
      const newRecipe: FavoriteRecipe = {
        id: Date.now().toString(),
        name,
        config,
        createdAt: Date.now(),
      };
      
      const updated = [newRecipe, ...favorites];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return newRecipe;
    } catch (e) {
      console.error('saveFavorite error:', e);
      throw e;
    }
  },

  /**
   * ID'ye göre favori tarifi siler
   */
  removeFavorite: async (id: string): Promise<void> => {
    try {
      const favorites = await StorageService.getFavorites();
      const updated = favorites.filter((f) => f.id !== id);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('removeFavorite error:', e);
      throw e;
    }
  }
};