import { component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

export interface SceneProps {
  id: string;
  name: string;
  artist: string;
  memberCount: number;
  color: string;
  isActive?: boolean;
  isSelected?: boolean;
  onClick$?: PropFunction<(sceneId: string) => void>;
}

const colorClasses = {
  green: "border-green-500 bg-green-600",
  purple: "border-purple-500 bg-purple-600",
  red: "border-red-500 bg-red-800",
  blue: "border-blue-500 bg-blue-600",
};

const IconComponents = {
  green: () => (
    <svg class="w-6 h-6 text-green-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5,0.67C13.5,0.67 12.5,0.33 11,0.5C9,0.67 9,1 9,1C8.29,1.42 8,2.67 8,2.67C8,2.67 7.29,0.42 6,0.67C5.33,0.67 4.67,1.33 4.67,1.33C4.67,1.33 4,2 4,4C4,6 6,8 6,8C6,8 8,10 9,12C9,12 10,10 12,8C14,6 14,4 14,4C14,4 14,2 13.5,0.67Z" />
    </svg>
  ),
  purple: () => (
    <svg class="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z" />
    </svg>
  ),
  red: () => (
    <svg class="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
    </svg>
  ),
  blue: () => (
    <svg class="w-6 h-6 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22,5.5L17.5,1L12,5.5L6.5,1L1,5.5V18.5L6.5,23L12,18.5L17.5,23L22,18.5V5.5Z" />
    </svg>
  ),
};

export const SceneCard = component$<SceneProps>(({ 
  id, 
  name, 
  artist, 
  memberCount, 
  color, 
  isActive = true,
  isSelected = false,
  onClick$ 
}) => {
  const IconComponent = IconComponents[color as keyof typeof IconComponents] || IconComponents.green;
  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.green;
  
  return (
    <div
      onClick$={() => onClick$?.(id)}
      class={`
        flex items-center space-x-3 cursor-pointer p-2 rounded-md transition-all duration-200
        border-l-5 ${colorClass.split(' ')[0]}
        ${isSelected
          ? 'bg-spotifydarkgray border-opacity-100'
          : 'hover:bg-zinc-900 border-opacity-60 hover:border-opacity-100'
        }
        ${!isActive ? 'opacity-50' : ''}
      `}
    >
      <div class={`${colorClass.split(' ')[1]} w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0`}>
        <IconComponent />
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-white text-sm font-medium truncate">{name}</div>
        <div class="text-gray-400 text-xs flex items-center">
          <span class="truncate">{artist}</span>
          <span class="mx-1">•</span>
          <span>{memberCount} members</span>
          {/* {isActive && (
            <>
              <span class="mx-1">•</span>
              <div class="w-2 h-2 bg-spotifygreen rounded-full animate-pulse"></div>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
});
