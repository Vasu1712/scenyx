import { component$, useSignal, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const nav = useNavigate();
  const sceneTitle = useSignal('');
  const artistName = useSignal('');
  const isSubmitting = useSignal(false);

const handleCreateScene = $(async () => {
    if (!sceneTitle.value.trim() || !artistName.value.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    isSubmitting.value = true;

    try {
      const userData = localStorage.getItem('spotify_user_data');
      const accessToken = localStorage.getItem('spotify_access_token');
      
      if (!userData || !accessToken) {
        nav('/login');
        return;
      }

      const user = JSON.parse(userData);

      const sceneData = {
        name: sceneTitle.value.trim(),
        artistName: artistName.value.trim(),
        CreatorID: user.id,
      };
      console.log('Creating scene with data:', sceneData);

      // Make POST request (not GET)
      const response = await fetch('http://localhost:8080/api/v1/scenes/create', {
        method: 'POST', // This is the key fix
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` // If your backend needs auth
        },
        body: JSON.stringify(sceneData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newScene = await response.json();
      console.log('Scene created successfully:', newScene);
      
      // Navigate back to dashboard
      nav('/dashboard/profile');
    } catch (error) {
      console.error('Error creating scene:', error);
      alert('Failed to create scene. Please try again.');
    } finally {
      isSubmitting.value = false;
    }
  });

  return (
    <div class="flex items-around justify-center min-h-full p-8">
      <div class="w-full max-w-2xl">
        <p class="text-white text-5xl font-spotify font-bold mb-12">
          Create a New Scene
        </p>

        <div class="space-y-8">
          {/* Scene Title */}
          <div>
            <label class="block text-spotifylightgray text-xl font-spotify font-medium mb-4">
              Scene Title*
            </label>
            <input
              type="text"
              value={sceneTitle.value}
              onInput$={(e) => sceneTitle.value = (e.target as HTMLInputElement).value}
              placeholder="Enter scene title..."
              class="w-full bg-footergray rounded-lg px-6 py-4 text-spotifygray text-lg font-medium focus: focus:outline-none transition-colors"
            />
          </div>

          {/* Artist Name */}
          <div>
            <label class="block text-spotifylightgray text-xl font-spotify font-medium mb-4">
              Artist Name*
            </label>
            <input
              type="text"
              value={artistName.value}
              onInput$={(e) => artistName.value = (e.target as HTMLInputElement).value}
              placeholder="Enter artist name..."
              class="w-full bg-footergray rounded-lg px-6 py-4 text-spotifygray text-lg font-medium focus: focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Create Button */}
        <div class="flex justify-end mt-12">
          <button
            onClick$={handleCreateScene}
            disabled={isSubmitting.value || !sceneTitle.value.trim() || !artistName.value.trim()}
            class="bg-spotifygreen text-black font-spotify font-bold py-4 px-8 rounded-full cursor-pointer text-lg hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting.value ? 'Creating...' : 'create scene'}
          </button>
        </div>
      </div>
    </div>
  );
});
