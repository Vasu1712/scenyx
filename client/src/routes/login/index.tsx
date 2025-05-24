import { $, component$, useSignal } from '@builder.io/qwik';
import { redirectToSpotifyAuth } from '../../integrations/spotify/auth';
import { useNavigate } from '@builder.io/qwik-city';
import ScenyxLogo from '../../media/scenyx_logo_bw.svg?jsx';
import Footer from '../../components/starter/footer/footer';

export default component$(() => {
  const isLoading = useSignal(false);
  const nav = useNavigate();

  const handleLogin = $(async () => {
    isLoading.value = true;
    try {
      await redirectToSpotifyAuth();
    } catch (error) {
      console.error('Authentication error:', error);
      isLoading.value = false;
    }
  });

  return (
    <div class="flex flex-col min-h-screen bg-mainbg">
      <div class="flex flex-col items-center justify-center grow">
        <div class="w-24 h-24 mb-10">
          <ScenyxLogo class="w-full h-full" />
        </div>
        
        <h1 class="font-spotify font-bold text-4xl mb-16 text-white">
          Log in to Scenyx
        </h1>
        
        <button
          onClick$={handleLogin}
          disabled={isLoading.value}
          class="bg-spotifygreen text-spotifyblack font-spotify font-medium py-3.5 px-8 rounded-full hover:scale-105 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading.value ? 'Connecting...' : 'Continue with Spotify'}
        </button>
      </div>
      <Footer />
    </div>
  );
});
