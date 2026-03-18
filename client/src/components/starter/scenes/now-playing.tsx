import { component$, useSignal, useStore, useVisibleTask$, $, noSerialize, type NoSerialize } from '@builder.io/qwik';
import { io, type Socket } from 'socket.io-client';

interface SpotifyNowPlayingProps {
  accessToken: string;
  sceneId: string;
  sceneName?: string;
}

interface PlaybackState {
  trackId: string | null;
  trackName: string;
  artistName: string;
  albumName: string;
  imageUrl: string;
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
  deviceId: string;
}

interface TrackUpdateData {
  sceneId: string;
  trackId: string;
  progressMs: number;
  durationMs: number;
  playbackStatus: string;
}

export const SpotifyNowPlaying = component$<SpotifyNowPlayingProps>(({
  accessToken,
  sceneId,
  sceneName
}) => {
  const player = useSignal<NoSerialize<any>>(null);
  const socket = useSignal<NoSerialize<Socket>>(null);
  const isReady = useSignal(false);
  const error = useSignal('');
  const isSyncing = useSignal(false);
  
  const playbackState = useStore<PlaybackState>({
    trackId: null,
    trackName: '',
    artistName: '',
    albumName: '',
    imageUrl: '',
    progressMs: 0,
    durationMs: 0,
    isPlaying: false,
    deviceId: ''
  });

  // Update backend with current playback state
  const updateBackendPlayback = $(async (data: TrackUpdateData) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/scenes/update-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend playback updated successfully:', result);
    } catch (err) {
      console.error('Error updating backend playback:', err);
    }
  });

  // Sync local playback with backend state
  const syncPlaybackFromBackend = $(async (backendState: any) => {
    if (!player.value || isSyncing.value) return;

    isSyncing.value = true;

    try {
      const timeDrift = Math.abs(playbackState.progressMs - backendState.progressMs);
      const trackChanged = playbackState.trackId !== backendState.trackId;

      if (trackChanged && backendState.trackId) {
        console.log('Syncing new track:', backendState.trackId);
        await player.value._options.getOAuthToken((token: string) => {
          fetch(`https://api.spotify.com/v1/me/player/play?device_id=${playbackState.deviceId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              uris: [backendState.trackId],
              position_ms: backendState.progressMs
            })
          });
        });
      } else if (timeDrift > 3000) {
        console.log('Syncing playback position:', backendState.progressMs);
        player.value.seek(backendState.progressMs);
      }

      if (playbackState.isPlaying !== (backendState.playbackStatus === 'playing')) {
        if (backendState.playbackStatus === 'playing') {
          player.value.resume();
        } else {
          player.value.pause();
        }
      }
    } catch (err) {
      console.error('Error syncing playback:', err);
    } finally {
      isSyncing.value = false;
    }
  });

  // Initialize WebSocket connection
  const initializeWebSocket = $(() => {
    if (socket.value) return;

    const socketInstance = noSerialize(io('ws://localhost:8080', {
      transports: ['websocket'],
      timeout: 10000
    }));

    socket.value = socketInstance;

    socketInstance?.on('connect', () => {
      console.log('Connected to WebSocket server');
      socketInstance.emit('join-scene', { sceneId, userId: 'current-user-id' });
    });

    socketInstance?.on('playback-sync', async (data: any) => {
      console.log('Received playback sync:', data);
      if (data.sceneId === sceneId) {
        await syncPlaybackFromBackend(data);
      }
    });

    socketInstance?.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socketInstance?.on('connect_error', (err: any) => {
      console.error('WebSocket connection error:', err);
    });
  });

  // Broadcast local playback changes to other users
  const broadcastPlaybackUpdate = $(async () => {
    if (!playbackState.trackId || isSyncing.value) return;

    const updateData: TrackUpdateData = {
      sceneId,
      trackId: playbackState.trackId,
      progressMs: playbackState.progressMs,
      durationMs: playbackState.durationMs,
      playbackStatus: playbackState.isPlaying ? 'playing' : 'paused'
    };

    await updateBackendPlayback(updateData);

    if (socket.value) {
      socket.value.emit('playback-update', updateData);
    }
  });

  // Initialize Spotify Web Playback SDK
  useVisibleTask$(async ({ cleanup }) => {
    try {
      if (!window.Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.head.appendChild(script);

        await new Promise<void>((resolve) => {
          window.onSpotifyWebPlaybackSDKReady = resolve;
        });
      }

      const spotifyPlayer = noSerialize(new window.Spotify.Player({
        name: `Scenyx - ${sceneName || sceneId}`,
        getOAuthToken: (cb: any) => {
          console.log('Providing token to Spotify SDK');
          cb(accessToken);
        },
        volume: 0.8
      }));

      player.value = spotifyPlayer;

      spotifyPlayer?.addListener('ready', ({ device_id }: any) => {
        console.log('Spotify Player ready with Device ID:', device_id);
        playbackState.deviceId = device_id;
        isReady.value = true;
        error.value = '';
        initializeWebSocket();
      });

      spotifyPlayer?.addListener('not_ready', ({ device_id }: any) => {
        console.log('Spotify Player offline:', device_id);
        isReady.value = false;
      });

      spotifyPlayer?.addListener('player_state_changed', async (state: any) => {
        if (!state || isSyncing.value) return;

        const track = state.track_window.current_track;
        
        playbackState.trackId = track ? track.uri : null;
        playbackState.trackName = track ? track.name : '';
        playbackState.artistName = track ? track.artists.map((a: any) => a.name).join(', ') : '';
        playbackState.albumName = track ? track.album.name : '';
        playbackState.imageUrl = track?.album.images?.[0]?.url || '';
        playbackState.progressMs = state.position;
        playbackState.durationMs = state.duration;
        playbackState.isPlaying = !state.paused;

        await broadcastPlaybackUpdate();
      });

      spotifyPlayer?.addListener('initialization_error', ({ message }: any) => {
        console.error('Spotify Player initialization error:', message);
        error.value = `Initialization error: ${message}`;
      });

      spotifyPlayer?.addListener('authentication_error', ({ message }: any) => {
        console.error('Spotify Player authentication error:', message);
        error.value = `Authentication error: ${message}`;
      });

      spotifyPlayer?.addListener('account_error', ({ message }: any) => {
        console.error('Spotify Player account error:', message);
        error.value = `Account error: ${message}`;
      });

      const success = await spotifyPlayer?.connect();
      if (!success) {
        error.value = 'Failed to connect to Spotify';
      }

      const positionUpdateInterval = setInterval(() => {
        if (playbackState.isPlaying && playbackState.progressMs < playbackState.durationMs) {
          playbackState.progressMs += 1000;
        }
      }, 1000);

      cleanup(() => {
        clearInterval(positionUpdateInterval);
        socket.value?.disconnect();
        spotifyPlayer?.disconnect();
      });

    } catch (err) {
      console.error('Error initializing Spotify Player:', err);
      error.value = 'Failed to initialize Spotify Player';
    }
  });

  // Control functions
  const togglePlay = $(async () => {
    if (!player.value) return;
    
    player.value.togglePlay();
    await broadcastPlaybackUpdate();
  });

  const nextTrack = $(async () => {
    if (!player.value) return;
    
    player.value.nextTrack();
    await broadcastPlaybackUpdate();
  });

  const previousTrack = $(async () => {
    if (!player.value) return;
    
    player.value.previousTrack();
    await broadcastPlaybackUpdate();
  });

  const seekTo = $(async (positionMs: number) => {
    if (!player.value) return;
    
    player.value.seek(positionMs);
    playbackState.progressMs = positionMs;
    await broadcastPlaybackUpdate();
  });

  // Format time helper
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = playbackState.durationMs ? (playbackState.progressMs / playbackState.durationMs) * 100 : 0;

  // Error state
  if (error.value) {
    return (
      <div class="bg-zinc-900 p-6 border-b border-zinc-800">
        <div class="text-red-500 text-center">
          <h3 class="text-lg font-bold mb-2">Spotify Player Error</h3>
          <p class="mb-4">{error.value}</p>
          <div class="text-sm text-gray-400">
            <p>Make sure you have:</p>
            <ul class="list-disc list-inside mt-2">
              <li>Spotify Premium subscription</li>
              <li>Correct access token with Web Playback scopes</li>
              <li>Added Web Playback SDK to your Spotify app dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isReady.value) {
    return (
      <div class="bg-zinc-900 p-6 border-b border-zinc-800">
        <div class="text-white text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-spotifygreen mx-auto mb-4"></div>
          <p>Connecting to Spotify...</p>
          <p class="text-sm text-gray-400 mt-2">Device: "Scenyx - {sceneName || sceneId}"</p>
        </div>
      </div>
    );
  }

  // No track playing
  if (!playbackState.trackId) {
    return (
      <div class="bg-zinc-900 p-6 border-b border-zinc-800">
        <div class="text-white text-center">
          <h3 class="text-lg font-bold mb-2">Ready to Play</h3>
          <p class="mb-2">No track currently playing</p>
          <p class="text-sm text-gray-400">
            Transfer playback to "Scenyx - {sceneName || sceneId}" from any Spotify app
          </p>
        </div>
      </div>
    );
  }

  return (
    <div class="bg-zinc-900 p-6 border-b border-zinc-800">
      <div class="flex items-center text-spotifygreen mb-6">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
        <span class="font-medium text-lg">Now Playing</span>
        <span class="ml-2 text-xs bg-spotifygreen text-black px-2 py-1 rounded">LIVE</span>
      </div>

      <div class="flex items-center justify-between">
        {/* Album Art and Track Info */}
        <div class="flex items-center">
          <div class="w-24 h-24 rounded-lg mr-6 overflow-hidden">
            {playbackState.imageUrl ? (
              <img 
                src={playbackState.imageUrl} 
                alt={playbackState.albumName}
                class="w-full h-full object-cover"
              />
            ) : (
              <div class="w-full h-full bg-gradient-to-br from-yellow-600 to-red-600 flex items-center justify-center">
                <span class="text-white text-2xl font-bold">
                  {playbackState.trackName.charAt(0) || 'M'}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 class="text-white text-3xl font-bold mb-1">{playbackState.trackName}</h3>
            <p class="text-gray-400 text-xl mb-4">{playbackState.artistName}</p>
            <button class="border border-spotifygreen text-spotifygreen px-6 py-2 rounded-full text-sm hover:bg-spotifygreen hover:text-black transition-colors flex items-center">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Save on Spotify
            </button>
          </div>
        </div>

        {/* Progress and Controls */}
        <div class="flex flex-col items-end">
          <div class="text-white text-3xl font-bold mb-2">
            {formatTime(playbackState.progressMs)}
          </div>
          <div 
            class="w-64 h-2 bg-zinc-700 rounded-full overflow-hidden mb-2 cursor-pointer"
            onClick$={(e) => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              const newPosition = percentage * playbackState.durationMs;
              seekTo(newPosition);
            }}
          >
            <div 
              class="h-full bg-spotifygreen transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div class="text-gray-400 text-sm">
            {formatTime(playbackState.durationMs)}
          </div>
        </div>

        {/* Playback Controls */}
        <div class="flex items-center space-x-4">
          <button 
            onClick$={previousTrack}
            class="text-white hover:text-spotifygreen transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          
          <button 
            onClick$={togglePlay}
            class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {playbackState.isPlaying ? (
              <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg class="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
          
          <button 
            onClick$={nextTrack}
            class="text-white hover:text-spotifygreen transition-colors"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        {/* Spotify Logo */}
        <div class="ml-8">
          <svg class="w-16 h-16 text-spotifygreen" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.964-.335.077-.67-.133-.746-.47-.077-.334.132-.67.47-.746 3.808-.871 7.076-.496 9.713 1.115.293.18.386.563.206.857zm1.223-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.849-.106-.973-.517-.125-.413.106-.849.517-.973 3.632-1.102 8.147-.568 11.234 1.328.366.226.481.707.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.490.149-1.006-.126-1.156-.614-.149-.49.126-1.007.615-1.156 3.583-1.091 9.499-.866 13.115 1.338.445.27.590.847.32 1.292-.27.446-.848.590-1.293.32z"/>
          </svg>
        </div>
      </div>

      {/* Chat Replies */}
      <div class="flex items-center justify-between mt-6">
        <div class="flex items-center">
          <div class="flex -space-x-2 mr-4">
            <div class="w-8 h-8 rounded-full bg-yellow-500 border-2 border-black"></div>
            <div class="w-8 h-8 rounded-full bg-orange-500 border-2 border-black"></div>
            <div class="w-8 h-8 rounded-full bg-green-500 border-2 border-black"></div>
          </div>
          <span class="text-white text-lg">6 replies</span>
        </div>
        <button class="text-spotifygreen text-lg hover:underline">
          open chat thread
        </button>
      </div>
    </div>
  );
});
