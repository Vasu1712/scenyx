import { component$ } from '@builder.io/qwik';
import { TopTracks } from './top-tracks';
import { TopArtists } from './top-artists';

export interface ProfileData {
  display_name: string;
  images?: { url: string }[];
  id: string;
}

export interface ProfileProps {
  profile: ProfileData;
  accessToken: string;
  sceneCount?: number;
  followerCount?: number;
  chatCount?: number;
  playlistCount?: number;
  aiDescription?: string;
}

export const Profile = component$<ProfileProps>(({
  profile,
  accessToken,
  sceneCount = 9,
  followerCount = 18,
  chatCount = 20,
  playlistCount = 7,
  aiDescription = "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful."
}) => {
  const initial = profile.display_name ? profile.display_name[0].toUpperCase() : 'A';
  
  return (
    <div class="w-full">
      <div class="mb-8 bg-gradient-to-b from-spotifydarkgray to-spotifyblack">
        <div class="flex items-center pt-8 pb-6 px-6">
          <div class="w-32 h-32 bg-spotifydarkgray rounded-full shadow-xl shadow-spotifyblack flex items-center justify-center text-white font-bold text-6xl mr-8">
            {initial}
          </div>
          
          <div class="flex flex-col gap-y-2">
            <p class="text-spotifylightgray mb-4 font-thin">Profile</p>
            <p class="text-white text-6xl font-spotify font-bold mb-2">
              {profile.display_name || 'User'}
            </p>
            
            <div class="text-spotifylightgray font-thin flex gap-2 pb-2">
              <span>{sceneCount} Scenes enlisted</span> •&nbsp;
              <span class="text-spotifygray">{followerCount} Followers</span> •&nbsp;
              <span class="text-spotifygray">{chatCount} Active Chats</span> •&nbsp;
              <span class="text-spotifydarkgray">{playlistCount} Public playlists</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-6 rounded-lg">
        <p class="text-white text-xl mb-3 font-medium">
          What Scenyx thinks about {profile.display_name || 'you'}!
        </p>
        <p class="text-spotifydarkgray font-light text-base">{aiDescription}</p>
      </div>
      {/* Top tracks */}
      <div class="px-6 pb-2 rounded-lg">
        <TopTracks accessToken={accessToken} />
      </div>
      <div class="px-6 pb-6 rounded-lg">
        <TopArtists accessToken={accessToken} />
      </div>
    </div>
  );
});
