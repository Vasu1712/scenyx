import { component$, useSignal } from '@builder.io/qwik';
import { SceneCard } from './scene-card';

export const Scenes = component$(() => {
  const isExpanded = useSignal(true);
  
  // Sample data - replace with API call in production
  const scenes = [
    { id: '1', name: 'Coldplay Scene', artist: 'Coldplay', memberCount: 36, color: 'green' },
    { id: '2', name: 'Geetan Di Machine', artist: 'Karan Aujla', memberCount: 52, color: 'purple' },
    { id: '3', name: 'Dilluminati', artist: 'Diljit Dosanjh', memberCount: 52, color: 'red' },
    { id: '4', name: 'Anuv Jain Scene', artist: 'Anuv Jain', memberCount: 52, color: 'blue' },
  ];
  
  return (
    <div class="w-full">
      <div
        class="flex justify-between items-center mb-4 cursor-pointer"
        onClick$={() => isExpanded.value = !isExpanded.value}
      >
        <p class="text-spotifygray text-xl px-2 font-spotify font-regular">Scenes</p>
        <svg
          class={`text-gray-300 text-3xl transition-transform ${isExpanded.value ? 'rotate-0' : '-rotate-90'}`}
          xmlns="http://www.w3.org/2000/svg"
          width={24} height={24}
          viewBox="-5 -8 24 24">
          <path fill="#BCBCBC" d="m7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364z"></path>
        </svg>
      </div>
      
      {/* Scenes List */}
      {isExpanded.value && (
        <div class="space-y-2">
          {scenes.map(scene => (
            <SceneCard
              key={scene.id}
              id={scene.id}
              name={scene.name}
              artist={scene.artist}
              memberCount={scene.memberCount}
              color={scene.color}
            />
          ))}
          <div class="text-right">
            <span class="text-spotifygreen mb-2 text-xs cursor-pointer hover:underline">see more...</span>
          </div>
        </div>
      )}
    </div>
  );
});
