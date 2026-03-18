const API_BASE = "http://localhost:8080/api/v1/dms";

// Start or get a DM conversation
export async function startOrGetConversation(user1: string, user2: string) {
  const res = await fetch(`${API_BASE}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user1, user2 }),
  });
  if (!res.ok) throw new Error("Failed to start/get DM");
  return res.json();
}

// List all DM conversations for a user
export async function listConversations(userId: string) {
  const res = await fetch(`${API_BASE}/list?user_id=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error("Failed to list DMs");
  return res.json();
}

// Get messages in a DM
export async function getMessages(dmId: string) {
  const res = await fetch(`${API_BASE}/messages?dm_id=${encodeURIComponent(dmId)}`);
  if (!res.ok) throw new Error("Failed to get messages");
  return res.json();
}

// Send a message in a DM
export async function sendMessage(dmId: string, senderId: string, content: string) {
  const res = await fetch(`${API_BASE}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dm_id: dmId, sender_id: senderId, content }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
