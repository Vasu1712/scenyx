import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
// import Infobox from "../components/starter/infobox/infobox";
import Image from '../media/scenyx_name_logo.svg?jsx';
import Footer from "~/components/starter/footer/footer";

export default component$(() => {
  return (
    <>
      <div class="flex flex-col gap-24 justify-center items-center p-8 pt-20 pb-16 bg-black">
        <div class="flex justify-center text-2xl text-center ">
          <Image style={{ width: '300px'}} />
        </div>
        <div class="text-5xl text-center font-semibold text-white">
          Welcome to Spotify Social
        </div>
        <Link href="/login" class="text-spotifygreen font-medium text-xl py-2 px-4 rounded-full border-1 border-green hover:bg-spotifygreen hover:text-black transition duration-300 ease-in-out">
          <p>start listening</p>
        </Link>
        <div class="flex flex-col gap-1 justify-center text-center text-xl font-light text-spotifydarkgray italic">
          <span>a new destination for your Spotify experiences!</span>
        </div>
      </div>
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: "Scenyx",
  meta: [
    {
      name: "Scenyx Webapp",
      content: " Spotify social for music lovers. Connect by taste, join interactive Scenes with AI voting, DM friends, AI profile insights.",
    },
  ],
};
