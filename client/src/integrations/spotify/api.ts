// Profile data
export async function getProfile(accessToken: string) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return await response.json();
  }
  
  // Get user's top tracks
  export async function getUserTopTracks(accessToken: string) {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }
    
    return await response.json();
  }
  
  // Get user's playlists
  export async function getUserPlaylists(accessToken: string) {
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch playlists');
    }
    
    return await response.json();
  }
  
  // Start/control playback
  export async function startPlayback(accessToken: string, contextUri: string) {
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        context_uri: contextUri
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to start playback');
    }
    
    return await response.json();
  }
  