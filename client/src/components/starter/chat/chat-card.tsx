import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

interface ChatUser {
  id: string;
  name: string;
  isOnline: boolean;
  avatar?: string;
  initial: string;
  unreadCount: number; // Added unread count
}

export const ChatCard = component$(() => {
  const chatUsers: ChatUser[] = [
    { id: '1', name: 'Alexis MacAllister', isOnline: true, initial: 'J', unreadCount: 2 },
    { id: '2', name: 'Ryan Gravenberch', isOnline: true, initial: 'R', unreadCount: 1 },
    { id: '3', name: 'Lamine Yamal', isOnline: true, initial: 'L', unreadCount: 4 },
    { id: '4', name: 'Mohammed Salah', isOnline: false, initial: 'M', unreadCount: 2 },
    { id: '5', name: 'Virgil Van Dijk', isOnline: true, initial: 'V', unreadCount: 1 },
    { id: '6', name: 'Federico Chiesa', isOnline: false, initial: 'F', unreadCount: 4 }
  ];

  return (
    <div class="space-y-1 mt-2">
      {chatUsers.map(user => (
        <Link
          key={user.id}
          href={`/messages/${user.id}`}
          class="flex items-center px-2 py-1.5 rounded-md hover:bg-zinc-900 transition-colors cursor-pointer"
        >
          <div class="relative mr-3">
            <div class="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} class="w-full h-full object-cover" />
              ) : (
                <span class="text-base font-medium">{user.initial}</span>
              )}
            </div>
            {user.isOnline && (
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-spotifygreen rounded-full border-2 border-black"></div>
            )}
          </div>
          <span class="text-spotifylightgray font-light text-sm flex-1 truncate">{user.name}</span>
          {user.unreadCount > 0 && (
            <div class="bg-spotifylightgray font-medium text-black text-xs w-4 min-h-4 rounded-full flex items-center justify-center px-1.5">
              {user.unreadCount}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
});
