import { component$ } from '@builder.io/qwik';

export interface SceneProps {
  id: string;
  name: string;
  artist: string;
  memberCount: number;
  color: string;
}

const colorClasses = {
  green: "bg-green-600",
  purple: "bg-purple-600",
  red: "bg-red-800",
  blue: "bg-blue-600",
};

const IconComponents = {
  green: () => (
    <svg class="w-8 h-8 text-green-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5,0.67C13.5,0.67 12.5,0.33 11,0.5C9,0.67 9,1 9,1C8.29,1.42 8,2.67 8,2.67C8,2.67 7.29,0.42 6,0.67C5.33,0.67 4.67,1.33 4.67,1.33C4.67,1.33 4,2 4,4C4,6 6,8 6,8C6,8 8,10 9,12C9,12 10,10 12,8C14,6 14,4 14,4C14,4 14,2 13.5,0.67M20,14C20,14 20,16 18,18C16,20 13,21 13,21C13,21 12.33,16.67 14.67,14.33C17,12 20,14 20,14M15.5,14.5C15.5,14.5 14,15 12.5,16.5C11,18 10,20 10,20C10,20 10.5,17.67 12,16.17C13.5,14.67 15.5,14.5 15.5,14.5Z" />
    </svg>
  ),
  purple: () => (
    <svg class="w-8 h-8 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z" />
    </svg>
  ),
  red: () => (
    <svg class="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
    </svg>
  ),
  blue: () => (
    <svg class="w-8 h-8 text-blue-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22,5.5L17.5,1L12,5.5L6.5,1L1,5.5V18.5L6.5,23L12,18.5L17.5,23L22,18.5V5.5M6.5,18.2L5,17V15L6.5,13.5L8,15V17L6.5,18.2M6.5,10.8L5,9.7V7.7L6.5,6.2L8,7.7V9.7L6.5,10.8M17.5,18.2L16,17V15L17.5,13.5L19,15V17L17.5,18.2M17.5,10.8L16,9.7V7.7L17.5,6.2L19,7.7V9.7L17.5,10.8M12,13.5L10.5,15V17L12,18.2L13.5,17V15L12,13.5Z" />
    </svg>
  ),
};

export const SceneCard = component$<SceneProps>(({ name, artist, memberCount, color }) => {
  const IconComponent =  IconComponents.green;
  
  return (
    <div class="flex items-center space-x-3 cursor-pointer hover:bg-zinc-900 p-2 rounded-md transition-colors">
      <div class={`${colorClasses[color as keyof typeof colorClasses] || colorClasses.green} w-10 h-10 rounded-md flex items-center justify-center`}>
        <IconComponent />
      </div>
      <div class="flex flex-col ">
        <div class="text-spotifylightgray text-base font-regular">{name}</div>
        <div class="text-spotifydarkgray text-xs font-thin flex items-center">
          {artist} <span class="mx-1 text-spotifydullgray">•</span> <p class="font-regular text-spotifygray">{memberCount} members</p>
        </div>
      </div>
    </div>
  );
});
