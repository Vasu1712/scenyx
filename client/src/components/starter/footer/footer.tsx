import { component$ } from "@builder.io/qwik";
// import { useServerTimeLoader } from "../../../routes/layout";

export default component$(() => {
  // const serverTime = useServerTimeLoader();

  return (
    <footer>
      <div class="pt-20 text-footergray">
        <a href="https://www.vasupal.com/" target="_blank" class="text-center block text-sm">
          <span>Made with ❤️ by vasu1712</span>
          <span class="px-2">©</span>
          <span>2025 All Rights Reserved</span>
        </a>
      </div>
    </footer>
  );
});
