import { $, component$, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { Link, useNavigate } from "@builder.io/qwik-city";
import ScenyxNameHeader from '../../../media/scenyx_name_header.svg?jsx';

export const Header = component$(() => {
  const showDropdown = useSignal(false);
  const nav = useNavigate();
  const user = useStore({
    name: '',
    initial: ''
  });
  
  useVisibleTask$(() => {
    const userData = localStorage.getItem('spotify_user_data');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      user.name = parsedUser.display_name || 'User';
      user.initial = user.name.charAt(0).toUpperCase();
    } else {
      // Redirect to login
      nav('/login');
    }
  });
  
  const handleLogout = $(() => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_user_data');
    nav('/login');
  });

  return (
    <header class="flex justify-between items-center px-4 pt-4 pb-2">
      <div class="flex items-center">
        <ScenyxNameHeader class="h-8" />
      </div>
      
      {/* User profile */}
      <div class="relative">
        <button
          onClick$={() => showDropdown.value = !showDropdown.value}
          class="flex items-center gap-2 bg-spotifygreen px-2 py-1 rounded-full"
        >
          <div class="w-6 h-6 bg-black text-spotifygray rounded-full flex items-center justify-center font-regular text-xs">
            {user.initial}
          </div>
          <span class="text-black font-medium">{user.name}</span>
          <svg
              class={`w-4 h-4 transition-transform ${showDropdown.value ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              width="1024" height="1280"
              viewBox="0 0 1024 1280">
            <path fill="1ED760" d="M1024 448q0 26-19 45L557 941q-19 19-45 19t-45-19L19 493Q0 474 0 448t19-45t45-19h896q26 0 45 19t19 45" />
          </svg>
        </button>
        
        {/* Dropdown menu */}
        {showDropdown.value && (
          <div class="absolute right-0 bg-spotifydarkgray text-spotifylightgray text-sm mt-2 w-36 rounded-md shadow-lg z-10 hover:bg-spotifydarkgray">
            <div class="py-1">
              <button
                onClick$={handleLogout}
                class="block w-full text-left px-4 py-1.5"
              >
                Logout
              </button>
            </div>
            <div class="border-t-1 border-spotifygray mx-2"></div>
            <div>
              <Link
                href='/help'
                class="block w-full text-left px-4 py-2 "
              >
                Help
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});
