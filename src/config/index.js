// Global Configuration
// Change this URL when deploying to production

export const API_BASE_URL = 'http://localhost:5000';
export const API_URL = `${API_BASE_URL}/api/v1`;

// Helper function to get full image URL
export const getImageUrl = (imageUrl, placeholder = 'https://via.placeholder.com/400x400?text=No+Image') => {
  if (!imageUrl) return placeholder;
  return imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`;
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
