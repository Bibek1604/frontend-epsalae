// Global Configuration
// Uses environment variables for flexibility across deployments

// API Configuration - Uses environment variable with fallback
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-epasal.onrender.com';
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
// DESIGN SYSTEM - Premium Blue-Green Theme
// ============================================

export const theme = {
  // Primary Colors
  colors: {
    primary: '#4A90E2',      // Light Blue - Main brand color
    primaryDark: '#357ABD',  // Darker blue for hover states
    primaryLight: '#6BA5E7', // Lighter blue for backgrounds
    
    success: '#34C759',      // Green - Success, active states
    successDark: '#2DB14C',  // Darker green for hover
    successLight: '#4CD964', // Lighter green
    
    // Neutrals
    white: '#FFFFFF',
    background: '#F7F9FA',   // Soft gray background
    surface: '#FFFFFF',      // Card backgrounds
    border: '#E8ECF0',       // Border color
    
    // Text
    textPrimary: '#1A1D21',  // Main text
    textSecondary: '#6B7280', // Secondary text
    textMuted: '#9CA3AF',    // Muted text
    
    // Status Colors
    warning: '#F5A623',
    error: '#FF3B30',
    info: '#5AC8FA',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #4A90E2 0%, #34C759 100%)',
    gradientBlue: 'linear-gradient(135deg, #4A90E2 0%, #6BA5E7 100%)',
    gradientGreen: 'linear-gradient(135deg, #34C759 0%, #4CD964 100%)',
  },
  
  // Border Radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    card: '0 4px 20px rgba(74, 144, 226, 0.1)',
    button: '0 4px 14px rgba(74, 144, 226, 0.25)',
  },
  
  // Typography
  fonts: {
    heading: "'Inter', -apple-system, sans-serif",
    body: "'Inter', -apple-system, sans-serif",
  },
};
