import { component$, useSignal, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

interface DMConversation {
  id: string;
  participants: [string, string];
  messages: any[];
}

interface ChatsProps {
  currentUserId: string;
  conversations: DMConversation[];
  onChatSelect$?: (dmId: string, peerName: string, peerUserId: string) => void;
  selectedChatId?: string | null;
}

export const Chats = component$<ChatsProps>(({ 
  currentUserId,
  conversations,
  onChatSelect$,
  selectedChatId
}) => {
  const isExpanded = useSignal(true);
  const nav = useNavigate();

const handleStartChatting = $(() => {
  nav('/dashboard/explore');
});

  const handleChatClick = $((conversation: DMConversation) => {
    const peerUserId = conversation.participants.find(id => id !== currentUserId);
    const peerName = peerUserId || 'Unknown User';
    onChatSelect$?.(conversation.id, peerName, peerUserId || '');
  });

  return (
    <div class="w-full mt-6">
      <div
        class="flex justify-between items-center mb-4 cursor-pointer"
        onClick$={() => isExpanded.value = !isExpanded.value}
      >
        <p class="text-spotifygray text-xl px-2 font-spotify font-regular">Chats</p>
        <svg
          class={`text-gray-300 text-3xl transition-transform ${isExpanded.value ? 'rotate-0' : '-rotate-90'}`}
          xmlns="http://www.w3.org/2000/svg"
          width={24} 
          height={24}
          viewBox="-5 -8 24 24"
        >
          <path fill="#BCBCBC" d="m7.071 5.314l4.95-4.95a1 1 0 1 1 1.414 1.414L7.778 7.435a1 1 0 0 1-1.414 0L.707 1.778A1 1 0 1 1 2.121.364z"></path>
        </svg>
      </div>

      {isExpanded.value && (
        <div class="space-y-1">
          {conversations.length === 0 ? (
            // No previous chats - show start chatting button
            <div class="px-2 py-4 flex flex-col justify-center items-center">
              <p class="text-spotifydarkgray text-xs text-center mt-2 font-light italic">
                no chats yet, go ahead and create one!
              </p>
              <button
                onClick$={handleStartChatting}
                class="w-1/2 bg-spotifygreen text-black py-2 px-4 cursor-pointer mt-8 rounded-full font-spotify font-medium hover:bg-opacity-90 transition-colors"
              >
                start chatting
              </button>
            </div>
          ) : (
            // Previous chats exist - render chat list
            <>
              {conversations.map((conversation) => {
                const peerUserId = conversation.participants.find(id => id !== currentUserId);
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                const isSelected = selectedChatId === conversation.id;
                
                return (
                  <div
                    key={conversation.id}
                    onClick$={() => handleChatClick(conversation)}
                    class={`
                      flex items-center px-2 py-3 cursor-pointer rounded-md transition-colors
                      ${isSelected ? 'bg-spotifydarkgray' : 'hover:bg-zinc-900'}
                    `}
                  >
                    {/* User Avatar */}
                    <div class="relative mr-3">
                      <div class="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-white overflow-hidden">
                        <span class="text-lg">{peerUserId?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                      {/* Online indicator */}
                      <div class="absolute bottom-0 right-0 w-3 h-3 bg-spotifygreen rounded-full border-2 border-black"></div>
                    </div>
                    
                    {/* Chat Info */}
                    <div class="flex-1 min-w-0">
                      <div class="text-white text-base font-medium truncate">
                        {peerUserId || 'Unknown User'}
                      </div>
                      <div class="text-spotifylightgray text-sm truncate">
                        {lastMessage ? lastMessage.content : 'No messages yet'}
                      </div>
                    </div>
                    
                    {/* Message count */}
                    {conversation.messages.length > 0 && (
                      <div class="bg-zinc-700 text-white text-xs min-w-6 h-6 rounded-full flex items-center justify-center px-1.5">
                        {conversation.messages.length}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
});
