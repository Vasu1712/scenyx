import { component$, Slot, useSignal, useStore, useVisibleTask$, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { Header } from '~/components/starter/header/header';
import { Scenes } from '~/components/starter/scenes/scenes';
import { Chats } from '~/components/starter/chat/chats';
import { Explore } from '~/components/starter/explore/explore';
import { getUserScenes, getSceneById } from '~/integrations/scene/api';
import type { Scene } from '~/utils/types';

interface DMConversation {
  id: string;
  participants: [string, string];
  messages: any[];
}

export const AppLayout = component$(() => {
  const nav = useNavigate();
  const profile = useSignal<any>(null);
  const accessToken = useSignal('');
  const conversations = useStore<DMConversation[]>([]);
  const userScenes = useStore<Scene[]>([]);
  
  useVisibleTask$(async () => {
    const token = localStorage.getItem('spotify_access_token');
    const userData = localStorage.getItem('spotify_user_data');
    
    if (!token || !userData) {
      nav('/login');
      return;
    }

    accessToken.value = token;
    profile.value = JSON.parse(userData);

    try {
      // Fetch user scenes
      const scenes = await getUserScenes(accessToken.value);
      userScenes.splice(0, userScenes.length, ...scenes);

      // Fetch DM conversations
      const dmResponse = await fetch(`http://localhost:8080/api/v1/dms/list?user_id=${profile.value.id}`);
      if (dmResponse.ok) {
        const dmData = await dmResponse.json();
        conversations.splice(0, conversations.length, ...(dmData || []));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

  const handleChatSelect = $((dmId: string, peerName: string, peerUserId: string) => {
    // Navigate to dashboard with chat selected
    nav(`/dashboard?chat=${dmId}`);
  });

  const handleSceneSelect = $((sceneId: string) => {
    // Navigate to dashboard with scene selected
    nav(`/dashboard?scene=${sceneId}`);
  });

  const handleExploreClick = $(() => {
    nav('/explore');
  });

  return (
    // <div class="flex flex-col h-screen bg-mainbg overflow-hidden">
    //   {/* Header */}
    //   <Header />
    //   <div class="flex p-4 gap-4 overflow-hidden">
    //     {/* Sticky Sidebar */}
    //     <div class="w-1/5 bg-spotifyblack p-4 rounded-2xl space-y-4 overflow-y-auto scrollbar-hide">
    //         <Scenes 
    //           userScenes={userScenes}
    //           onSceneSelect$={handleSceneSelect}
    //           selectedSceneId={null}
    //         />
            
    //         <Chats 
    //           currentUserId={profile.value?.id || ''}
    //           conversations={conversations}
    //           onChatSelect$={handleChatSelect}
    //           selectedChatId={null}
    //         />
    //         <Explore />
    //     </div>
        
    //     {/* Main Content Area */}
    //     <div class="flex-1 overflow-y-auto bg-spotifyblack rounded-2xl">
    //       <Slot />
    //     </div>
    //   </div>
    // </div>
  );
});
