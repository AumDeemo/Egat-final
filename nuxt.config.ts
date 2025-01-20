// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css'],
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    // Simple usage
    '@nuxtus/nuxt-localtunnel'
    
  ],
  googleFonts: {
    families: {
      Sarabun: [400, 700],
      Inter: [400, 700], 
      Kanit: [400, 700], 
      Prompt: [400,500,600, 700], 
    },
    display: 'swap',
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  localtunnel: {} 
})