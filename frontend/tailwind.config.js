/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design System Colors from UI specs
        'inverse-on-surface': '#eff1f4',
        'surface': '#f7f9fc',
        'surface-bright': '#f7f9fc',
        'tertiary-fixed-dim': '#e0c1a0',
        'tertiary-fixed': '#feddba',
        'on-error-container': '#93000a',
        'outline-variant': '#c4c6cc',
        'background': '#f7f9fc',
        'surface-tint': '#525f71',
        'on-tertiary-fixed': '#281804',
        'on-surface': '#191c1e',
        'on-error': '#ffffff',
        'primary-container': '#0f1c2c',
        'on-primary-container': '#778598',
        'secondary': '#755b00',
        'error': '#ba1a1a',
        'on-primary-fixed-variant': '#3a4859',
        'on-secondary-fixed': '#241a00',
        'surface-dim': '#d8dadd',
        'on-tertiary-container': '#9a7f61',
        'on-surface-variant': '#44474c',
        'on-tertiary-fixed-variant': '#584329',
        'secondary-container': '#fed977',
        'inverse-primary': '#bac8dc',
        'surface-container': '#eceef1',
        'surface-container-low': '#f2f4f7',
        'on-secondary-container': '#785d00',
        'primary': '#000000',
        'inverse-surface': '#2d3133',
        'on-primary-fixed': '#0f1c2c',
        'secondary-fixed': '#ffe08f',
        'tertiary-container': '#281804',
      },
      fontFamily: {
        'display': ['Manrope', 'sans-serif'],
        'headline': ['Manrope', 'sans-serif'],
        'title': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'label': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '4rem' }],
        'headline-md': ['1.75rem', { lineHeight: '2.25rem' }],
        'title-lg': ['1.375rem', { lineHeight: '1.75rem' }],
        'body-md': ['0.875rem', { lineHeight: '1.25rem' }],
        'label-md': ['0.75rem', { lineHeight: '1rem' }],
      },
      fontWeight: {
        'display': '700',
        'headline': '600',
        'title': '600',
        'body': '400',
        'label': '500',
      },
      spacing: {
        '6': '2rem',
        '16': '5.5rem',
      },
      borderRadius: {
        'lg': '0.5rem',
      },
      boxShadow: {
        'ambient': '0 12px 40px rgba(13, 27, 42, 0.06)',
        'glow': '0 0 20px rgba(82, 95, 113, 0.3)',
      },
      backdropBlur: {
        'glass': '20px',
      }
    },
  },
  plugins: [],
}
