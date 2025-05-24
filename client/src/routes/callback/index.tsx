import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { getAccessToken } from '../../integrations/spotify/auth';

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  
  useVisibleTask$(async () => {
    const code = location.url.searchParams.get('code');
    const state = location.url.searchParams.get('state');
    
    if (!code) {
      nav('/login');
      return;
    }
    
    try {
      // Get code verifier from localStorage
      const codeVerifier = localStorage.getItem('code_verifier');
      
      if (!codeVerifier) {
        throw new Error('No code verifier found');
      }
      
      // Exchange code for access token
      const tokenData = await getAccessToken(code, codeVerifier);
      
      if (tokenData.error) {
        throw new Error(tokenData.error_description || 'Failed to get access token');
      }
      
      // Store tokens
      localStorage.setItem('spotify_access_token', tokenData.access_token);
      localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
      localStorage.setItem('spotify_token_expiry', String(Date.now() + tokenData.expires_in * 1000));
      
      // Fetch user profile data
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const userData = await userResponse.json();
      
      // Store user data in localStorage
      localStorage.setItem('spotify_user_data', JSON.stringify(userData));
      
      // Clean up
      localStorage.removeItem('code_verifier');
      
      // Navigate to dashboard
      nav('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      nav('/login');
    }
  });
  
  return (
    <div class="flex items-center justify-center h-screen bg-mainbg">
      <div class="text-spotifywhite text-xl">Processing login...</div>
    </div>
  );
});
