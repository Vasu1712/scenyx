import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { SceneView } from '~/components/starter/scenes/scene-view';

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  const scene = useSignal<any>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const accessToken = useSignal('');

  useVisibleTask$(async ({ track }) => {
    // Track the scene ID from the URL. This re-runs the task when the ID changes.
    track(() => location.params.id);

    // Reset state for the new scene
    loading.value = true;
    error.value = null;
    scene.value = null;

    const sceneId = location.params.id;
    const token = localStorage.getItem('spotify_access_token');

    if (!token) {
      nav('/login');
      return;
    }
    accessToken.value = token;

    if (!sceneId) {
      error.value = 'No scene ID provided';
      loading.value = false;
      return;
    }

    try {
      console.log(`Fetching data for scene ID: ${sceneId}`);
      const response = await fetch('http://localhost:8080/api/v1/scenes/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sceneID: sceneId })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      scene.value = data;
      console.log('Scene data fetched:', data);

    } catch (err) {
      console.error('Error fetching scene data:', err);
      error.value = 'Failed to load scene data';
    } finally {
      loading.value = false;
    }
  });

  const handleBack = $(() => {
    nav('/dashboard/profile');
  });

  if (loading.value) {
    return <div class="flex items-center justify-center h-full text-white">Loading Scene...</div>;
  }

  if (error.value) {
    return <div class="flex items-center justify-center h-full text-red-500">{error.value}</div>;
  }

  if (!scene.value) {
    return <div class="flex items-center justify-center h-full text-white">Scene not found.</div>;
  }

  return (
    <SceneView
      scene={scene.value}
      accessToken={accessToken.value}
      onBack$={handleBack}
    />
  );
});
