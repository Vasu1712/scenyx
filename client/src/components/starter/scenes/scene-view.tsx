import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { SceneHeader } from './scene-header';
import { SpotifyNowPlaying } from './now-playing';
import { Voting } from './voting';
import { SceneChat } from './scene-chat';

interface SceneViewProps {
  scene: any;
  accessToken: string;
  onBack$?: () => void;
}

interface SceneData {
  sceneName: string;
  sceneArtist: string;
  sceneListeners: number;
  sceneActiveUsers: number;
}

export const SceneView = component$<SceneViewProps>(({ scene, accessToken, onBack$ }) => {
  const currentUser = useSignal<any>(null);
  const isChatOpen = useSignal(false);
  const displayOpenChatbutton = useSignal(true);
  const userVote = useSignal<string | null>(null);
  const sceneData = useSignal<SceneData | null>(null);
  const loading = useSignal(false);
  const error = useSignal('');

    const fetchSceneData = $(async (sceneId: string) => {
    try {
      loading.value = true;
      error.value = '';

      const response = await fetch('http://localhost:8080/api/v1/scenes/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          sceneID: sceneId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SceneData = await response.json();
      sceneData.value = data;
      console.log('Scene data fetched:', data);
      
    } catch (err) {
      console.error('Error fetching scene data:', err);
      error.value = 'Failed to load scene data';
      
      // Fallback to hardcoded data if API fails
      sceneData.value = {
        sceneName: 'Error',
        sceneArtist: 'Karan Aujla',
        sceneListeners: 9195,
        sceneActiveUsers: 35
      };
    } finally {
      loading.value = false;
    }
  });

  useVisibleTask$(async () => {
    // Get user data from localStorage
    const userData = localStorage.getItem('spotify_user_data');
    if (userData) {
      currentUser.value = JSON.parse(userData);
    }

    // Fetch scene data using the scene ID
    const sceneId = scene?.id || scene?.ID;
    if (sceneId) {
      await fetchSceneData(sceneId);
    } else {
      error.value = 'No scene ID provided';
      loading.value = false;
    }
  });

  // Handle chat toggle
  const handleChatToggle = $(() => {
    isChatOpen.value = !isChatOpen.value;
    displayOpenChatbutton.value = !displayOpenChatbutton.value; // Hide button when chat is open
  });

  // Handle voting
  const handleVote = $((trackId: string) => {
    userVote.value = trackId;
    console.log('Voted for track:', trackId);
  });

  // Scene data
const sceneName = scene?.name || scene?.Name || 'Unknown Scene';
const sceneArtist = scene?.artist || scene?.ArtistName || scene?.artistName || 'Unknown Artist';
const sceneListeners = typeof scene?.listeners === 'number' ? scene.listeners : 0;
const sceneActiveUsers = typeof scene?.activeUsers === 'number' ? scene.activeUsers : 0;



  // Current track data
  const currentTrack = {
    id: 'track_wavy',
    name: 'Wavy',
    artist: 'Karan Aujla',
    album: 'It Was All A Dream',
    imageUrl: '/images/wavy-album.jpg',
    duration: 181000,
    position: 161000,
    isPlaying: true
  };

  // Voting tracks
  const votingTracks = [
    {
      id: 'winning-speech',
      name: 'Winning Speech',
      artist: 'Karan Aujla, Shavez',
      imageUrl: '/images/winning-speech.jpg',
      votes: 15
    },
    {
      id: 'white-brown-black',
      name: 'White Brown Black',
      artist: 'Karan Aujla, Avvy Sra',
      imageUrl: '/images/white-brown-black.jpg',
      votes: 8
    },
    {
      id: '52-bars',
      name: '52 Bars',
      artist: 'Karan Aujla, BAY',
      imageUrl: '/images/52-bars.jpg',
      votes: 12
    },
    {
      id: 'idk-how',
      name: 'IDK How?',
      artist: 'Karan Aujla',
      imageUrl: '/images/idk-how.jpg',
      votes: 5
    }
  ];

  return (
    <div class="flex h-full bg-black overflow-hidden">

      <div class={`flex flex-col transition-all duration-300 ${isChatOpen.value ? 'w-2/3' : 'w-full'}`}>

        <SceneHeader
          sceneName={sceneName}
          sceneArtist={sceneArtist}
          listeners={sceneListeners}
          activeUsers={sceneActiveUsers}
          // eslint-disable-next-line qwik/valid-lexical-scope
          onBack$={onBack$}
          onChatToggle$={handleChatToggle}
          isChatOpen={isChatOpen.value}
        />

        <div class="flex-1 flex flex-col bg-spotifyblack p-4">
          <div class="flex-1 p-6 flex flex-col bg-scenebg rounded-2xl">
            <SpotifyNowPlaying
                accessToken={accessToken}
                sceneId={scene.id}
                sceneName={scene.scene_name}
              />
            
            {displayOpenChatbutton.value && (
              <button
              onClick$={handleChatToggle}
              class="mt-2 w-1/10 self-end bg-spotifygreen text-black px-4 py-2 rounded-full font-spotify font-medium cursor-pointer hover:bg-opacity-90 transition-colors"
            >
              Open Chat
            </button>
          )}

            <Voting
              votingTracks={votingTracks}
              userVote={userVote.value}
              onVote$={handleVote}
            />
          </div>
        </div>
      </div>

      {isChatOpen.value && (
        <div class="w-1/3 bg-black border-l border-zinc-800 transition-all duration-300">
          <SceneChat
            sceneId={scene.id}
            currentTrack={currentTrack}
            currentUser={currentUser.value}
            socket={null}
            onClose$={handleChatToggle}
          />
        </div>
      )}
    </div>
  );
});
