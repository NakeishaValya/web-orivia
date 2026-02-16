/**
 * Google OAuth Configuration
 * Make sure to set VITE_GOOGLE_CLIENT_ID in your .env file
 */

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const googleConfig = {
  clientId: GOOGLE_CLIENT_ID,
  scope: 'email profile',
  redirectUri: window.location.origin,
};

// Validate configuration
if (!GOOGLE_CLIENT_ID) {
  console.warn('⚠️ VITE_GOOGLE_CLIENT_ID is not set in environment variables');
}
