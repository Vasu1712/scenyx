import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initializeSceneSocket(sceneId: string, user: any, accessToken: string) {
  if (socket) {
    socket.disconnect();
  }

  socket = io('wss://your-backend-url.com', {
    auth: {
      token: accessToken,
      userId: user.id,
      sceneId
    }
  });

  socket.on('connect', () => {
    console.log('Connected to scene socket');
    socket?.emit('join_scene', { sceneId, user });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from scene socket');
  });

  return socket;
}

export function getSceneSocket() {
  return socket;
}
