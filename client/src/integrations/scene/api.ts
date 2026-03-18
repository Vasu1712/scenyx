// import type { Scene, VotingTrack } from '~/utils/types';

// // Mock data for testing - replace with real API calls
// const mockScenes: Scene[] = [
//   {
//     id: 'geetan-di-machine',
//     name: 'Geetan Di Machine',
//     artist: 'Karan Aujla',
//     description: 'A community for Karan Aujla fans',
//     imageUrl: '/images/karan-aujla.jpg',
//     color: 'purple',
//     memberCount: 5,
//     isJoined: true,
//     isActive: true,
//     listeners: 91998935,
//     activeUsers: 935,
//     createdAt: new Date('2024-01-15'),
//     currentTrack: {
//       id: 'track_wavy_123',
//       name: 'Wavy',
//       artist: 'Karan Aujla',
//       album: 'It Was All A Dream',
//       imageUrl: '/images/wavy-album.jpg',
//       duration: 181000,
//       position: 65000,
//       isPlaying: true,
//       spotifyUri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh'
//     }
//   },
//   {
//     id: 'coldplay-scene',
//     name: 'Coldplay Scene',
//     artist: 'Coldplay',
//     description: 'Official Coldplay community',
//     imageUrl: '/images/coldplay.jpg',
//     color: 'green',
//     memberCount: 36,
//     isJoined: false,
//     isActive: true,
//     listeners: 5000000,
//     activeUsers: 1200,
//     createdAt: new Date('2024-01-10')
//   },
//   {
//     id: 'diljit-dosanjh-scene',
//     name: 'Diljit Dosanjh Scene',
//     artist: 'Diljit Dosanjh',
//     description: 'Punjabi music lovers unite',
//     imageUrl: '/images/diljit.jpg',
//     color: 'red',
//     memberCount: 52,
//     isJoined: false,
//     isActive: true,
//     listeners: 3000000,
//     activeUsers: 800,
//     createdAt: new Date('2024-01-12')
//   },
//   {
//     id: 'anuv-jain-scene',
//     name: 'Anuv Jain Scene',
//     artist: 'Anuv Jain',
//     description: 'Indie music community',
//     imageUrl: '/images/anuv.jpg',
//     color: 'blue',
//     memberCount: 52,
//     isJoined: false,
//     isActive: false,
//     listeners: 1500000,
//     activeUsers: 400,
//     createdAt: new Date('2024-01-08')
//   }
// ];

// export async function getUserScenes(accessToken: string): Promise<Scene[]> {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   // Filter to show only joined scenes
//   return mockScenes.filter(scene => scene.isJoined);
// }

// export async function getAllScenes(accessToken: string): Promise<Scene[]> {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 500));
//   return mockScenes;
// }

// export async function getSceneById(sceneId: string, accessToken: string): Promise<Scene | null> {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 300));
//   return mockScenes.find(scene => scene.id === sceneId) || null;
// }

// export async function joinScene(sceneId: string, accessToken: string): Promise<boolean> {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 300));
  
//   const scene = mockScenes.find(s => s.id === sceneId);
//   if (scene) {
//     scene.isJoined = true;
//     scene.memberCount += 1;
//     return true;
//   }
//   return false;
// }

// export async function leaveScene(sceneId: string, accessToken: string): Promise<boolean> {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 300));
  
//   const scene = mockScenes.find(s => s.id === sceneId);
//   if (scene) {
//     scene.isJoined = false;
//     scene.memberCount -= 1;
//     return true;
//   }
//   return false;
// }

// export async function getVotingTracks(sceneId: string, accessToken: string): Promise<VotingTrack[]> {
//   // Mock voting tracks for "Geetan Di Machine" scene
//   return [
//     {
//       id: 'winning-speech',
//       name: 'Winning Speech',
//       artist: 'Karan Aujla, Ft. Jazzy',
//       imageUrl: '/images/winning-speech.jpg',
//       votes: 15,
//       spotifyUri: 'spotify:track:1234567890'
//     },
//     {
//       id: 'white-brown-black',
//       name: 'White Brown Black',
//       artist: 'Karan Aujla, Avvy Sra',
//       imageUrl: '/images/white-brown-black.jpg',
//       votes: 8,
//       spotifyUri: 'spotify:track:1234567891'
//     },
//     {
//       id: '52-bars',
//       name: '52 Bars',
//       artist: 'Karan Aujla, Shrey',
//       imageUrl: '/images/52-bars.jpg',
//       votes: 12,
//       spotifyUri: 'spotify:track:1234567892'
//     },
//     {
//       id: 'idk-how',
//       name: 'IDK How?',
//       artist: 'Karan Aujla',
//       imageUrl: '/images/idk-how.jpg',
//       votes: 5,
//       spotifyUri: 'spotify:track:1234567893'
//     }
//   ];
// }
