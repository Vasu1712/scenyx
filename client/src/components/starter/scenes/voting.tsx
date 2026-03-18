import { component$, useSignal, $ } from '@builder.io/qwik';

interface VotingTrack {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  votes: number;
}

interface VotingProps {
  votingTracks: VotingTrack[];
  userVote?: string | null;
  onVote$?: (trackId: string) => void;
}

export const Voting = component$<VotingProps>(({ 
  votingTracks, 
  userVote, 
  onVote$ 
}) => {
  const handleVote = $((trackId: string) => {
    onVote$?.(trackId);
  });

  return (
    <div class="p-6 flex-1 gap-y-6 flex flex-col">
      <h3 class="text-white text-2xl font-medium mb-4">Choose your play</h3>
      <div class="flex w-full h-48 items-center justify-between gap-4">
          <div class="w-3/7 h-full bg-spotifyblack p-8 rounded-2xl">
            <p class="text-spotifygreen text-3xl leading-12 font-medium">
              Vote for the next song you want to listen to
            </p>
          </div>

          <div class="w-5/7 h-48 rounded-2xl flex items-center justify-between">
            <div class="grid grid-cols-2 grow gap-2">
              {votingTracks.map((track) => (
                <div 
                key={track.id}
                onClick$={() => handleVote(track.id)}
                class={`
                  bg-zinc-900 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-102
                  ${userVote === track.id 
                    ? 'border border-spotifygreen bg-spotifygreen bg-opacity-10' 
                    : 'border border-transparent hover:border-spotifygreen'
                  }
                `}
              >
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gradient-to-br from-red-600 to-yellow-600 rounded-lg flex items-center justify-center">
                      <span class="text-white text-lg font-bold">{track.name.charAt(0)}</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-white font-medium text-lg mb-1">{track.name}</h4>
                      <p class="text-gray-400 font-light text-sm">{track.artist}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div class="w-1/20 h-48 bg-spotifygreen p-4 rounded-2xl flex items-center justify-center hover:bg-spotifygreen/90">
            <button class="flex flex-col align-center justify-center text-spotifyblack text-2xl font-bold cursor-pointer">
              <span>V</span>
              <span>O</span>
              <span>T</span>
              <span>E</span>
            </button>
          </div>
      </div>
    </div>
  );
});
