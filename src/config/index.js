// Global Configuration
// Change this URL when deploying to production

export const API_BASE_URL = 'http://localhost:5000';
export const API_URL = `${API_BASE_URL}/api/v1`;

// Helper function to get full image URL
export const getImageUrl = (imageUrl, placeholder = 'https://via.placeholder.com/400x400?text=No+Image') => {
  if (!imageUrl) return placeholder;
  return imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`;
};
