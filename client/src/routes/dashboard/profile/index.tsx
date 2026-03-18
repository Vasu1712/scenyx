import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import type { ProfileData } from '~/components/starter/profile/profile';
import { Profile } from '~/components/starter/profile/profile';

export default component$(() => {
  const profile = useSignal<ProfileData | null>(null);
  const accessToken = useSignal('');
  const loading = useSignal(true);
  const nav = useNavigate();

  useVisibleTask$(async () => {
    const token = localStorage.getItem('spotify_access_token');
    const userData = localStorage.getItem('spotify_user_data');
    
    if (!token || !userData) {
      nav('/login');
      return;
    }

    try {
      accessToken.value = token;
      profile.value = JSON.parse(userData);
      loading.value = false;
    } catch (error) {
      console.error('Error loading profile data:', error);
      nav('/login');
    }
  });

  if (loading.value) {
    return (
      <div class="flex items-center justify-center h-full">
        <div class="text-white">Loading profile...</div>
      </div>
    );
  }

  if (!profile.value) {
    return (
      <div class="flex items-center justify-center h-full">
        <div class="text-red-500">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div class="overflow-y-auto">
      <Profile
        profile={profile.value}
        accessToken={accessToken.value}
        sceneCount={0}
        followerCount={18}
        chatCount={0}
        playlistCount={7}
      />
    </div>
  );
});
