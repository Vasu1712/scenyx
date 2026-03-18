export interface Scene {
  id: string;
  name: string;
  artist: string;
  description: string;
  imageUrl: string;
  color: 'green' | 'purple' | 'red' | 'blue';
  memberCount: number;
  isJoined: boolean;
  isActive: boolean;
  currentTrack?: CurrentTrack;
  listeners: number;
  activeUsers: number;
  createdAt: Date;
}

export interface CurrentTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  duration: number;
  position: number;
  isPlaying: boolean;
  spotifyUri: string;
}

export interface SceneMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: number;
  trackId: string;
}

export interface VotingTrack {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  votes: number;
  spotifyUri: string;
}
