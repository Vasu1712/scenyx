import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { Header } from '~/components/starter/header/header';
import { Scenes } from '~/components/starter/scenes/scenes';
import { Chats } from '~/components/starter/chat/chats';
import { Explore } from '~/components/starter/explore/explore';
import type { ProfileData } from '~/components/starter/profile/profile';
import { Profile } from '~/components/starter/profile/profile';

export default component$(() => {
  const profile = useSignal<ProfileData | null>(null);
  const accessToken = useSignal<string>('');
  const loading = useSignal(true);
  const nav = useNavigate();
  
  useVisibleTask$(async () => {
    const token = localStorage.getItem('spotify_access_token');
    
    if (!token) {
      nav('/login');
      return;
    }
    accessToken.value = token;
    
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching profile: ${response.status}`);
      }
      
      const data = await response.json();
      profile.value = data;
      loading.value = false;
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If there's an authentication error, redirect to login
      if (error instanceof Error && error.message.includes('401')) {
        nav('/login');
      }
      loading.value = false;
    }
  });

  if (loading.value) {
    return (
      <div class="flex items-center justify-center h-screen bg-mainbg">
        <div class="text-spotifywhite">Loading profile...</div>
      </div>
    );
  }
  
  return (
    <div class="flex flex-col h-screen bg-mainbg overflow-hidden">
      {/* Header */}
      <Header />
        {/* Left sidebar */}
        <div class="flex p-4 gap-4 overflow-hidden">
          <div class="w-1/5 bg-spotifyblack p-4 rounded-2xl space-y-4 overflow-y-auto scrollbar-hide">
            <Scenes />
            <Chats />
            <Explore />
          </div>
          
          {/* Main content */}
          <div class="flex-1 overflow-y-auto bg-spotifyblack rounded-2xl">
            {loading.value ? (
              <div class="flex items-center justify-center h-full">
                <span class="text-white">Loading profile...</span>
              </div>
            ) : (
              profile.value && (
                <Profile
                  profile={profile.value}
                  accessToken={accessToken.value}
                  sceneCount={9}
                  followerCount={18}
                  chatCount={20}
                  playlistCount={7}
                />
              )
            )}
          </div>
        </div>
    </div>
  );
});
