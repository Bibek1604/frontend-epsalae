// Global Configuration
// Uses environment variables for flexibility across deployments

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API Configuration - Uses environment variable with fallback
// In development default to relative path so Vite proxy can forward requests
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (isDevelopment ? '' : 'https://backend-epasal.onrender.com');
export const API_URL = `${API_BASE_URL}/api/v1`;

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Epasaley';
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || "Nepal's Trusted Online Store";

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Default placeholder image - Generic product placeholder
const PLACEHOLDER = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600';

// Helper function to get full image URL
// Handles: Cloudinary URLs, old local paths, and missing images
export const getImageUrl = (imagePath, placeholder = PLACEHOLDER) => {
  if (!imagePath) return placeholder;
  
  // Already a full URL (Cloudinary, Unsplash, etc.) - use directly
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Old local path (/uploads/...) - these images are lost, show placeholder
  // User needs to re-upload via admin panel to get Cloudinary URL
  if (imagePath.startsWith('/uploads')) {
    // Only warn in development to keep production console clean
    if (isDevelopment) {
      console.warn('⚠️ Old local image path detected. Please re-upload this image:', imagePath);
    }
    return placeholder;
  }
  
  // Fallback for any other paths
  return placeholder;
};

// ============================================
// DESIGN SYSTEM - Premium Deep Blue & Orange Theme
// ============================================

export const theme = {
  // Primary Colors
  colors: {
    primary: '#1A3C8A',      // Deep Blue - Main brand color
    primaryDark: '#112960',  // Darker blue for hover states
    primaryLight: '#2D52B2', // Lighter blue for backgrounds
    
    brandOrange: '#FF6B35',  // Vibrant Orange - Branding & accents
    brandOrangeDark: '#E0531F', // Darker orange
    brandOrangeLight: '#FF885B', // Lighter orange
    
    success: '#10B981',      // Emerald Green - Success, checkout
    successDark: '#059669',  // Darker green
    successLight: '#34D399', // Lighter green
    
    // Neutrals
    white: '#FFFFFF',
    background: '#F9FAFB',   // Soft gray background
    surface: '#FFFFFF',      // Card backgrounds
    border: '#F3F4F6',       // Border color
    
    // Text
    textPrimary: '#111827',  // Main text
    textSecondary: '#4B5563', // Secondary text
    textMuted: '#9CA3AF',    // Muted text
    
    // Status Colors
    warning: '#F5A623',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #1A3C8A 0%, #FF6B35 100%)',
    gradientBlue: 'linear-gradient(135deg, #1A3C8A 0%, #2D52B2 100%)',
    gradientOrange: 'linear-gradient(135deg, #FF6B35 0%, #FF885B 100%)',
  },
  
  // Border Radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    card: '0 10px 30px rgba(26, 60, 138, 0.04)',
    button: '0 10px 20px rgba(255, 107, 53, 0.15)',
  },
  
  // Typography
  fonts: {
    heading: "'Inter', -apple-system, sans-serif",
    body: "'Inter', -apple-system, sans-serif",
  },
};
