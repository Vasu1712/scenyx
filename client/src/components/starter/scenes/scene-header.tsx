import { component$ } from '@builder.io/qwik';

interface SceneHeaderProps {
  sceneName: string;
  sceneArtist: string;
  listeners: number;
  activeUsers: number;
  onBack$?: () => void;
  onChatToggle$?: () => void;
  isChatOpen: boolean;
}

export const SceneHeader = component$<SceneHeaderProps>(({ 
  sceneName,
  sceneArtist,
  listeners,
  activeUsers,
  onBack$,
  isChatOpen
}) => {
  return (
    <div class="bg-spotifyblack px-4 py-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          {/* Back Button */}
          <button 
            onClick$={onBack$}
            class="mr-4 p-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scene Icon */}
          <div class="w-24 h-24 bg-spotifygreen rounded-xl flex items-center justify-center mr-6">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div>
            <h1 class="text-white text-6xl font-bold mb-2">{sceneName}</h1>
            <div class="flex items-center text-gray-400 p-2">
              <span class="font-light">{sceneArtist}</span>
              <span class="mx-2">•</span>
              <span class="font-light">{listeners} listeners</span>
              <span class="mx-2">•</span>
              <span class="text-spotifygreen font-regular">{activeUsers} active</span>
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div class="flex items-center space-x-4 pr-4">
          {/* User Icon */}
          <div class="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors">
            <svg width="24" height="24" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.86 4.27961C12.0653 4.27961 11.2783 4.43616 10.544 4.7403C9.80972 5.04444 9.14254 5.49023 8.58056 6.05222C8.01857 6.6142 7.57278 7.28138 7.26863 8.01565C6.96448 8.74992 6.80794 9.5369 6.80794 10.3317C6.80794 11.1264 6.96448 11.9134 7.26863 12.6477C7.57278 13.382 8.01857 14.0491 8.58056 14.6111C9.14254 15.1731 9.80972 15.6189 10.544 15.923C11.2783 16.2272 12.0653 16.3837 12.86 16.3837C14.4651 16.3837 16.0045 15.7461 17.1395 14.6111C18.2745 13.4761 18.9121 11.9368 18.9121 10.3317C18.9121 8.72656 18.2745 7.1872 17.1395 6.05222C16.0045 4.91724 14.4651 4.27961 12.86 4.27961ZM5.29492 10.3317C5.29492 8.32529 6.09196 6.40108 7.51069 4.98236C8.92942 3.56363 10.8536 2.7666 12.86 2.7666C14.8664 2.7666 16.7906 3.56363 18.2094 4.98236C19.6281 6.40108 20.4251 8.32529 20.4251 10.3317C20.4251 12.338 19.6281 14.2623 18.2094 15.681C16.7906 17.0997 14.8664 17.8967 12.86 17.8967C10.8536 17.8967 8.92942 17.0997 7.51069 15.681C6.09196 14.2623 5.29492 12.338 5.29492 10.3317Z" fill="#15C97F"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.53723 28.4865H3.78255C3.98319 28.4865 4.17561 28.5662 4.31749 28.7081C4.45936 28.85 4.53906 29.0424 4.53906 29.243C4.53906 29.4437 4.45936 29.6361 4.31749 29.778C4.17561 29.9198 3.98319 29.9995 3.78255 29.9995H0.75651C0.555871 29.9995 0.36345 29.9198 0.221577 29.778C0.0797035 29.6361 0 29.4437 0 29.243C5.08258e-08 25.8322 1.35496 22.561 3.76681 20.1492C6.17865 17.7374 9.44981 16.3824 12.8607 16.3824C16.2715 16.3824 19.5427 17.7374 21.9546 20.1492C24.3664 22.561 25.7214 25.8322 25.7214 29.243C25.7214 29.4437 25.6417 29.6361 25.4998 29.778C25.3579 29.9198 25.1655 29.9995 24.9648 29.9995H8.32162C8.12098 29.9995 7.92856 29.9198 7.78668 29.778C7.64481 29.6361 7.5651 29.4437 7.5651 29.243C7.5651 29.0424 7.64481 28.85 7.78668 28.7081C7.92856 28.5662 8.12098 28.4865 8.32162 28.4865H24.1841C23.996 25.6113 22.7212 22.9154 20.6183 20.9456C18.5155 18.9758 15.742 17.8798 12.8607 17.8798C9.97934 17.8798 7.20589 18.9758 5.10302 20.9456C3.00014 22.9154 1.72534 25.6113 1.53723 28.4865ZM22.199 5.03483C22.199 5.23546 22.2787 5.42789 22.4206 5.56976C22.5625 5.71163 22.7549 5.79133 22.9556 5.79133H31.5132C31.7138 5.79133 31.9063 5.71163 32.0481 5.56976C32.19 5.42789 32.2697 5.23546 32.2697 5.03483C32.2697 4.83419 32.19 4.64177 32.0481 4.4999C31.9063 4.35802 31.7138 4.27832 31.5132 4.27832H22.9556C22.7549 4.27832 22.5625 4.35802 22.4206 4.4999C22.2787 4.64177 22.199 4.83419 22.199 5.03483Z" fill="#15C97F"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M27.234 10.0721C27.0334 10.0721 26.841 9.99243 26.6991 9.85055C26.5572 9.70868 26.4775 9.51626 26.4775 9.31562V0.756507C26.4775 0.555869 26.5572 0.363448 26.6991 0.221576C26.841 0.0797033 27.0334 0 27.234 0C27.4347 0 27.6271 0.0797033 27.769 0.221576C27.9109 0.363448 27.9906 0.555869 27.9906 0.756507V9.31562C27.9906 9.51626 27.9109 9.70868 27.769 9.85055C27.6271 9.99243 27.4347 10.0721 27.234 10.0721Z" fill="#15C97F"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});
