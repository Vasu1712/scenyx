import { component$ } from "@builder.io/qwik";
import { SearchIcon } from "../icons/searchicon";

export default component$(() => {

  return (
    <div class="flex justify-center items-center py-4">
        <div class="flex justify-around items-center bg-searchbargray w-2/5 h-16 rounded-full">
            <span class="text-xl font-light text-center text-white/60">
                What do you want to stack your cart with?
            </span>
            <SearchIcon />
        </div>
    </div>
  );
});
