import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { DirectMessage } from '~/components/starter/chat/direct-message';

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  const dmId = location.params.id;
  const dmData = useSignal<any>(null);
  const loading = useSignal(true);

  useVisibleTask$(async () => {
    const userData = localStorage.getItem('spotify_user_data');
    if (!userData) {
      nav('/login');
      return;
    }

    try {
      // You can fetch DM details here if needed
      // For now, we'll use the dmId directly
      dmData.value = { id: dmId, peerName: 'User' }; // Replace with actual data fetching
      loading.value = false;
    } catch (error) {
      console.error('Error loading DM:', error);
      nav('/dashboard/profile');
    }
  });

  if (loading.value) {
    return (
      <div class="flex items-center justify-center h-full">
        <div class="text-white">Loading chat...</div>
      </div>
    );
  }

  const userData = JSON.parse(localStorage.getItem('spotify_user_data') || '{}');

  return (
    <DirectMessage 
      dmId={dmId}
      userId={userData.id || ''}
      peerName={dmData.value?.peerName || 'User'}
      peerAvatar=""
    />
  );
});
