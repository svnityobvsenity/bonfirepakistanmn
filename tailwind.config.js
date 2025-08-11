/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          'dark': '#36393f',
          'darker': '#2f3136',
          'darkest': '#202225',
          'blurple': '#5865f2',
          'green': '#57f287',
          'yellow': '#fee75c',
          'fuchsia': '#eb459e',
          'red': '#ed4245',
          'white': '#ffffff',
          'greyple': '#99aab5',
          'dark-but-not-black': '#2c2f33',
          'not-quite-black': '#23272a',
        }
      }
    },
  },
  plugins: [],
}