import { component$, useSignal, useStore, useTask$, $ } from '@builder.io/qwik';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: number;
  trackId: string;
}

interface SceneChatProps {
  sceneId: string;
  currentTrack: any;
  currentUser: any;
  socket: any;
  onClose$?: () => void; // Added close prop
}

export const SceneChat = component$<SceneChatProps>(({
  sceneId,
  currentTrack,
  currentUser,
  socket,
  onClose$
}) => {
  const messages = useStore<ChatMessage[]>([]);
  const newMessage = useSignal('');
  const chatContainer = useSignal<Element>();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = $(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });

  // Send message
  const sendMessage = $(async () => {
    if (!newMessage.value.trim() || !currentUser) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.display_name,
      avatar: currentUser.images?.[0]?.url || '',
      message: newMessage.value.trim(),
      timestamp: Date.now(),
      trackId: currentTrack.id
    };

    // Add message to local state (since socket is null for now)
    messages.push(message);
    scrollToBottom();

    // Emit to socket for real-time distribution (when available)
    if (socket) {
      socket.emit('scene_message', {
        sceneId,
        message
      });
    }

    newMessage.value = '';
  });

  useTask$(({ cleanup }) => {
    if (!socket) return;

    // Listen for new messages
    socket.on('new_message', (message: ChatMessage) => {
      // Only show messages for current track
      if (message.trackId === currentTrack.id) {
        messages.push(message);
        scrollToBottom();
      }
    });

    // Listen for track changes (clear chat)
    socket.on('track_changed', () => {
      // Clear messages when track changes
      messages.length = 0;
    });

    // Load existing messages for current track
    socket.emit('get_track_messages', {
      sceneId,
      trackId: currentTrack.id
    });

    socket.on('track_messages', (trackMessages: ChatMessage[]) => {
      messages.splice(0, messages.length, ...trackMessages);
      scrollToBottom();
    });

    cleanup(() => {
      socket.off('new_message');
      socket.off('track_changed');
      socket.off('track_messages');
    });
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div class="flex flex-col h-full">
      {/* Chat Header with Close Button */}
      <div class="p-4 border-b border-zinc-800 bg-zinc-900">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white font-medium">Live Chat</h3>
            <p class="text-gray-400 text-sm">for "{currentTrack.name}"</p>
          </div>
          
          {/* Close Button */}
          <button
            onClick$={onClose$}
            class="p-2 rounded-full hover:bg-zinc-800 transition-colors group"
            title="Close Chat"
          >
            <svg
              class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainer}
        class="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <div class="text-center text-gray-500 mt-8">
            <p>No messages yet.</p>
            <p class="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} class="flex space-x-3">
              <img 
                src={msg.avatar || '/default-avatar.png'}
                alt={msg.username}
                class="w-8 h-8 rounded-full flex-shrink-0"
              />
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="text-white text-sm font-medium">{msg.username}</span>
                  <span class="text-gray-400 text-xs">{formatTime(msg.timestamp)}</span>
                </div>
                <p class="text-gray-300 text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div class="p-4 border-t border-zinc-800 bg-zinc-900">
        <div class="flex space-x-2">
          <input
            type="text"
            value={newMessage.value}
            onInput$={(e) => newMessage.value = (e.target as HTMLInputElement).value}
            onKeyDown$={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            placeholder={`Chat about "${currentTrack.name}"`}
            class="flex-1 bg-zinc-800 text-white px-3 py-2 rounded-lg border border-zinc-700 focus:border-spotifygreen outline-none"
          />
          <button
            onClick$={sendMessage}
            disabled={!newMessage.value.trim()}
            class="bg-spotifygreen text-black px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
});
