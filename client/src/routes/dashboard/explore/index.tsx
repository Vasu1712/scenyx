import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

interface User {
  id: string;
  name: string;
  playlists: number;
  following: number;
  avatar?: string;
}

export default component$(() => {
  const nav = useNavigate();
  const users = useSignal<User[]>([]);
  const loading = useSignal(true);

  useVisibleTask$(async () => {
    // Mock data - replace with real API call
    const mockUsers: User[] = [
      { id: 'user1', name: 'Vasu', playlists: 7, following: 18 },
      { id: 'user2', name: 'Vasu', playlists: 7, following: 18 },
      { id: 'user3', name: 'Vasu', playlists: 7, following: 18 },
      { id: 'user4', name: 'Vasu', playlists: 7, following: 18 },
      { id: 'user5', name: 'Vasu', playlists: 7, following: 18 },
      { id: 'user6', name: 'Vasu', playlists: 7, following: 18 },
    ];
    
    setTimeout(() => {
      users.value = mockUsers;
      loading.value = false;
    }, 500);
  });

  const handleChatClick = $(async (userId: string, userName: string) => {
    try {
      const userData = localStorage.getItem('spotify_user_data');
      if (!userData) {
        nav('/login');
        return;
      }

      const currentUser = JSON.parse(userData);
      
      const response = await fetch('http://localhost:8080/api/v1/dms/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user1: currentUser.id, 
          user2: userId 
        }),
      });

      if (response.ok) {
        const newDM = await response.json();
        // Navigate to dashboard with the new chat
        nav(`/dashboard?chat=${newDM.id}`);
      }
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  });

  return (
    <div class="overflow-y-auto p-8">
      <div class="max-w-6xl mx-auto">
        {/* Header */}
        <div class="flex items-center mb-8">
          <div class="w-20 h-20 bg-spotifygreen rounded-2xl flex items-center justify-center mr-6">
            <svg class="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-white text-5xl font-spotify font-bold mb-2">Explore</h1>
            <p class="text-spotifylightgray text-xl">
              Find and vibe with listeners that have similar taste just like yours
            </p>
          </div>
        </div>

        {/* More like you section */}
        <div>
          <h2 class="text-white text-3xl font-spotify font-bold mb-8">More like you</h2>
          
          {loading.value ? (
            <div class="flex items-center justify-center py-20">
              <div class="text-spotifylightgray text-xl">Loading users...</div>
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.value.map((user) => (
                <div key={user.id} class="bg-spotifygreen rounded-2xl p-6 relative">
                  {/* Follow and Chat buttons */}
                  <div class="absolute top-4 right-4 flex gap-2">
                    <button class="bg-black bg-opacity-20 text-black px-4 py-2 rounded-full text-sm font-spotify font-medium hover:bg-opacity-30 transition-colors">
                      Follow
                    </button>
                    <button 
                      onClick$={() => handleChatClick(user.id, user.name)}
                      class="bg-black bg-opacity-20 text-black px-4 py-2 rounded-full text-sm font-spotify font-medium hover:bg-opacity-30 transition-colors"
                    >
                      Chat
                    </button>
                  </div>

                  {/* Profile section */}
                  <div class="flex items-center mt-8">
                    <div class="w-24 h-24 rounded-full bg-black bg-opacity-20 flex items-center justify-center mr-6">
                      <svg class="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div>
                      <div class="flex items-center mb-3">
                        <span class="text-black text-xs bg-black bg-opacity-20 px-3 py-1 rounded-full font-spotify font-medium">
                          Profile
                        </span>
                      </div>
                      <h3 class="text-black text-4xl font-spotify font-bold mb-2">{user.name}</h3>
                      <p class="text-black text-base opacity-75 font-spotify">
                        {user.playlists} Public Playlists • {user.following} Following
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
