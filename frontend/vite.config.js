import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ react(),tailwindcss()],
  build:{
    rollupOptions:{
      output:{
        manualChunks:{
          react:['react','react-dom'],
          stripe:['@stripe/react-stripe-js', '@stripe/stripe-js'],
          charts:['recharts'],
          motion:['framer-motion', 'motion']
        }
      }
    }
  },
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:5000'
      }
    }
  }
})
