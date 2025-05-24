import { component$, useSignal, useTask$ } from '@builder.io/qwik';

export interface Artist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

export interface TopArtistsProps {
  accessToken: string;
}

export const TopArtists = component$<TopArtistsProps>(({ accessToken }) => {
  const artists = useSignal<Artist[]>([]);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);

  useTask$(async () => {
    try {
      // Fetch user's top artists
      const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=6&time_range=long_term', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch top artists');
      }

      const data = await response.json();
      artists.value = data.items;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching top artists:', err);
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <div class="w-full mt-8">
      <p class="text-white text-xl pb-4 font-medium">Top Artists</p>
      
      {isLoading.value && (
        <div class="text-spotifylightgray">Loading your top artists...</div>
      )}
      
      {error.value && (
        <div class="text-red-500">Error: {error.value}</div>
      )}
      
      {!isLoading.value && !error.value && (
        <div class="flex space-x-8 overflow-x-auto scrollbar-hide pb-4">
          {artists.value.map((artist) => (
            <div key={artist.id} class="flex-shrink-0 text-center cursor-pointer group">
              <div class="w-48 h-48 mb-4 shadow-lg">
                <img 
                  src={artist.images[0]?.url || '/placeholder-artist.jpg'}
                  alt={artist.name}
                  class="w-full h-full object-cover hover:scale-100 transition-transform duration-200 rounded-full shadow-lg"
                />
              </div>
              <div class="max-w-32">
                <p class="text-white font-medium text-base place-self-start mb-1 truncate">
                  {artist.name}
                </p>
                <p class="text-spotifygray place-self-start font-thin text-sm">Artist</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});


