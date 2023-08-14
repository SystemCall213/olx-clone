/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'primaryColor': '#002f34',
        darkTheme_dark_blue: '#27374D',
        darkTheme_blue: '#526D82',
        'darkTheme_light_gray': '#9DB2BF',
        'darkTheme_light': '#DDE6ED',
        'custom_yellow': 'rgb(255,255,0)',
        'moon_color': '#F6F1D5',
        'beige': '#fffbef'
      },
      width: {
        '2xl': '1240px',
        'xl': '1024px',
        'lg': '768px',
        'md': '640px',
        'sm': '432px',
        'xs':'300px'
      },
      height: {
        '656': '656px'
      },
      minWidth: {
        '112': '112px'
      },
      maxHeight: {
        '320': '320px'
      },
      fontSize: {
        '4xl': '2.3rem'
      }
    },
  },
  plugins: [],
}

