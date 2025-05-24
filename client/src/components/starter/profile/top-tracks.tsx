import { component$, useSignal, useTask$ } from '@builder.io/qwik';

export interface Track {
  id: string;
  name: string;
  artists: Array<{
    name: string;
  }>;
  album: {
    name: string;
    images: Array<{
      url: string;
    }>;
  };
  duration_ms: number;
  is_saved?: boolean;
}

export interface TopTracksProps {
  accessToken: string;
}

export const TopTracks = component$<TopTracksProps>(({ accessToken }) => {
  const tracks = useSignal<Track[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);
  
  // Format milliseconds to minutes:seconds
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
  };
  
  // Format artists array to comma-separated string
  const formatArtists = (artists: Array<{ name: string }>) => {
    return artists.map(artist => artist.name).join(', ');
  };

  useTask$(async () => {
    try {
      // Fetch user's top tracks
      const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=long_term', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch top tracks');
      }

      const data = await response.json();
      
      // Check which tracks are saved by the user
      const trackIds = data.items.map((track: Track) => track.id);
      const savedResponse = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds.join(',')}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (savedResponse.ok) {
        const savedData = await savedResponse.json();
        
        // Add is_saved property to each track
        data.items.forEach((track: Track, index: number) => {
          track.is_saved = savedData[index];
        });
      }
      
      tracks.value = data.items;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching top tracks:', err);
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="w-full">
      <p class="text-white text-xl pb-4 font-medium">Top Tracks</p>
      
      {isLoading.value && (
        <div class="text-spotifylightgray">Loading your top tracks...</div>
      )}
      
      {error.value && (
        <div class="text-red-500">Error: {error.value}</div>
      )}
      
      {!isLoading.value && !error.value && (
        <div class="space-y-3">
          {tracks.value.map((track, index) => (
            <div key={track.id} class="flex items-center justify-between hover:bg-spotifydarkgray p-2 rounded-md transition">
              <div class="flex items-center">
                {/* Track number */}
                <span class="text-spotifylightgray w-8 text-center">{index + 1}</span>
                
                {/* Album artwork */}
                <img
                  src={track.album.images[0]?.url}
                  alt={track.album.name}
                  class="w-12 h-12 object-cover mr-4 rounded-sm"
                />
                
                {/* Track info */}
                <div class="flex flex-col space-y-2">
                  <div class="text-white font-medium">{track.name}</div>
                  <div class="text-spotifygray font-thin text-xs">{formatArtists(track.artists)}</div>
                </div>
              </div>
              
              <div class="flex items-center">
                {/* Track name (duplicate) */}
                <span class="text-spotifygray font-light text-sm mr-6 hidden md:block">{track.name}</span>
                
                {/* Saved indicator */}
                {track.is_saved && (
                  <div class="mr-4 text-spotifygreen">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                )}
                
                {/* Duration */}
                <span class="text-spotifygray w-12 text-right font-light text-sm">{formatDuration(track.duration_ms)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
