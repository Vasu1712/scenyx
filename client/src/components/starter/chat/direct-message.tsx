import { component$, useSignal, useVisibleTask$, useStore, $ } from '@builder.io/qwik';

interface DMMessage {
  id: string;
  sender_id: string;
  content: string;
  timestamp: number;
}

interface DirectMessageProps {
  dmId: string;
  userId: string;
  peerName: string;
  peerAvatar?: string;
}

export const DirectMessage = component$<DirectMessageProps>(({ dmId, userId, peerName, peerAvatar }) => {
  const messages = useStore<DMMessage[]>([]);
  const newMessage = useSignal('');
  const wsRef = useSignal<WebSocket | null>(null);
  const chatContainer = useSignal<Element>();

  // Fetch existing messages and open WebSocket
  useVisibleTask$(async ({ cleanup }) => {
    // Fetch message history
    const res = await fetch(`/api/v1/dms/messages?dm_id=${dmId}`);
    const data = await res.json();
    messages.splice(0, messages.length, ...data);

    // Open WebSocket connection
    const ws = new WebSocket(`ws://localhost:8080/ws/dms?dm_id=${dmId}&user_id=${userId}`);
    wsRef.value = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      messages.push(msg);
      setTimeout(() => {
        if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }, 100);
    };

    cleanup(() => {
      ws.close();
    });
  });

  // Send a message (via HTTP and WebSocket)
  const sendMessage = $(async () => {
    if (!newMessage.value.trim()) return;
    const msg = {
      dm_id: dmId,
      sender_id: userId,
      content: newMessage.value.trim(),
    };
    // Send via HTTP for persistence
    await fetch('/api/v1/dms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    // Send via WebSocket for real-time
    wsRef.value?.send(JSON.stringify(msg));
    newMessage.value = '';
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div class="flex flex-col h-full bg-mainbg rounded-lg shadow-lg">
      {/* Header */}
      <div class="flex items-center px-4 py-3 border-b border-spotifygray bg-spotifydarkgray">
        <img src={peerAvatar || '/default-avatar.png'} class="w-10 h-10 rounded-full mr-3" />
        <span class="text-white text-lg font-bold">{peerName}</span>
      </div>
      {/* Messages */}
      <div ref={chatContainer} class="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            class={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              class={`max-w-xs p-2 rounded-lg ${
                msg.sender_id === userId
                  ? 'bg-spotifygreen text-black'
                  : 'bg-spotifydarkgray text-white'
              }`}
            >
              <div class="text-sm">{msg.content}</div>
              <div class="text-xs text-spotifylightgray text-right mt-1">{formatTime(msg.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <div class="flex items-center p-3 border-t border-spotifygray bg-spotifydarkgray">
        <input
          type="text"
          value={newMessage.value}
          onInput$={(e) => (newMessage.value = (e.target as HTMLInputElement).value)}
          onKeyDown$={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          placeholder="Type a message"
          class="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-full outline-none mr-2"
        />
        <button
          onClick$={sendMessage}
          class="bg-spotifygreen text-black px-4 py-2 rounded-full font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
});
