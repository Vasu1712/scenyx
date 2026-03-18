import { component$, useSignal, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { SceneCard } from './scene-card';
export interface ScenesProps {
  userScenes: any[];
  onSceneSelect$?: (sceneId: string) => void;
  selectedSceneId?: string | null;
}

export const Scenes = component$<ScenesProps>(({ 
  userScenes, 
  onSceneSelect$, 
  selectedSceneId 
}) => {
  const isExpanded = useSignal(true);
  const nav = useNavigate();

  const handleSceneClick = $((sceneId: string) => {
    // eslint-disable-next-line qwik/valid-lexical-scope
    onSceneSelect$?.(sceneId);
  });

  const handleCreateScene = $(() => {
    nav('/dashboard/scene/create');
  });
  
  return (
    <div class="w-full">
      {/* Scenes Header with Dropdown */}
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
          {userScenes.length === 0 ? (
            // No scenes - show create scene button
            <div class="px-2 py-4 flex flex-col justify-center items-center">
              <p class="text-spotifydarkgray text-xs text-center mt-2 font-light italic">
                no chats yet, go ahead and create one!
              </p>
              <button
                onClick$={handleCreateScene}
                class="w-2/3 bg-spotifygreen text-black py-2 px-4 mt-8 rounded-full cursor-pointer font-spotify font-medium hover:bg-opacity-90 transition-colors"
              >
                start new scene
              </button>
            </div>
          ) : (
            // Scenes exist - render scene list
            <>
              {userScenes.map((scene: any, index: number) => {
                // Handle different backend field naming conventions
                const sceneId = scene.id || scene.ID || `scene-${index}`;
                const sceneName = scene.name || scene.scene_name || 'Untitled Scene';
                const sceneArtist = scene.artist || scene.artistName || scene.artist_name || 'Unknown Artist';
                const sceneMemberCount = scene.listeners || 1;
                const sceneColor = scene.color || scene.Color || ['green', 'purple', 'red', 'blue'][index % 4];
                
                console.log('Rendering scene:', { sceneId, sceneName, sceneArtist, sceneMemberCount }); // Debug log
                
                return (
                  <SceneCard
                    key={sceneId}
                    id={sceneId}
                    name={sceneName}
                    artist={sceneArtist}
                    memberCount={sceneMemberCount}
                    color={sceneColor}
                    isActive={scene.isActive !== false}
                    isSelected={selectedSceneId === sceneId}
                    onClick$={handleSceneClick}
                  />
                );
              })}
              
              {/* Add new scene button */}
              <button
                onClick$={handleCreateScene}
                class="w-full mt-2 text-spotifygreen text-sm py-2 hover:bg-zinc-900 rounded-md transition-colors"
              >
                + Create New Scene
              </button>
            </>
          )}
          {/* See more link */}
          <div class="text-right">
            <span class="text-spotifygreen text-sm cursor-pointer hover:underline">see more...</span>
          </div>
        </div>
      )}
    </div>
  );
});
