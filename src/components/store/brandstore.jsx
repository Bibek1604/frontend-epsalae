// src/components/store/brandstore.jsx
// Brand Store using localStorage (no backend API needed)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// No default brands - user adds them via admin panel
const defaultBrands = [];

export const useBrandStore = create(
  persist(
    (set, get) => ({
      brands: defaultBrands,

      // Add a new brand (title is optional)
      addBrand: (brand) => {
        const newBrand = {
          id: Date.now().toString(),
          name: brand.name || '', // Title is optional
          logo: brand.logo,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          brands: [...state.brands, newBrand]
        }));
        console.log('✅ Brand added:', newBrand);
        return newBrand;
      },

      // Update a brand
      updateBrand: (id, updates) => {
        set((state) => ({
          brands: state.brands.map(brand =>
            brand.id === id ? { ...brand, ...updates } : brand
          )
        }));
        console.log('✅ Brand updated:', id);
      },

      // Delete a brand
      deleteBrand: (id) => {
        set((state) => ({
          brands: state.brands.filter(brand => brand.id !== id)
        }));
        console.log('✅ Brand deleted:', id);
      },

      // Reset to default brands
      resetBrands: () => {
        set({ brands: defaultBrands });
        console.log('✅ Brands reset to default');
      },

      // Get all brands
      getBrands: () => get().brands,
    }),
    {
      name: 'brand-storage', // localStorage key
    }
  )
);
