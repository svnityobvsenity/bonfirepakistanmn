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
          primary: '#36393f',
          secondary: '#2f3136',
          tertiary: '#202225',
          hover: '#40444b',
          blurple: '#5865f2',
          green: '#3ba55d',
          yellow: '#faa61a',
          red: '#ed4245',
          'text-primary': '#ffffff',
          'text-secondary': '#b9bbbe',
          'text-muted': '#72767d',
          'text-dimmed': '#4f545c',
          'channel-selected': '#42464d',
          'message-hover': '#32353b',
          divider: '#40444b',
        },
      },
      fontFamily: {
        discord: ['Whitney', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      width: {
        'server-list': '72px',
        'channel-list': '240px',
      },
      spacing: {
        'server-list': '72px',
        'channel-list': '240px',
      },
    },
  },
  plugins: [],
}
