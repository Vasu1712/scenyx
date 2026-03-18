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
  aiDescription = "Vasu's musical journey is a rich tapestry woven from diverse threads. You'll often find them immersed in the emotive melodies of Arijit Singh, Ed Sheeran, KK, and Atif Aslam, valuing powerful vocals and heartfelt lyricism. But their playlist quickly shifts to the energetic beats of Karan Aujla and the soulful depth of Satinder Sartaaj. Vasu's ears are also tuned to the raw, lyrical prowess of Indian hip-hop, featuring Kr$naa and Seedhe Maut. This eclectic mix showcases an open-minded listener who appreciates both global mainstream appeal and deeply rooted, culturally rich sounds."
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
