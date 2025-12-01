// src/components/store/brandstore.jsx
// Brand Store using localStorage (no backend API needed)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default brands to show initially
const defaultBrands = [
  { id: '1', name: "Apple", logo: "https://cdn.worldvectorlogo.com/logos/apple-11.svg" },
  { id: '2', name: "Samsung", logo: "https://cdn.worldvectorlogo.com/logos/samsung-6.svg" },
  { id: '3', name: "Nike", logo: "https://cdn.worldvectorlogo.com/logos/nike-4.svg" },
  { id: '4', name: "Adidas", logo: "https://cdn.worldvectorlogo.com/logos/adidas-8.svg" },
  { id: '5', name: "Sony", logo: "https://cdn.worldvectorlogo.com/logos/sony-2.svg" },
  { id: '6', name: "LG", logo: "https://cdn.worldvectorlogo.com/logos/lg-6.svg" },
  { id: '7', name: "Dell", logo: "https://cdn.worldvectorlogo.com/logos/dell-11.svg" },
  { id: '8', name: "HP", logo: "https://cdn.worldvectorlogo.com/logos/hewlett-packard-enterprise-1.svg" },
];

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
