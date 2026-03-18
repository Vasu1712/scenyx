import { component$, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const nav = useNavigate();

  useVisibleTask$(() => {
    // Redirect to profile as the default dashboard route
    nav('/dashboard/profile');
  });

  return (
    <div class="flex items-center justify-center h-full">
      <div class="text-white">Redirecting...</div>
    </div>
  );
});
