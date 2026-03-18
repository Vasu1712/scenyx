import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { routeLoader$, useLocation } from '@builder.io/qwik-city';
import { NowPlaying } from '../../../components/starter/scenes/now-playing';
import { SceneChat } from '../../../components/starter/scenes/scene-chat';
import { VotingSystem } from '../../../components/starter/scenes/voting';
import { initializeSceneSocket } from '../../../utils/scene-socket';

export const useSceneData = routeLoader$(async ({ params }) => {
  const sceneId = params.id;
  
  // Mock data - replace with actual API calls
  return {
    id: sceneId,
    name: 'Geetan Di Machine',
    artist: 'Karan Aujla',
    listeners: 91998935,
    activeUsers: 935,
    currentTrack: {
      id: 'track_wavy_123',
      name: 'Wavy',
      artist: 'Karan Aujla',
      album: 'It Was All A Dream',
      imageUrl: '/images/wavy-album.jpg',
      duration: 181000, // 3:01 in milliseconds
      position: 65000,  // Current position
      isPlaying: true
    }
  };
});

export default component$(() => {
  const sceneData = useSceneData();
  const location = useLocation();
  const socket = useSignal<any>(null);
  const currentUser = useSignal<any>(null);

  // Initialize real-time connection and user data
  useVisibleTask$(async () => {
    // Get user data from localStorage
    const userData = localStorage.getItem('spotify_user_data');
    const accessToken = localStorage.getItem('spotify_access_token');
    
    if (userData && accessToken) {
      currentUser.value = JSON.parse(userData);
      
      // Initialize socket connection for real-time features
      socket.value = initializeSceneSocket(location.params.id, currentUser.value, accessToken);
    }
  });

  return (
    <div class="flex h-screen bg-mainbg overflow-hidden">
      {/* Main Content */}
      <div class="flex-1 flex flex-col">
        {/* Scene Header */}
        <div class="bg-spotifydarkgray p-6 border-b border-spotifygray">
          <div class="flex items-center">
            <div class="w-16 h-16 bg-spotifygreen rounded-lg flex items-center justify-center mr-4">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5,0.67C13.5,0.67 12.5,0.33 11,0.5C9,0.67 9,1 9,1C8.29,1.42 8,2.67 8,2.67C8,2.67 7.29,0.42 6,0.67C5.33,0.67 4.67,1.33 4.67,1.33C4.67,1.33 4,2 4,4C4,6 6,8 6,8C6,8 8,10 9,12C9,12 10,10 12,8C14,6 14,4 14,4C14,4 14,2 13.5,0.67M20,14C20,14 20,16 18,18C16,20 13,21 13,21C13,21 12.33,16.67 14.67,14.33C17,12 20,14 20,14M15.5,14.5C15.5,14.5 14,15 12.5,16.5C11,18 10,20 10,20C10,20 10.5,17.67 12,16.17C13.5,14.67 15.5,14.5 15.5,14.5Z" />
              </svg>
            </div>
            <div>
              <h1 class="text-white text-4xl font-spotify font-bold">{sceneData.value.name}</h1>
              <div class="flex items-center text-spotifylightgray">
                <span>{sceneData.value.listeners.toLocaleString()} listeners</span>
                <span class="mx-2">•</span>
                <span class="text-spotifygreen">{sceneData.value.activeUsers} active</span>
              </div>
            </div>
            <div class="ml-auto">
              <div class="w-12 h-12 bg-spotifygreen rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Now Playing Section */}
        <NowPlaying 
          track={sceneData.value.currentTrack} 
          socket={socket.value}
        />

        {/* Voting System */}
        <VotingSystem 
          currentTrack={sceneData.value.currentTrack}
          socket={socket.value}
        />
      </div>

      {/* Chat Sidebar */}
      <div class="w-80 bg-spotifyblack border-l border-spotifygray">
        <SceneChat 
          sceneId={sceneData.value.id}
          currentTrack={sceneData.value.currentTrack}
          currentUser={currentUser.value}
          socket={socket.value}
        />
      </div>

      {/* Vote Button */}
      <div class="fixed bottom-8 right-8">
        <button class="bg-spotifygreen text-black w-20 h-20 rounded-full font-spotify font-bold text-xl shadow-lg hover:scale-105 transition-transform">
          VOTE
        </button>
      </div>
    </div>
  );
});
