// src/routes/dashboard/layout.tsx
import { component$, Slot, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { useNavigate, useLocation } from '@builder.io/qwik-city';
import { Header } from '~/components/starter/header/header';
import { Scenes } from '~/components/starter/scenes/scenes';
import { Chats } from '~/components/starter/chat/chats';
import { Explore } from '~/components/starter/explore/explore';

export default component$(() => {
  const nav = useNavigate();
  const location = useLocation();
  const profile = useSignal<any>(null);
  const accessToken = useSignal('');
  const conversations = useStore<any[]>([]);
  const userScenes = useStore<any[]>([]);

  // Function to fetch scenes from backend API
  const fetchScenesFromBackend = $(async () => {
    if (!profile.value?.id) {
      console.log('No user ID available for fetching scenes');
      return;
    }
    
    try {
      console.log(`Fetching scenes for user: ${profile.value.id}`);
      const response = await fetch(`http://localhost:8080/api/v1/scenes/list?user_id=${profile.value.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const scenes = await response.json();
        console.log('Scenes fetched from backend:', scenes);
        userScenes.splice(0, userScenes.length, ...(scenes || []));
      } else {
        console.error('Failed to fetch scenes:', response.status, response.statusText);
        userScenes.splice(0, userScenes.length);
      }
    } catch (error) {
      console.error('Error fetching scenes from backend:', error);
      userScenes.splice(0, userScenes.length);
    }
  });

  useVisibleTask$(async ({ track }) => {
    track(() => location.url.pathname);
    
    const token = localStorage.getItem('spotify_access_token');
    const userData = localStorage.getItem('spotify_user_data');
    
    if (!token || !userData) {
      nav('/login');
      return;
    }

    accessToken.value = token;
    profile.value = JSON.parse(userData);

    // Fetch data when on dashboard routes or coming from create-scene
    if (location.url.pathname.includes('/dashboard/')) {
      await fetchScenesFromBackend();
      
      // Fetch DM conversations
      try {
        const dmResponse = await fetch(`http://localhost:8080/api/v1/dms/list?user_id=${profile.value.id}`);
        if (dmResponse.ok) {
          const dmData = await dmResponse.json();
          conversations.splice(0, conversations.length, ...(dmData || []));
        }
      } catch (error) {
        console.error('Error fetching DM conversations:', error);
      }
    }
  });

  // FIXED: Update handlers to use proper dynamic routes
  const handleChatSelect = $((dmId: string, peerName: string, peerUserId: string) => {
    nav(`/dashboard/dms/${dmId}`); // Navigate to dynamic DM route
  });

  const handleSceneSelect = $((sceneId: string) => {
    nav(`/dashboard/scene/${sceneId}`); // Navigate to dynamic scene route
  });

  const handleExploreClick = $(() => {
    nav('/dashboard/explore');
  });

  // Get current route info for highlighting
  const getCurrentRoute = () => {
    const path = location.url.pathname;
    if (path.startsWith('/dashboard/scene/')) {
      return { type: 'scene', id: path.split('/').pop() };
    }
    if (path.startsWith('/dashboard/dms/')) {
      return { type: 'dm', id: path.split('/').pop() };
    }
    return { type: 'profile', id: null };
  };

  const currentRoute = getCurrentRoute();

  return (
    <div class="flex flex-col h-screen bg-mainbg overflow-hidden">
      {/* Header */}
      <Header />
      <div class="flex p-4 gap-4 overflow-hidden h-full">
        {/* Sticky Sidebar */}
        <div class="w-1/5 bg-spotifyblack p-4 rounded-2xl space-y-4 overflow-y-auto scrollbar-hide">
            <Scenes 
              userScenes={userScenes}
              onSceneSelect$={handleSceneSelect}
              selectedSceneId={currentRoute.type === 'scene' ? currentRoute.id : null}
            />
            
            <Chats 
              currentUserId={profile.value?.id || ''}
              conversations={conversations}
              onChatSelect$={handleChatSelect}
              selectedChatId={null}
            />
            <Explore />
        </div>
        
        {/* Main Content Area */}
        <div class="flex-1 overflow-y-auto bg-spotifyblack rounded-2xl">
          <Slot />
        </div>
      </div>
    </div>
  );
});
