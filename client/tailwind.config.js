/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sfpro: ["SF-Pro", "system-ui"],
        spotify: ["Spotify Mix", "system-ui"],
      },
      height: {
        "1/10": "10%",
        "9/10": "90%"
      },
    },
    colors: {
      mainbg: "#000000",
      spotifygreen: "#1DB954",
      spotifyblack: "#191414",
      spotifydark: "#121212",
      spotifygray: "#535353",
      spotifylightgray: "#B3B3B3",
      spotifywhite: "#FFFFFF",
      footergray: "#575757",
    }
  },
  plugins: [],
}
